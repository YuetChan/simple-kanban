package com.tycorp.cupkanban.task;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cupkanban.core.util.GsonHelper;
import com.tycorp.cupkanban.project.Project;
import com.tycorp.cupkanban.project.ProjectRepository;
import com.tycorp.cupkanban.tag.TagRepository;
import com.tycorp.cupkanban.tag.TagService;
import com.tycorp.cupkanban.user.UserRepository;
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
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private TaskService taskService;

   @Autowired
   private TagService tagService;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private ProjectRepository projectRepository;
   @Autowired
   private TagRepository tagRepository;
   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getTaskById(id)");
      LOGGER.debug("GetMapping getTaskById with parameters id: {}", id);

      Optional<Task> taskMaybe = taskRepository.findById(id);
      if(!taskMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      JsonObject dataJson = new JsonObject();
      dataJson.add("task",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(taskMaybe.get(), Task.class));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      LOGGER.debug("Response json built: {}", resJson);
      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchTasks(@RequestParam(name = "start") int start,
                                             @RequestParam(name = "pageSize") int pageSize,
                                             @RequestParam(name = "projectId") String projectId,
                                             @RequestParam(name = "tags") Optional<List<String>> tagListMaybe) {
      LOGGER.trace("Enter searchTasks(start, pageSize, projectId, tags)");
      LOGGER.debug("GetMapping searchTasks with parameters start: {}, pageSize: {}, projectId: {}, tags: {}",
              start, pageSize, projectId, tagListMaybe.orElse(new ArrayList<>()));

      Optional<Project> projectMaybe = projectRepository.findById(projectId);
      if(!projectMaybe.isPresent()) {
         LOGGER.debug("Project not found");
         return NOT_FOUND_RES;
      }

      LOGGER.debug("Find task by params");
      Page<Task> page = taskRepository.findByParams(projectId,
              false,
              tagListMaybe.orElse(new ArrayList<>()),
              PageRequest.of(start, pageSize));

      List<Task> taskList = page.getContent();
      for(var task : taskList) {
//         List<Tag> updatedTagList = new ArrayList();
         for(var tag : task.getTagList()) {
            tag.setProjectId(projectId);
//            updatedTagList.add(tag);
         }
      }

      Type taskListType = new TypeToken<ArrayList<Task>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      dataJson.add("tasks",
              GsonHelper.getExposeSensitiveGson().toJsonTree(taskList, taskListType));
      dataJson.addProperty("totalPage", page.getTotalPages());

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      LOGGER.debug("Response json built: {}", resJson);
      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createTask(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createTask(reqJsonStr)");
      LOGGER.debug("PostMapping createTask with @RequestBody", reqJsonStr);

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject taskJson = dataJson.get("task").getAsJsonObject();
      Task task = GsonHelper.getExposeSensitiveGson()
              .fromJson(taskJson, Task.class);

      task = taskService.create(task);
      LOGGER.debug("Task created");

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("task",
                                      Json.createObjectBuilder()
                                              .add("id", task.getId()))
              )
              .build();

      LOGGER.debug("Response json built", resJavaxJson.toString());
      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateTaskById(@PathVariable(name = "id") String id,
                                                @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateTaskById(id, resJsonStr)");
      LOGGER.debug("PatchMapping updateTaskById with parameters id and @RequestBody", id, reqJsonStr);

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject taskJson = dataJson.get("task").getAsJsonObject();
      Task updatedTask = GsonHelper.getExposeSensitiveGson()
              .fromJson(taskJson, Task.class);

      Optional<Task> taskMaybe = taskRepository.findById(id);
      if(!taskMaybe.isPresent()) {
         LOGGER.debug("Task not found");
         return NOT_FOUND_RES;
      }

      taskService.update(taskMaybe.get(), updatedTask);
      LOGGER.debug("Task updated");

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteTaskById(id)");
      LOGGER.debug("DeleteMapping deleteTaskById with parameters id", id);

      Optional<Task> taskMaybe = taskRepository.findById(id);
      if(!taskMaybe.isPresent()) {
         LOGGER.debug("Task not found");
         return NOT_FOUND_RES;
      }

      taskService.delete(taskMaybe.get());
      LOGGER.debug("Task deleted");

      return new ResponseEntity(HttpStatus.OK);
   }

}
