package com.tycorp.simplekanban.engine.domain.project;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.simplekanban.engine.core.GsonHelper;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectGetValidator;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
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
import javax.json.JsonObjectBuilder;
import java.io.DataInput;
import java.io.IOException;
import java.lang.reflect.Type;
import java.util.*;

@RestController
@RequestMapping(value = "/projects")
public class ProjectController {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

   // Services
   @Autowired
   private ProjectService projectService;

   // Repositories
   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private UserRepository userRepository;

   // Default project validators
   @Autowired
   private DefaultProjectGetValidator defaultProjectGetValidator;

   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getProjectById(@PathVariable(name = "id") String id) {
      ValidationResult validationResult = defaultProjectGetValidator.validate(id);

      if(validationResult.isValid()) {
         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.add("project", GsonHelper.getExposeSensitiveGson()
                 .toJsonTree(
                         projectRepository.findById(id).get(),
                         Project.class));
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }

      return new ResponseEntity<>(validationResult.getErrorMsg(), HttpStatus.BAD_REQUEST);
   }

   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                           @RequestParam(name = "start") int start) {
      Optional<User> userMaybe = userRepository.findByEmail(userEmail);

      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

         Page<Project> page = projectRepository.findByUserEmail(
                 userEmail,
                 PageRequest.of(start, 100, Sort.by("createdAt").descending()));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.add(
                 "projects",
                 GsonHelper.getExposeSensitiveGson()
                         .toJsonTree(
                                 projectList,
                                 projectListType));

         dataJson.addProperty("page", start);
         dataJson.addProperty("totalPage", page.getTotalPages());

         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }
   }

   @GetMapping(value = "/share", produces = "application/json")
   public ResponseEntity<String> searchShareProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                                @RequestParam(name = "start") int start) {
      Optional<User> userMaybe = userRepository.findByEmail(userEmail);

      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

         Page<Project> page = projectRepository.findProjectListByCollaborator(
                 userMaybe.get(),
                 PageRequest.of(start, 100, Sort.by("createdAt").descending()));
         List<Project> projectList = page.getContent();

         Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.add(
                 "projects",
                 GsonHelper.getExposeSensitiveGson()
                         .toJsonTree(
                                 projectList,
                                 projectListType));

         dataJson.addProperty("page", start);
         dataJson.addProperty("totalPage", page.getTotalPages());

         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity("User email is invalid", HttpStatus.BAD_REQUEST);
      }
   }

   @GetMapping(value = "/not", produces = "application/json")
   public ResponseEntity<String> getAllProjectsByNotUserEmail(
           @RequestParam(name = "userEmail") String userEmail,
           @RequestParam(name = "start") int start) {
      LOGGER.debug("User is present");

      Page<Project> page = projectRepository.findAllByUserEmailNot(
              userEmail,
              PageRequest.of(start, 100, Sort.by("createdAt").descending()));
      List<Project> projectList = page.getContent();

      Type projectListType = new TypeToken<ArrayList<Project>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      dataJson.add(
              "projects",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(
                              projectList,
                              projectListType));

      dataJson.addProperty("page", start);
      dataJson.addProperty("totalPage", page.getTotalPages());

      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createProject(@RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject projectJson = dataJson.get("project").getAsJsonObject();

      ProjectService.CreateModel model = new ProjectService.CreateModel(
              projectJson.get("name").getAsString(),
              projectJson.get("description").getAsString(),
              projectJson.get("userEmail").getAsString());

      Project project = projectService.create(model);

      JsonObject _dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      _dataJson.addProperty("id", project.getId());
      resJson.add("data", _dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.CREATED);
   }

   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateProjectById(@PathVariable(name = "id") String id,
                                                   @RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject projectJson = dataJson.get("project").getAsJsonObject();

      List<User> updatedCollaboratorList = new ArrayList<>();

      updatedCollaboratorList.addAll(
              Arrays.asList(
                      new Gson().fromJson(
                              projectJson.get("collaboratorList").getAsJsonArray(),
                              User[].class)));

      ProjectService.UpdateModel model = new ProjectService.UpdateModel(
              projectJson.get("id").getAsString(),
              projectJson.get("name").getAsString(),
              projectJson.get("description").getAsString(),
              updatedCollaboratorList
              );

      projectService.update(model);

      return new ResponseEntity(HttpStatus.NO_CONTENT);
   }

   @DeleteMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> deleteProjectById(@PathVariable(name = "id") String id) {
      projectService.delete(id);
      return new ResponseEntity(HttpStatus.OK);
   }

}
