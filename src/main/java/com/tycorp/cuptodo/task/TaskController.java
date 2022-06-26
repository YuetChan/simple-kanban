package com.tycorp.cuptodo.task;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuptodo.core.util.GsonHelper;
import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectController;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.story.StoryRepository;
import com.tycorp.cuptodo.tag.TagRepository;
import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.UserRepository;
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
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
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
   private StoryRepository storyRepository;
   @Autowired
   private TagRepository tagRepository;
   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getTaskById(id)");

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

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchTasksByParams(@RequestParam(name = "startAt") Optional<Long> startAtMaybe,
                                                     @RequestParam(name = "endAt") Optional<Long> endAtMaybe,
                                                     @RequestParam(name = "start") int start,
                                                     @RequestParam(name = "projectId") String projectId,
                                                     @RequestParam(name = "storyId") Optional<String> storyIdMaybe,
                                                     @RequestParam(name = "tags") Optional<List<String>> tagListMaybe) {
      LOGGER.trace("Enter searchTasksByParams(startAt, endAt, start, projectId, storyId, tags)");

      Optional<Project> projectMaybe = projectRepository.findById(projectId);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      Page<Task> page = taskRepository.findByParams(projectId,
              storyIdMaybe.orElse(null),
              startAtMaybe.orElse(null), endAtMaybe.orElse(null),
              tagListMaybe.orElse(null),
              PageRequest.of(start, 20));

      List<Task> taskList = page.getContent();

      Type taskListType = new TypeToken<ArrayList<Task>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      dataJson.add("tasks",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(taskList, taskListType));

      dataJson.addProperty("totalElements", page.getTotalElements());
      dataJson.addProperty("totalPages", page.getTotalPages());

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createTask(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createTask(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject taskJson = dataJson.get("task").getAsJsonObject();
      Task task = GsonHelper.getExposeSensitiveGson()
              .fromJson(taskJson, Task.class);

      if(task.getTagList().size() > 20 || task.getSubTaskList().size() > 10) {
         return new ResponseEntity("tagList or subTaskList exceed max size", HttpStatus.BAD_REQUEST);
      }

      task = taskService.create(task);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("task",
                                      Json.createObjectBuilder()
                                              .add("id", task.getId()))
              )
              .build();

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateTaskById(@PathVariable(name = "id") String id,
                                                @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateTaskById(id, resJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject taskJson = dataJson.get("task").getAsJsonObject();
      Task updatedTask = GsonHelper.getExposeSensitiveGson()
              .fromJson(taskJson, Task.class);

      if(updatedTask.getTagList().size() > 20 || updatedTask.getSubTaskList().size() > 10) {
         return new ResponseEntity("tagList or subTaskList exceed max size", HttpStatus.BAD_REQUEST);
      }

      Optional<Task> taskMaybe = taskRepository.findById(id);
      if(!taskMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      taskService.update(taskMaybe.get(), updatedTask);
      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteTaskById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteTaskById(id)");

      Optional<Task> taskMaybe = taskRepository.findById(id);
      if(!taskMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      taskService.delete(taskMaybe.get());
      return new ResponseEntity(HttpStatus.OK);
   }

}
