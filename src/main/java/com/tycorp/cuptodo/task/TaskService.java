package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectController;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.story.StoryRepository;
import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);
   
   @Autowired
   private TagService tagService;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private ProjectRepository projectRepository;
   @Autowired
   private StoryRepository storyRepository;
   @Autowired
   private UserRepository userRepository;

   public Task create(Task task) {
      LOGGER.trace("Enter create(task)");

      // Check if project and story are existed
      Optional<Project> projectMaybe = projectRepository.findById(task.getProjectId());
      if(!projectMaybe.isPresent()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
      }

      task.setProject(projectMaybe.get());

      if(task.getStoryId() != null) {
         Optional<Story> storyMaybe = storyRepository.findById(task.getStoryId());
         if(!storyMaybe.isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
         }

         task.setStory(storyMaybe.get());
      }

      // Temporarily remove tag list from task
      List<Tag> tagList = task.getTagList();
      task.setTagList(new ArrayList<>());

      // Get task with persistent state
      task = taskRepository.save(task);

      // Populates from the child/owner side
      List<Tag> tagAddedList = tagService.addTagListForProjectAndTask(tagList,
              task.getProject(), task);
      task.getTagList().addAll(tagAddedList);

      return task;
   }

   public Task update(Task task, Task updatedTask) {
      LOGGER.trace("Enter update(task, updatedTask)");

      // Update task properties
      task.setDescription(updatedTask.getDescription());
      task.setSubTaskList(updatedTask.getSubTaskList());

      // Remove tag list from or add tag to task
      List<Tag> tagList = task.getTagList();
      List<String> tagListNames = tagList.stream()
              .map(tag -> tag.getName())
              .collect(Collectors.toList());

      List<Tag> updatedTagList = updatedTask.getTagList();
      List<String> updatedTagListNames = updatedTagList.stream()
              .map(tag -> tag.getName())
              .collect(Collectors.toList());

      List<Tag> tagToRemoveList = tagList.stream()
              .filter(tag -> !updatedTagListNames.contains(tag.getName()))
              .collect(Collectors.toList());
      List<Tag> tagToAddList = updatedTagList.stream()
              .filter(tag -> !tagListNames.contains(tag.getName()))
              .collect(Collectors.toList());

      // Populate from the child/owner side
      List<Tag> tagAddedList = tagService.addTagListForProjectAndTask(tagToAddList,
              task.getProject(), task);
      task.getTagList().addAll(tagAddedList);

      // Remove from parent/owner side
      task.removeTags(tagToRemoveList);

      return taskRepository.save(task);
   }

   public Task delete(Task task) {
      LOGGER.trace("Enter delete(task)");

      // Delete task
      task.setActive(false);

      return taskRepository.save(task);
   }
}
