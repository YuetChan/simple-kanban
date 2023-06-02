package com.tycorp.simplekanban.engine.domain.user;

import com.google.gson.JsonObject;
import com.tycorp.simplekanban.engine.core.GsonHelper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.util.Optional;

@RestController
@RequestMapping(value = "/users")
public class UserController {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

   // Repositories
   @Autowired
   private UserRepository userRepository;

   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> getUserByEmail(@RequestParam(name = "email") String email) {
      Optional<User> userMaybe = userRepository.findByEmail(email);

      if(!userMaybe.isPresent()) {
         LOGGER.debug("User not found");
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      JsonObject dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      dataJson.add("user", GsonHelper.getExposeSensitiveGson().toJsonTree(userMaybe.get(), User.class));
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @GetMapping(value = "/{id}/role", produces = "application/json")
   public ResponseEntity<String> getUserRoleById(@PathVariable(name = "id") String id) {
      Optional<User> userMaybe = userRepository.findById(id);

      if(!userMaybe.isPresent()) {
         LOGGER.debug("User not found");
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }

      JsonObject dataJson = new JsonObject();
      JsonObject resJson = new JsonObject();

      dataJson.addProperty("role", userMaybe.get().getRole());
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createUser(@RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject userJson = dataJson.get("user").getAsJsonObject();

      String email = userJson.get("email").getAsString();
      String role = userJson.get("role").getAsString();

      if(!userRepository.findByEmail(email).isPresent()) {
         LOGGER.debug("User not found");

         User user = new User(email, role);
         user = userRepository.save(user);

         var userJsonBuilder = Json.createObjectBuilder().add("id", user.getId());
         var dataJsonBuilder = Json.createObjectBuilder().add("user", userJsonBuilder);

         javax.json.JsonObject resJavaxJson = Json.createObjectBuilder().add("data", dataJsonBuilder).build();

         return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
      }else {
         return new ResponseEntity(HttpStatus.CONFLICT);
      }
   }

}
