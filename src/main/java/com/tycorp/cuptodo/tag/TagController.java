package com.tycorp.cuptodo.tag;

import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;
import com.tycorp.cuptodo.core.util.GsonHelper;
import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectController;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping(value = "/tags")
public class TagController {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
   private ResponseEntity NOT_FOUND_RES = new ResponseEntity(HttpStatus.NOT_FOUND);

   @Autowired
   private TagRepository tagRepository;

   @Autowired
   private ProjectRepository projectRepository;

   @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping(value = "", produces = "application/json")
   public ResponseEntity<String> searchTagsByProjectIdAndPrefix(@RequestParam(name = "projectId") String projectId,
                                                                @RequestParam(name = "prefix") String prefix,
                                                                @RequestParam(name = "start") int start) {
      LOGGER.trace("Enter searchTagsByProjectIdAndPrefix(projectId, prefix, start)");

      Optional<Project> projectMaybe = projectRepository.findById(projectId);
      if(!projectMaybe.isPresent()) {
         return NOT_FOUND_RES;
      }

      Page<Tag> page = tagRepository.findByNameLike(prefix, PageRequest.of(start, 20));
      List<Tag> tagList = page.getContent();

      Type tagListType = new TypeToken<ArrayList<Tag>>() {}.getType();

      JsonObject dataJson = new JsonObject();
      dataJson.add(
              "tags",
              GsonHelper.getExposeSensitiveGson()
                      .toJsonTree(tagList, tagListType));

      JsonObject resJson = new JsonObject();
      resJson.add("data", dataJson);

      return new ResponseEntity(resJson.toString(), HttpStatus.OK);
   }
}
