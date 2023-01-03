package com.tycorp.simplekanban.task;

import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.tag.Tag;
import com.tycorp.simplekanban.tag.TagService;
import com.tycorp.simplekanban.task.value.Status;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class TaskServiceTest {
   @Spy
   @InjectMocks
   private TaskService taskService;

   @Mock
   private TagService tagService;

   @Mock
   private TaskRepository taskRepository;

   @Test
   public void shouldCreateTaskAndReflectTagList() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_2");

      tagList.add(tag_1);
      tagList.add(tag_2);

      Project project = new Project();
      project.setId("project_id_1");

      TaskNode node = new TaskNode();
      node.setProjectId("project_id_1");
      task.setTaskNode(node);

      task.setTagList(tagList);

      doReturn(true).when(taskService).checkIfTagListCountValid(Mockito.any());
      doReturn(true).when(taskService).checkIfProjectForTaskExists(Mockito.any());
      doReturn(true).when(taskService).checkIfProjectForTaskExists(Mockito.any());

      doReturn(true).when(taskService).insertTaskToLinkedList(Mockito.any());
      doNothing().when(taskService).attachTaskToProject(Mockito.any());

      when(taskRepository.save(Mockito.any())).thenReturn(task);
      when(tagService.addTagListToProjectAndTask(Mockito.any(), Mockito.any(), Mockito.any()))
              .thenReturn(tagList);

      Task createdTask = taskService.create(task);
      List<Tag> actualTagList = createdTask.getTagList();

      assertTrue(actualTagList.containsAll(tagList));
      assertTrue(tagList.containsAll(actualTagList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithTagListCountExceedMaximum() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();
      for(int i = 0; i < 21; i++) {
         tagList.add(new Tag());
      }

      task.setTagList(tagList);

      doReturn(false).when(taskService).checkIfTagListCountValid(Mockito.any());
      assertThrows(ResponseStatusException.class, () -> taskService.create(task));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithInvalidProject() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();
      for(int i = 0; i < 21; i++) {
         tagList.add(new Tag());
      }

      Project project = new Project();
      project.setId("project_id_1");

      TaskNode node = new TaskNode();
      node.setProjectId("project_id_1");

      task.setTaskNode(node);

      doReturn(true).when(taskService).checkIfTagListCountValid(Mockito.any());
      doReturn(true).when(taskService).checkIfSubTaskListCountValid(Mockito.any());
      doReturn(false).when(taskService).checkIfProjectForTaskExists(Mockito.any());

      assertThrows(ResponseStatusException.class, () -> {
         Task createdTask = taskService.create(task);
      });
   }

   @Test
   public void shouldUpdateTaskAndReflectExpectedTagList() throws Exception {
      // Original task
      Task originalTask = new Task();

      List<Tag> originalTagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_2");

      originalTagList.add(tag_1);
      originalTagList.add(tag_2);
      originalTask.setTagList(originalTagList);

      // Updated task
      Task updatedTask = new Task();

      List<Tag> updatedTagList = new ArrayList<>();

      Tag tag_3 = new Tag();
      tag_3.setName("tag_3");

      updatedTagList.add(tag_3);
      updatedTask.setTagList(updatedTagList);

      TaskNode updatedNode = new TaskNode();
      updatedNode.setStatus(Status.BACKLOG);

      updatedTask.setTaskNode(updatedNode);

      doReturn(true).when(taskService).detachTaskNodeFromLinkedList(Mockito.any());
      doReturn(true).when(taskService).reinsertTaskNodeToLinkedList(Mockito.any(),
              Mockito.any(), Mockito.any(), Mockito.any());

      when(taskRepository.save(Mockito.any())).thenReturn(updatedTask);
      when(tagService.addTagListToProjectAndTask(Mockito.any(), Mockito.any(), Mockito.any()))
              .thenReturn(updatedTagList);

      List<Tag> actualTagList = taskService.update(originalTask, updatedTask).getTagList();

      assertTrue(actualTagList.containsAll(updatedTagList));
      assertTrue(updatedTagList.containsAll(actualTagList));
   }

   @Test
   public void shouldDeleteTask() throws Exception {
      Task task = new Task();

      when(taskRepository.save(Mockito.any())).thenReturn(task);
      doReturn(true).when(taskService).detachTaskNodeFromLinkedList(Mockito.any());

      taskService.delete(task);
      assertTrue(task.isActive() == false);
   }
}
