package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class TaskServiceTest {
   @InjectMocks
   private TaskService taskService;
   @Mock
   private TaskRepository taskRepository;

   @Mock
   private TagService tagService;

   @Test
   public void shouldCreateTaskWithExpectedTagList() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_2");

      tagList.add(tag_1);
      tagList.add(tag_2);

      Project project = new Project();
      project.setId("project_id");

      task.setProject(project);
      task.setTagList(tagList);

      when(taskRepository.save(Mockito.any())).thenReturn(task);
      when(tagService.addTagListForProjectAndTask(Mockito.any(), Mockito.any(), Mockito.any()))
              .thenReturn(tagList);

      Task createdTask = taskService.create(task);
      List<Tag> actualTagList = createdTask.getTagList();

      assertTrue(actualTagList.containsAll(tagList));
      assertTrue(tagList.containsAll(actualTagList));
   }

   @Test
   public void shouldUpdateTaskWithExpectedTagList() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_2");

      tagList.add(tag_1);
      tagList.add(tag_2);
      task.setTagList(tagList);

      Task updatedTask = new Task();
      List<Tag> updatedTagList = new ArrayList<>();

      Tag tag_3 = new Tag();
      tag_3.setName("tag_3");

      updatedTagList.add(tag_3);
      updatedTask.setTagList(updatedTagList);

      when(taskRepository.save(Mockito.any())).thenReturn(task);
      when(tagService.addTagListForProjectAndTask(Mockito.any(), Mockito.any(), Mockito.any()))
              .thenReturn(updatedTagList);

      Task _updatedTask = taskService.update(task, updatedTask);

      List<Tag> actualTagList = _updatedTask.getTagList();

      assertTrue(actualTagList.containsAll(tagList));
      assertTrue(tagList.containsAll(actualTagList));
   }

}
