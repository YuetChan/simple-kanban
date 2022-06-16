package com.tycorp.cuptodo.user;

import com.google.gson.JsonObject;
import com.tycorp.cuptodo.core.util.GsonHelper;

import com.tycorp.cuptodo.user.value.Permit;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping(value = "/users")
public class UserController {
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> getUserByParams(@RequestParam(name = "email") String email) {
      log.trace("Enter getUserByParams(email)");

      Optional<User> userMaybe = userRepository.findByEmail(email);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "user",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(user, User.class));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}/role", produces = "application/json")
   public ResponseEntity<String> getUserRoleById(@PathVariable(name = "id") String id) {
      log.trace("Enter getUserRoleById(id)");

      Optional<User> userMaybe = userRepository.findById(id);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();

         JsonObject dataJson = new JsonObject();
         dataJson.addProperty("role", user.getRole());

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   // Helper in abac
   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}/permissions", produces = "application/json")
   public ResponseEntity<String> hasPermitByProjectId(@PathVariable(name = "id") String id,
                                                      @RequestParam(name = "permit") String permit,
                                                      @RequestParam(name = "projectId") String projectId) {
      log.trace("Enter hasPermitByProjectId(id, permit, projectId)");

      Optional<User> userMaybe = userRepository.findById(id);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();

         JsonObject dataJson = new JsonObject();
         dataJson.addProperty("hasPermit", user.hasPermitByProjectId(Permit.valueOf(permit), projectId));

         JsonObject resJson = new JsonObject();
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createUser(@RequestBody String reqJsonStr) {
      log.trace("Enter hasPermitByProjectId(reqJsonStr)");

      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject userJson = dataJson.get("user").getAsJsonObject();

      String email = userJson.get("email").getAsString();
      String role = userJson.get("role").getAsString();

      if(!userRepository.findByEmail(email).isPresent()) {
         User user = new User(email, role);
         user = userRepository.save(user);

         javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
                 .add("data",
                         Json.createObjectBuilder().add(
                                 "user",
                                 Json.createObjectBuilder().add("id", user.getId())))
                 .build();

         return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
      }else {
         return new ResponseEntity(HttpStatus.CONFLICT);
      }
   }
}
