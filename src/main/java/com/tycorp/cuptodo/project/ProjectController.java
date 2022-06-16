package com.tycorp.cuptodo.project;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuptodo.core.util.GsonHelper;
import com.tycorp.cuptodo.user.User;
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
@RequestMapping(value = "/projects")
public class ProjectController {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private ProjectService projectService;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getProjectById(@PathVariable(name = "id") String id) {
      LOGGER.trace("getProjectById(id)");

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(projectMaybe.isPresent()) {
         JsonObject dataJson = new JsonObject();
         dataJson.add("project",
                 GsonHelper.getExposeSensitiveGson()
                         .toJsonTree(projectMaybe.get(), Project.class));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchProjectsByUserEmail(@RequestParam(name = "userEmail") String userEmail,
                                                           @RequestParam(name = "start") int start) {
      LOGGER.trace("searchProjectsByUserEmail(userEmail, start)");

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
   public ResponseEntity<String> searchShareProjectsByCollaboratorEmail(@RequestParam(name = "userEmail") String userEmail,
                                                                        @RequestParam(name = "start") int start) {
      LOGGER.trace("searchShareProjectsByCollaboratorEmail(userEmail, start)");

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(userMaybe.isPresent()) {
         Page<Project> page = projectRepository.findProjectListByCollaborator(userMaybe.get(), PageRequest.of(start, 20));
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
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createProject(@RequestBody String reqJsonStr) {
      LOGGER.trace("createProject(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project project = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      String userEmail = project.getUserEmail();

      Optional<User> userMaybe = userRepository.findByEmail(userEmail);
      if(!userMaybe.isPresent()) {
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }

      project.setUser(userMaybe.get());
      project = projectService.create(project);

      javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
              .add("data",
                      Json.createObjectBuilder()
                              .add("project", Json.createObjectBuilder().add("id", project.getId()))
              )
              .build();

      return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
   }

   // Check permission in abac --- done
   @CrossOrigin(origins = "http://localhost:3000")
   @PatchMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> updateProject(@PathVariable(name = "id") String id,
                                               @RequestBody String reqJsonStr) {
      LOGGER.trace("updateProject(id, reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject projectJson = dataJson.get("project").getAsJsonObject();
      Project updatedProject = GsonHelper.getExposeSensitiveGson().fromJson(projectJson, Project.class);

      if(updatedProject.getCollaboratorList().size() > 20) {
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }

      Optional<Project> projectMaybe = projectRepository.findById(id);
      if(projectMaybe.isPresent()) {
         Project project = projectMaybe.get();
         projectService.update(project, updatedProject);

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }else {
         return NOT_FOUND_RES;
      }
   }
}
