package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TaskService {
   @Autowired
   private TagService tagService;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private UserRepository userRepository;

   public Task create(Task task) {
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
      tagToRemoveList.forEach(tag -> task.removeTag(tag));

      return taskRepository.save(task);
   }
}
