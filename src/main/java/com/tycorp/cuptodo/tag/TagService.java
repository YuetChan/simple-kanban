package com.tycorp.cuptodo.tag;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.task.Task;
import com.tycorp.cuptodo.task.TaskRepository;
import com.tycorp.cuptodo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TagService {
   @Autowired
   private TagRepository tagRepository;

   @Autowired
   private TaskRepository taskRepository;
   @Autowired
   private UserRepository userRepository;

   public List<Tag> addTagListForProjectAndTask(List<Tag> tagList, Project project, Task task) {
      List<Tag> existedTagList = tagRepository.findByProjectIdAndNameIn(project.getId(), tagList
              .stream()
              .map(tag -> tag.getName())
              .collect(Collectors.toList()));

      List<String> existedTagListNames = new ArrayList<>();

      existedTagList.forEach(existedTag -> {
         task.getTagList().add(existedTag);
         existedTag.getTaskList().add(task);

         existedTagListNames.add(existedTag.getName());
      });

      List<Tag> newTagList = tagList
              .stream()
              .map(tag -> {
                 tag.setProjectId(project.getId());
                 tag.setProject(project);

                 return tag;
              })
              .filter(tag -> {
                 if(!existedTagListNames.contains(tag.getName())) {
                    tag.getTaskList().add(task);
                    return true;
                 }else {
                    return false;
                 }
              })
              .collect(Collectors.toList());

      newTagList = (List<Tag>) tagRepository.saveAll(newTagList);
      existedTagList = (List<Tag>) tagRepository.saveAll(existedTagList);

      existedTagList.addAll(newTagList);

      return existedTagList;
   }
}
