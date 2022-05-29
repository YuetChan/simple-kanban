package com.tycorp.cuprtier.request;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuprtier.core.util.GsonHelper;
import com.tycorp.cuprtier.report.Report;
import com.tycorp.cuprtier.report.ReportRepository;
import com.tycorp.cuprtier.user.UploadQuota;
import com.tycorp.cuprtier.user.User;
import com.tycorp.cuprtier.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.json.Json;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/requests")
public class RequestController {
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private RequestRepository requestRepository;
   @Autowired
   private ReportRepository reportRepository;

   @Autowired
   private UserRepository userRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "/{id}", produces = "application/json")
   public ResponseEntity<String> getRequestById(@PathVariable(value = "id") String id) {
      Optional<Request> requestMaybe = requestRepository.findById(id);
      if(requestMaybe.isPresent()) {
         Request request = requestMaybe.get();

         int numOfProcessedRequest = (int)requestRepository.countByCreatedAtLessThanAndUnlocked(
                 request.getCreatedAt(),
                 false);

         request.setQueuePos(numOfProcessedRequest);

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "request",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(request, Request.class));

         return new ResponseEntity(dataJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> getRequestsByUserEmail(@RequestParam(value = "email") String email) {
      Optional<User> userMaybe = userRepository.findByEmail(email);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();
         List<Request> request = user.getRequest();

         Type requestListType = new TypeToken<ArrayList<Request>>() {}.getType();

         JsonObject dataJson = new JsonObject();
         dataJson.add(
                 "requests",
                 GsonHelper.getExposeSensitiveGson().toJsonTree(request, requestListType));

         return new ResponseEntity(dataJson.toString(), HttpStatus.OK);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PutMapping(value = "/{id}/unlock", produces = "application/json")
   public ResponseEntity<String> unlockRequestById(@PathVariable(name = "id") String id) {
      Optional<Request> requestMaybe = requestRepository.findById(id);
      if(requestMaybe.isPresent()) {
         Request request = requestMaybe.get();
         request.setUnlocked(true);

         request = requestRepository.save(request);

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PutMapping(value = "/{id}/lock", produces = "application/json")
   public ResponseEntity<String> lockRequestById(@PathVariable(name = "id") String id) {
      Optional<Request> requestMaybe = requestRepository.findById(id);
      if(requestMaybe.isPresent()) {
         Request request = requestMaybe.get();
         request.setUnlocked(false);

         request = requestRepository.save(request);

         return new ResponseEntity(HttpStatus.NO_CONTENT);
      }else {
         return NOT_FOUND_RES;
      }
   }

   @CrossOrigin(origins = "http://localhost:3000")
   @PostMapping(value = "", produces = "application/json")
   public ResponseEntity<String> submitRequest(@RequestBody String reqJsonStr) {
      JsonObject dataJson = GsonHelper.decodeJsonStrForData(reqJsonStr);

      JsonObject requestJson = dataJson.get("request").getAsJsonObject();
      Request request = GsonHelper.getExposeSensitiveGson().fromJson(requestJson, Request.class);

      String email= dataJson.get("email").getAsString();

      Optional<User> userMaybe = userRepository.findByEmail(email);
      if(userMaybe.isPresent()) {
         User user = userMaybe.get();
         if(user.getUploadQuota().isFull()) {
            return new ResponseEntity(HttpStatus.CONFLICT);
         }else {
            request.setUser(user);
            request.setCreatedAt(System.currentTimeMillis());
            request = requestRepository.save(request);

            Report report = new Report(request);
            report = reportRepository.save(report);

            javax.json.JsonObject resJavaxJson = Json.createObjectBuilder()
                    .add("data",
                            Json.createObjectBuilder()
                                    .add("request", Json.createObjectBuilder().add("id", request.getId()))
                                    .add("report", Json.createObjectBuilder().add("id", report.getId()))
                    )
                    .build();

            return new ResponseEntity(resJavaxJson.toString(), HttpStatus.OK);
         }
      }else {
         return new ResponseEntity(HttpStatus.BAD_REQUEST);
      }
   }
}
