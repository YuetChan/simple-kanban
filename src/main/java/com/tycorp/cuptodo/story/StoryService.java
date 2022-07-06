package com.tycorp.cuptodo.story;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectController;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.task.Task;
import com.tycorp.cuptodo.task.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class StoryService {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectController.class);

   @Autowired
   private StoryRepository storyRepository;

   @Autowired
   private ProjectRepository projectRepository;
   @Autowired
   private TaskRepository taskRepository;

   public Story create(Story story) {
      LOGGER.trace("Enter create(story)");

      Optional<Project> projectMaybe = projectRepository.findById(story.getProjectId());
      if(!projectMaybe.isPresent()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "project is invalid");
      }

      if(projectMaybe.get().getStoryList().size() > 20) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "storyList exceeds max size");
      }

      story.setProject(projectMaybe.get());
      return storyRepository.save(story);
   }

   public Story update(Story story, Story updatedStory) {
      LOGGER.trace("Enter update(story, updatedStory)");

      story.setName(updatedStory.getName());
      story.setDueAt(updatedStory.getDueAt());

      return storyRepository.save(story);
   }

   public Story delete(Story story) {
      LOGGER.trace("Enter delete(story)");

      // Delete story
      story.setActive(false);
      return storyRepository.save(story);
   }

   public Story detachStoryFromTask(String storyId, String taskId) {
      Optional<Story> storyMaybe = storyRepository.findById(storyId);
      Optional<Task> taskMaybe = taskRepository.findById(taskId);

      if(!storyMaybe.isPresent()) {
         throw new ResponseStatusException(HttpStatus.NOT_FOUND);
      }

      if(!taskMaybe.isPresent()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "taskId is invalid");
      }

      Story story = storyMaybe.get();
      Task task = taskMaybe.get();

      if(task.getStory() == null) {
         return story;
      }

      if(!story.getId().equals(task.getStory().getId())) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "taskId is invalid");
      }

      story.removeTask(task);
      return storyRepository.save(story);
   }
}
