package com.tycorp.cuptodo.project;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuptodo.core.util.GsonHelper;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.story.StoryRepository;
import com.tycorp.cuptodo.task.Task;
import com.tycorp.cuptodo.task.TaskRepository;
import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import com.tycorp.cuptodo.user.value.Permission;
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
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private ProjectService projectService;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private StoryRepository storyRepository;
   @Autowired
   private TaskRepository taskRepository;
   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getProjectById(id)");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      JsonObject dataJson = new JsonObject();
      dataJson.add("project",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(projectMaybe.get(), Project.class));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                           @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchProjectsByUserEmail(userEmail, start)");

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         Page<Project> page = projectRepository.findByUserEmail(userEmail,
                 PageRequest.of(start, 20));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add("projects",
                 GsonHelper.getExposeSensitiveGson()
                         .toJsonTree(projectList, projectListType));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/share", produces = "application/json")
   public ResponseEntity<String> searchShareProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                                @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchShareProjectsByUserEmail(userEmail, start)");

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         Page<Project> page = projectRepository.findProjectListByCollaborator(userMaybe.get(),
                 PageRequest.of(start, 20));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add("projects",
                 GsonHelper.getExposeSensitiveGson()
                         .toJsonTree(projectList, projectListType));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return new ResponseEntity("userEmail is invalid", HttpStatus.BAD_REQUEST);
      }
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createProject(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createProject(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project project = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      project = projectService.create(project);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("project",
                                      Json.createObjectBuilder()
                                              .add("id", project.getId())))
              .build();

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateProjectById(@PathVariable(name = "id") String id,
                                                   @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateProjectById(id, reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project updatedProject = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      Project project = projectMaybe.get();
      projectService.update(project, updatedProject);

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   // Check correctness --- in progress
   // Check permission in abac --- in progress
   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}/permissions", produces = "application/json")
   public ResponseEntity<String> updateProjectPermissionList(@PathVariable(name = "id") String id,
                                                             @RequestBody String reqJsonStr) {
      LOGGER.trace("Enter updateProjectPermissionList(id, reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      Type projectPermissionListType = new TypeToken<ArrayList<ProjectPermissionDto>>() {}.getType();

      JsonArray projectPermissionListJson = dataJson.get("projectPermissions").getAsJsonArray();
      List<ProjectPermissionDto> projectPermissionsDtoList = GsonHelper.getExposeSensitiveGson()
              .fromJson(projectPermissionListJson, projectPermissionListType);

      if(projectPermissionsDtoList.size() > 200) {
         return new ResponseEntity("permissionList exceeds max size", HttpStatus.BAD_REQUEST);
      }

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      Project project = projectMaybe.get();
      Map<String, List<Permission>> userPermissionListMp = new HashMap<>();

      for(ProjectPermissionDto dto : projectPermissionsDtoList) {
         String userEmail = dto.getUserEmail();
         if(userPermissionListMp.get(userEmail) == null) {
            List<Permission> permissionList = new ArrayList<>();
            permissionList.add(new Permission(id, dto.getPermissible(), dto.getPermit()));

            userPermissionListMp.put(userEmail, permissionList);
         }else {
            Permission permissionToAdd = new Permission(id, dto.getPermissible(), dto.getPermit());

            boolean isDuplicated = userPermissionListMp.get(userEmail).stream()
                    .filter(permission -> permission.equals(permissionToAdd))
                    .collect(Collectors.toList())
                    .size() > 0;

            if(!isDuplicated) {
               List<Permission> permissionList = userPermissionListMp.get(userEmail);
               permissionList.add(permissionToAdd);
               userPermissionListMp.put(userEmail, permissionList);
            }
         }
      }

      projectService.updatePermissions(project, userPermissionListMp);

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   // should be used on story creation
   @CrossOrigin(origins = "http://localhost:3000")
   @PutMapping(value = "/{id}/storys", produces = "application/json")
   public ResponseEntity<String> attachProjectToStoryById(@PathVariable(name = "id") String id,
                                                          @RequestParam(name = "storyId") String storyId) {
      LOGGER.trace("Enter attachProjectToStoryById(id)");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      Optional<Story> storyMaybe = storyRepository.findById(storyId);

      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      if(!storyMaybe.isPresent()) {
         return new ResponseEntity("storyId is invalid", HttpStatus.BAD_REQUEST);
      }

      Story story = storyMaybe.get();
      if(story.getProject() != null) {
         return new ResponseEntity("story already has project attached", HttpStatus.CONFLICT);
      }

      story.setProject(projectMaybe.get());
      storyRepository.save(story);

      return new ResponseEntity(HttpStatus.OK);
   }

   // should be used on task creation
   @CrossOrigin(origins = "http://localhost:3000")
   @PutMapping(value = "/{id}/tasks", produces = "application/json")
   public ResponseEntity<String> attachProjectToTaskById(@PathVariable(name = "id") String id,
                                                         @RequestParam(name = "taskId") String taskId) {
      LOGGER.trace("Enter attachProjectToTaskById(id)");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      Optional<Task> taskMaybe = taskRepository.findById(taskId);

      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      if(!taskMaybe.isPresent()) {
         return new ResponseEntity("taskId is invalid", HttpStatus.BAD_REQUEST);
      }

      Task task = taskMaybe.get();
      if(task.getProject() != null) {
         return new ResponseEntity("task already has project attached", HttpStatus.CONFLICT);
      }

      task.setProject(projectMaybe.get());
      taskRepository.save(task);

      return new ResponseEntity(HttpStatus.OK);
   }

}
