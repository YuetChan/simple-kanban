package com.tycorp.simplekanban.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.simplekanban.core.util.GsonHelper;
import com.tycorp.simplekanban.task.TaskRepository;
import com.tycorp.simplekanban.user.User;
import com.tycorp.simplekanban.user.UserRepository;
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

   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter getProjectById(id)");

      LOGGER.info("Getting project");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(!projectMaybe.isPresent()) {
         LOGGER.debug("Project: [{}] not found", id);
         return NOT_FOUND_RES;
      }

      JsonObject dataJson = new JsonObject();
      dataJson.add("project", GsonHelper.getExposeSensitiveGson().toJsonTree(projectMaybe.get(), Project.class));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      LOGGER.info("Project obtained");

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                           @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchProjectsByUserEmail(userEmail, start)");

      LOGGER.info("Searching for project");

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

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

         LOGGER.info("Project search done");

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return NOT_FOUND_RES;
      }
   }

   @GetMapping(value = "/share", produces = "application/json")
   public ResponseEntity<String> searchShareProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                                @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchShareProjectsByUserEmail(userEmail, start)");

      LOGGER.info("Searching for share projects");

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

         Page<Project> page = projectRepository.findProjectListByCollaborator(userMaybe.get(),
                 PageRequest.of(start, 20, Sort.by("createdAt").descending()));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add("projects", GsonHelper.getExposeSensitiveGson().toJsonTree(projectList, projectListType));

         dataJson.addProperty("page", start);
         dataJson.addProperty("totalPage", page.getTotalPages());

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         LOGGER.info("Share project search done");

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity("User email is invalid", HttpStatus.BAD_REQUEST);
      }
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createProject(@RequestBody String reqJsonStr) {
      LOGGER.trace("Enter createProject(reqJsonStr)");

      LOGGER.info("Creating project");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project project = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      project = projectService.create(project);
      LOGGER.debug("Project created successfully");

      var projectJsonBuilder = Json.createObjectBuilder().add("id", project.getId());
      var dataJsonBuilder = Json.createObjectBuilder().add("data", projectJsonBuilder);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder().add("data", dataJsonBuilder).build();

      LOGGER.info("Project creation done");

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateProjectById(@PathVariable(name = "id") String id,
                                                   @RequestBody String reqJsonStr) throws JsonProcessingException {
      LOGGER.trace("Enter updateProjectById(id, reqJsonStr)");

      LOGGER.info("Updating project");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project updatedProject = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      JsonObject collaboratorEmailSecretMapJson = dataJson.get("collaboratorEmailSecretMap").getAsJsonObject();
      try {
         Map<String, String> collaboratorEmailSecretMap = new ObjectMapper()
                 .readValue(collaboratorEmailSecretMapJson.toString(), HashMap.class);

         Optional<Project> projectMaybe = projectRepository.findById(id);
         if(!projectMaybe.isPresent()) {
            LOGGER.debug("Project: [{}] not found", id);
            return NOT_FOUND_RES;
         }

         Project project = projectMaybe.get();

         projectService.update(project, updatedProject, collaboratorEmailSecretMap);
         LOGGER.debug("Project updated successfully");

         LOGGER.info("Project update done");

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }catch(JsonProcessingException e) {
         LOGGER.debug("CollaboratorEmailSecretMap json to map conversion failed", e);
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }
   }

   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("Enter deleteProjectById(id)");

      LOGGER.info("Deleting project");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(projectMaybe.isPresent()) {
         LOGGER.debug("Project is present");

         Project project = projectMaybe.get();

         projectService.delete(project);
         LOGGER.debug("Project deleted successfully");

         LOGGER.info("Project deletion done");

         return new ResponseEntity(HttpStatus.OK);
      }else {
         LOGGER.debug("Project: [{}] not found", id);
         return NOT_FOUND_RES;
      }
   }

}
