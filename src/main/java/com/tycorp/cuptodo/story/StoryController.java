package com.tycorp.cuptodo.story;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuptodo.core.util.GsonHelper;
import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectController;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.task.Task;
import com.tycorp.cuptodo.task.TaskRepository;
import com.tycorp.cuptodo.task.TaskService;
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
@RequestMapping(value = "/storys")
public class StoryController {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private StoryService storyService;

   @Autowired
   private TaskService taskService;

   @Autowired
   private StoryRepository storyRepository;

   @Autowired
   private ProjectRepository projectRepository;
   @Autowired
   private TaskRepository taskRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getStoryById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getStoryById(id)");

      Optional<Story> storyMaybe = storyRepository.findById(id);
      if(!storyMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      JsonObject dataJson = new JsonObject();
      dataJson.add("story",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(storyMaybe.get(), Story.class));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchStorysByProjectId(@RequestParam(name = "projectId") String projectId,
                                                         @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchStorysByProjectId(projectId, start)");

      Optional<Project> projectMaybe = projectRepository.findById(projectId);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      Page<Story> page = storyRepository.findByProjectId(projectId, PageRequest.of(start, 20));

      List<Story> storyList = page.getContent();
      storyList.forEach(story -> story.setProjectId(projectId));

      Type storyListType = new TypeToken<ArrayList<Story>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      dataJson.add("storys",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(storyList, storyListType));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createStory(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createStory(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject storyJson = dataJson.get("story").getAsJsonObject();
      Story story = GsonHelper.getExposeSensitiveGson().fromJson(storyJson, Story.class);

      storyService.create(story);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("story",
                                      Json.createObjectBuilder()
                                              .add("id", story.getId())))
              .build();

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateStoryById(@PathVariable(name = "id") String id,
                                                 @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateStoryById(id, reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject storyJson = dataJson.get("story").getAsJsonObject();
      Story updatedStory = GsonHelper.getExposeSensitiveGson().fromJson(storyJson, Story.class);

      Optional<Story> storyMaybe = storyRepository.findById(id);
      if(!storyMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      storyService.update(storyMaybe.get(), updatedStory);

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteStoryById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteStoryById(id)");

      Optional<Story> storyMaybe = storyRepository.findById(id);
      if(!storyMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      storyService.delete(storyMaybe.get());

      return new ResponseEntity(HttpStatus.OK);
   }

   // should be used on task update
   @CrossOrigin(origins = "http://localhost:3000")
   @PutMapping(value = "/{id}/tasks", produces = "application/json")
   public ResponseEntity<String> attachTaskToStoryById(@PathVariable(name = "id") String id,
                                                       @RequestParam(name = "taskId") String taskId) {
      LOGGER.trace("Enter attachTaskToStoryById(id, taskId)");

      taskService.attachTaskToStory(taskId, id);

      return new ResponseEntity(HttpStatus.OK);
   }

   // should be used on task update
   @CrossOrigin(origins = "http://localhost:3000")
   @DeleteMapping(value = "/{id}/tasks", produces = "application/json")
   public ResponseEntity<String> detachStoryFromTaskById(@PathVariable(name = "id") String id,
                                                         @RequestParam(name = "taskId") String taskId) {
      LOGGER.trace("Enter detachStoryFromTaskById(id, taskId)");

      storyService.detachStoryFromTask(id, taskId);

      return new ResponseEntity(HttpStatus.OK);
   }

}
