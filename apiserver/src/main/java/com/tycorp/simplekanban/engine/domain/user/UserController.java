package com.tycorp.simplekanban.engine.domain.user;

import com.google.gson.JsonObject;
import com.tycorp.simplekanban.engine.core.GsonHelper;

import com.tycorp.simplekanban.engine.domain.user_secret.UserSecret;
import com.tycorp.simplekanban.engine.domain.user_secret.UserSecretRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping(value = "/users")
public class UserController {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(UserController.class);

   // Repositories
   @Autowired
   private UserRepository userRepository;

   @Autowired
   private UserSecretRepository userSecretRepository;

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

         userSecretRepository.save(userSecretRepository.save(generateUserSecret(user)));

         var userJsonBuilder = Json.createObjectBuilder().add("id", user.getId());
         var dataJsonBuilder = Json.createObjectBuilder().add("user", userJsonBuilder);

         javax.json.JsonObject resJavaxJson = Json.createObjectBuilder().add("data", dataJsonBuilder).build();

         return new ResponseEntity(resJavaxJson.toString(), HttpStatus.CREATED);
      }else {
         return new ResponseEntity(HttpStatus.CONFLICT);
      }
   }

   @GetMapping(value = "/{id}/userSecret", produces = "application/json")
   public ResponseEntity<String> getUserSecretById(@PathVariable(name = "id") String id) {
      Optional<User> userMaybe = userRepository.findById(id);

      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.addProperty("secret", userMaybe.get().getUserSecret().getSecret());
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.OK);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }
   }

   @PutMapping(value = "/{id}/userSecret", produces = "application/json")
   public ResponseEntity<String> generateUserSecretById(@PathVariable(name = "id") String id) {
      Optional<User> userMaybe = userRepository.findById(id);

      if(userMaybe.isPresent()) {
         LOGGER.debug("User is present");

         User user = userMaybe.get();

         UserSecret userSecret = user.getUserSecret();
         userSecret.setSecret(generateUserSecretStr());

         userSecret = userSecretRepository.save(userSecret);

         JsonObject dataJson = new JsonObject();
         JsonObject resJson = new JsonObject();

         dataJson.addProperty("secret", userSecret.getSecret());
         resJson.add("data", dataJson);

         return new ResponseEntity(resJson.toString(), HttpStatus.CREATED);
      }else {
         LOGGER.debug("User not found");
         return new ResponseEntity(HttpStatus.NOT_FOUND);
      }
   }

   public UserSecret generateUserSecret(User user) {
      UserSecret userSecret = new UserSecret(generateUserSecretStr());
      userSecret.setUser(user);

      return userSecret;
   }

   public String generateUserSecretStr() {
      String alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      StringBuilder stringBuilder = new StringBuilder();

      Random random = new Random();

      for(int i = 0; i < 5; i++) {
         int index = random.nextInt(alphabet.length());
         char randomChar = alphabet.charAt(index);

         stringBuilder.append(randomChar);
      }

      return stringBuilder.toString();
   }

}
