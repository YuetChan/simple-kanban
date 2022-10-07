package com.tycorp.cupkanban.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cupkanban.core.util.GsonHelper;
import com.tycorp.cupkanban.task.TaskRepository;
import com.tycorp.cupkanban.user.User;
import com.tycorp.cupkanban.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.lang.reflect.Type;
import java.util.*;

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
   private TaskRepository taskRepository;
   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getProjectById(id)");
      LOGGER.debug("GetMapping getProjectById with parameters id: {}", id);

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(!projectMaybe.isPresent()) {
         LOGGER.debug("Project not found");
         return NOT_FOUND_RES;
      }

      JsonObject dataJson = new JsonObject();
      dataJson.add("project",
              GsonHelper.getExposeSensitiveGson().toJsonTree(projectMaybe.get(), Project.class));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      LOGGER.debug("Response json built: {}", resJson.toString());
      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

//   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                           @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchProjectsByUserEmail(userEmail, start)");
      LOGGER.debug("GetMapping searchProjectsByUserEmail with parameters userEmail: {}, start: {}", userEmail, start);

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         LOGGER.debug("User exists");

         Page<Project> page = projectRepository.findByUserEmail(userEmail,
                 PageRequest.of(start, 20, Sort.by("createdAt").descending()));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add("projects",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(projectList, projectListType));

         dataJson.addProperty("page", start);
         dataJson.addProperty("totalPage", page.getTotalPages());

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         LOGGER.debug("Response json built: {}", resJson.toString());
         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/share", produces = "application/json")
   public ResponseEntity<String> searchShareProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                                @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchShareProjectsByUserEmail(userEmail, start)");
      LOGGER.debug("GetMapping searchShareProjectsByUserEmail with parameters userEmail: {}, start: {}", userEmail, start);

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         LOGGER.debug("User exists");

         Page<Project> page = projectRepository.findProjectListByCollaborator(userMaybe.get(),
                 PageRequest.of(start, 20, Sort.by("createdAt").descending()));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add("projects",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(projectList, projectListType));

         dataJson.addProperty("page", start);
         dataJson.addProperty("totalPage", page.getTotalPages());

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         LOGGER.debug("Response json built: {}", resJson.toString());
         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity("userEmail is invalid", HttpStatus.BAD_REQUEST);
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createProject(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createProject(reqJsonStr)");
      LOGGER.debug("PostMapping createProject with @RequestBody", reqJsonStr);

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project project = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      project = projectService.create(project);
      LOGGER.debug("Project created");

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("project",
                                      Json.createObjectBuilder()
                                              .add("id", project.getId())))
              .build();

      LOGGER.debug("Response json built: {}", resJavaxJson.toString());
      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateProjectById(@PathVariable(name = "id") String id,
                                                   @RequestBody String reqJsonStr) throws JsonProcessingException {
      LOGGER.trace("Enter updateProjectById(id, reqJsonStr)");
      LOGGER.debug("PatchMapping updateProjectById with parameters id and @RequestBody", id, reqJsonStr);

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project updatedProject = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      JsonObject collaboratorEmailSecretMapJson = dataJson.get("collaboratorEmailSecretMap").getAsJsonObject();
      try {
         LOGGER.debug("Convert collaboratorEmailSecretMap json to map");
         Map<String, String> collaboratorEmailSecretMap = new ObjectMapper()
                 .readValue(collaboratorEmailSecretMapJson.toString(), HashMap.class);

         Optional<Project> projectMaybe = projectRepository.findById(id);
         if(!projectMaybe.isPresent()) {
            LOGGER.debug("Project not found");
            return NOT_FOUND_RES;
         }

         Project project = projectMaybe.get();

         projectService.update(project, updatedProject, collaboratorEmailSecretMap);
         LOGGER.debug("Project updated");

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }catch(JsonProcessingException e) {
         LOGGER.debug("CollaboratorEmailSecretMap json to map conversion failed", e);
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteProjectById(id)");
      LOGGER.debug("DeleteMapping deleteProjectById with parameters id", id);

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(projectMaybe.isPresent()) {
         LOGGER.debug("Project exists");

         Project project = projectMaybe.get();

         projectService.delete(project);
         LOGGER.debug("Project deleted");

         return new ResponseEntity(HttpStatus.OK);
      }else {
         LOGGER.debug("Project not found");
         return NOT_FOUND_RES;
      }
   }

}
