package com.tycorp.simplekanban.task;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.simplekanban.core.util.GsonHelper;
import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.project.ProjectRepository;
import com.tycorp.simplekanban.tag.TagRepository;
import com.tycorp.simplekanban.tag.TagService;
import com.tycorp.simplekanban.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/tasks")
public class TaskController {
   private static final Logger LOGGER = LoggerFactory.getLogger(TaskController.class);

   @Autowired
   private TaskService taskService;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private ProjectRepository projectRepository;

   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getTaskById(id)");

      Optional<Task> taskMaybe = taskRepository.findById(id);

      if(!taskMaybe.isPresent()) {
         LOGGER.debug("Task: [{}] not found", id);
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      JsonObject dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      dataJson.add("task", GsonHelper.getExposeSensitiveGson().toJsonTree(taskMaybe.get(), Task.class));
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchTasks(@RequestParam(name = "start") int start,
                                             @RequestParam(name = "pageSize") int pageSize,
                                             @RequestParam(name = "projectId") String projectId,
                                             @RequestParam(name = "tags") Optional<List<String>> tagListMaybe) {
      LOGGER.trace("Enter searchTasks(start, pageSize, projectId, tagListMaybe)");

      Optional<Project> projectMaybe = projectRepository.findById(projectId);

      if(!projectMaybe.isPresent()) {
         LOGGER.debug("Project: [{}] not found", projectId);
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      Page<Task> page = taskRepository.findByParams(projectId, false, tagListMaybe.orElse(new ArrayList<>()),
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

      dataJson.add("tasks", GsonHelper.getExposeSensitiveGson().toJsonTree(taskList, taskListType));
      dataJson.addProperty("totalPage", page.getTotalPages());

      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createTask(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createTask(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject taskJson = dataJson.get("task").getAsJsonObject();

      Task task = GsonHelper.getExposeSensitiveGson().fromJson(taskJson, Task.class);

      task = taskService.create(task);

      var taskJsonBuilder = Json.createObjectBuilder().add("id", task.getId());
      var dataJsonBuilder = Json.createObjectBuilder().add("task", taskJsonBuilder);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder().add("data", dataJsonBuilder).build();

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateTaskById(@PathVariable(name = "id") String id,
                                                @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateTaskById(id, reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject taskJson = dataJson.get("task").getAsJsonObject();

      Task updatedTask = GsonHelper.getExposeSensitiveGson().fromJson(taskJson, Task.class);

      Optional<Task> taskMaybe = taskRepository.findById(id);

      if(!taskMaybe.isPresent()) {
         LOGGER.debug("Task: [{}] not found", id);
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      taskService.update(taskMaybe.get(), updatedTask);

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteTaskById(id)");

      Optional<Task> taskMaybe = taskRepository.findById(id);

      if(!taskMaybe.isPresent()) {
         LOGGER.debug("Task: [{}] not found", id);
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      taskService.delete(taskMaybe.get());

      return new ResponseEntity(HttpStatus.OK);
   }

}
