package com.tycorp.simplekanban.engine.domain.tag;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.tag.repository.TagRepository;
import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.domain.project.Project;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TagService {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(TagService.class);

   // Repositories
   @Autowired
   private TagRepository tagRepository;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private UserRepository userRepository;

   public List<Tag> addTagList(List<String> tagNameList, String projectId, String taskId) {
      Optional<Project> projectMaybe = projectRepository.findById(projectId);
      Optional<Task> taskMaybe = taskRepository.findById(taskId);

      if(projectMaybe.isPresent() && taskMaybe.isPresent()) {
         Page<Tag> page = tagRepository.findByProjectIdAndNameIn(
                 projectId,
                 tagNameList,
                 PageRequest.of(0, 3000));

         LOGGER.debug("Found total of {} tags", page.getTotalElements());

         if(page.getTotalElements() > 3000) {
            LOGGER.debug("Tags count exceeds 3000");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tag count exceeds 3000");
         }

         Project project = projectMaybe.get();

         Task task = taskMaybe.get();

         List<Tag> existedTagList = page.getContent();
         attachTagListToTask(existedTagList, task);

         List<String> existedTagNameList = toNameList(existedTagList);

         List<Tag> nonExistedTagList = tagNameList.stream()
                 .map(name -> {
                    Tag tag = new Tag();
                    tag.setName(name);
                    return tag;
                 })
                 .filter(tag -> !existedTagNameList.contains(tag.getName()))
                 .collect(Collectors.toList());

         attachTagListToProject(nonExistedTagList, project);
         attachTagListToTask(nonExistedTagList, task);

         List<Tag> updatedTagList = new ArrayList<>();

         updatedTagList.addAll(nonExistedTagList);
         updatedTagList.addAll(existedTagList);

         return (List<Tag>) tagRepository.saveAll(updatedTagList);
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid project / task on tag lsit");
   }

   public void attachTagListToTask(List<Tag> tagList, Task task) {
      tagList.forEach(currentTag -> currentTag.getTaskList().add(task));
   }

   public void attachTagListToProject(List<Tag> tagList, Project project) {
      tagList.forEach(tag -> tag.setProject(project));
   }

   public List<String> toNameList(List<Tag> tagList) {
      return tagList.stream().map(tag -> tag.getName()).collect(Collectors.toList());
   }
}


