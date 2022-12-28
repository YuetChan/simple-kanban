package com.tycorp.cupkanban.tag;

import com.tycorp.cupkanban.project.Project;
import com.tycorp.cupkanban.task.Task;
import com.tycorp.cupkanban.task.TaskRepository;
import com.tycorp.cupkanban.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
   private static final Logger LOGGER = LoggerFactory.getLogger(TagService.class);
   
   @Autowired
   private TagRepository tagRepository;

   @Autowired
   private TaskRepository taskRepository;
   @Autowired
   private UserRepository userRepository;

   public List<Tag> addTagListToProjectAndTask(List<Tag> tagList, Project project, Task task) {
      LOGGER.trace("Enter addTagListForProjectAndTask(tagList, project, task)");

      LOGGER.debug("Find tag by project id and name in");
      List<String> tagNameList = getNameList(tagList);
      Page<Tag> page = tagRepository.findByProjectIdAndNameIn(project.getId(), tagNameList,
              PageRequest.of(0, 3000));

      if(page.getTotalElements() > 3000) {
         LOGGER.debug("Total tags count exceed 3000");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Total tag count exceed 3000");
      }

      List<Tag> currentTagList = page.getContent();
      attachTagListToTask(currentTagList, task);

      List<String> currentTagNameList = getNameList(currentTagList);

      List<Tag> tagToAddList = tagList
              .stream()
              .filter(tag -> !currentTagNameList.contains(tag.getName()))
              .collect(Collectors.toList());
      attachTagListToProject(tagToAddList, project);
      attachTagListToTask(tagToAddList, task);

      List<Tag> updatedTagList = new ArrayList<>();
      updatedTagList.addAll(tagToAddList);
      updatedTagList.addAll(currentTagList);

      return (List<Tag>) tagRepository.saveAll(updatedTagList);
   }

   public void attachTagListToTask(List<Tag> tagList, Task task) {
      LOGGER.trace("Enter attachTagListToTask(tagList, task)");
      tagList.forEach(currentTag -> currentTag.getTaskList().add(task));
   }

   public void attachTagListToProject(List<Tag> tagList, Project project) {
      LOGGER.trace("Enter attachTagListToProject(tagList, project)");
      tagList.forEach(tag -> tag.setProject(project));
   }

   public List<String> getNameList(List<Tag> tagList) {
      LOGGER.trace("Enter getNameList(tagList)");
      return tagList.stream().map(tag -> tag.getName()).collect(Collectors.toList());
   }
}


