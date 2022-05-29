package com.tycorp.cuprtier.user;

import com.google.gson.JsonObject;
import com.tycorp.cuprtier.core.util.GsonHelper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.util.Optional;

@RestController
@RequestMapping(value = "/users")
public class UserController {
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> getUserByParam(@RequestParam(name = "email") String email) {
      Optional<User> userMaybe = userRepository.findByEmail(email);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "user",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(user, User.class));

         return new ResponseEntity(dataJson, HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> createUser(@RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);
      JsonObject userJson = dataJson.get("user").getAsJsonObject();

      String email = userJson.get("email").getAsString();

      UploadQuota uploadQuota = GsonHelper.getExposeSensitiveGson()
              .fromJson(userJson.get("uploadQuota"), UploadQuota.class);

      User user = new User(email, uploadQuota);
      if(!userRepository.findByEmail(email).isPresent()) {
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
