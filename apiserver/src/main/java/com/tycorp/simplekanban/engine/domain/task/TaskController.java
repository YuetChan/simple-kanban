package com.tycorp.simplekanban.engine.domain.task;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.simplekanban.engine.core.GsonHelper;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.tag.Tag;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.*;
import com.tycorp.simplekanban.engine.domain.task.value.Priority;
import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.json.Json;
import javax.json.JsonObjectBuilder;
import java.lang.reflect.Type;
import java.util.*;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

   // Services
   @Autowired
   private TaskService taskService;

   // Repositories
   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private ProjectRepository projectRepository;

   // Default task validators
   @Autowired
   private DefaultTaskGetValidator defaultTaskGetValidator;

   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getTaskById(@PathVariable(name = "id") String id) {
      ValidationResult validationResult = defaultTaskGetValidator.validate(id);

      if(validationResult.isValid()) {
         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.add(
                 "task",
                 GsonHelper
                         .getExposeSensitiveGson()
                         .toJsonTree(taskRepository.findById(id).get(), Task.class));
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }

      return new ResponseEntity<>(validationResult.getErrorMsg(), HttpStatus.BAD_REQUEST);
   }

   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchTasks(@RequestParam(name = "start") int start,
                                             @RequestParam(name = "pageSize") int pageSize,
                                             @RequestParam(name = "projectId") String projectId,
                                             @RequestParam(name = "tags") Optional<List<String>> tagListMaybe) {
      Optional<Project> projectMaybe = projectRepository.findById(projectId);

      if(!projectMaybe.isPresent()) {
         LOGGER.debug("Project: [{}] not found", projectId);
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      Page<Task> page = taskRepository.findByParams(
              projectId,
              false,
              tagListMaybe.orElse(new ArrayList<>()),
              PageRequest.of(start, pageSize));
      List<Task> taskList = page.getContent();

      LOGGER.debug("Found total of {} tasks", taskList.size());

      for(var task : taskList) {
         for(var tag : task.getTagList()) {
            tag.setProjectId(projectId);
         }
      }

      Type taskListType = new TypeToken<ArrayList<Task>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      dataJson.add(
              "tasks",
              GsonHelper
                      .getExposeSensitiveGson()
                      .toJsonTree(taskList, taskListType));
      dataJson.addProperty("totalPage", page.getTotalPages());

      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createTask(@RequestBody String reqJsonStr)  {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject taskJson = dataJson.get("task").getAsJsonObject();

      try {
         System.out.println(new ObjectMapper().readValue(taskJson.get("tagList").toString(), Tag[].class));
      } catch (JsonProcessingException e) {
         throw new RuntimeException(e);
      }

      try {
         TaskService.CreateModel model  = new TaskService.CreateModel(
                 taskJson.get("title").getAsString(),
                 taskJson.get("description").getAsString(),
                 taskJson.get("note").getAsString(),

                 Priority.valueOf(taskJson.get("priority").getAsString()),
                 taskJson.get("assigneeEmail").getAsString(),
                 taskJson.get("dueAt").getAsLong(),

                 Arrays.asList(new ObjectMapper().readValue(taskJson.get("tagList").toString(), Tag[].class)),

                 taskJson.get("taskNode").getAsJsonObject().get("headUUID").getAsString(),
                 taskJson.get("taskNode").getAsJsonObject().get("tailUUID").getAsString(),
                 Status.valueOf(taskJson.get("taskNode").getAsJsonObject().get("status").getAsString()),
                 taskJson.get("taskNode").getAsJsonObject().get("projectId").getAsString()
                 );

         Task task = taskService.create(model);

         JsonObjectBuilder taskJsonBuilder = Json.createObjectBuilder()
                 .add("id", task.getId());
         JsonObjectBuilder dataJsonBuilder = Json.createObjectBuilder()
                 .add("task", taskJsonBuilder);

         javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
                 .add("data", dataJsonBuilder)
                 .build();

         return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
      } catch (JsonProcessingException e) {
         LOGGER.debug("Failed to convert tagList from json to list", e);
         return new ResponseEntity("Failed to convert tagList from json to list", HttpStatus.BAD_REQUEST);
      } catch (IllegalArgumentException e) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid value of status or priority");
      }
   }

   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateTaskById(@PathVariable(name = "id") String id,
                                                @RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject taskJson = dataJson.get("task").getAsJsonObject();

      System.out.println(Status.valueOf(taskJson.get("taskNode").getAsJsonObject().get("status").getAsString()));

//      System.out.println(taskJson.get("taskNode").getAsJsonObject().get("status").getAsString());

      try {
         taskService.update(new TaskService.UpdateModel(
                 id,
                 taskJson.get("title").getAsString(),
                 taskJson.get("description").getAsString(),
                 taskJson.get("note").getAsString(),

                 Priority.valueOf(taskJson.get("priority").getAsString()),
                 taskJson.get("assigneeEmail").getAsString(),
                 taskJson.get("dueAt").getAsLong(),

                 Arrays.asList(new ObjectMapper().readValue(taskJson.get("tagList").toString(), Tag[].class)),

                 taskJson.get("taskNode").getAsJsonObject().get("headUUID").getAsString(),
                 taskJson.get("taskNode").getAsJsonObject().get("tailUUID").getAsString(),
                 Status.valueOf(taskJson.get("taskNode").getAsJsonObject().get("status").getAsString())
         ));
      } catch (JsonProcessingException e) {
         LOGGER.debug("Failed to convert tagList from json to list", e);
         return new ResponseEntity("Failed to convert tagList from json to list", HttpStatus.BAD_REQUEST);
      } catch (IllegalArgumentException e) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid value of status or priority");
      }

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteTaskById(@PathVariable(name = "id") String id) {
      taskService.delete(id);
      return new ResponseEntity(HttpStatus.OK);
   }
}
