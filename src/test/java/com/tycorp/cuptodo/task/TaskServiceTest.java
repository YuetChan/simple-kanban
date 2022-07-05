package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectRepository;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.story.StoryRepository;
import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.TagService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class TaskServiceTest {
   @InjectMocks
   private TaskService taskService;

   @Mock
   private TagService tagService;

   @Mock
   private ProjectRepository projectRepository;
   @Mock
   private StoryRepository storyRepository;
   @Mock
   private TaskRepository taskRepository;

   @Test
   public void shouldCreateTaskAndReflectTagList() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_name_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_name_2");

      tagList.add(tag_1);
      tagList.add(tag_2);

      Project project = new Project();
      project.setId("project_id_1");

      task.setProjectId("project_id_1");
      task.setTagList(tagList);

      Story story = new Story();
      story.setId("story_id_1");

      task.setStory(story);

      when(projectRepository.findById(Mockito.any())).thenReturn(Optional.of(project));
      when(storyRepository.findById(Mockito.any())).thenReturn(Optional.of(story));

      when(taskRepository.save(Mockito.any())).thenReturn(task);
      when(tagService.addTagListForProjectAndTask(Mockito.any(), Mockito.any(), Mockito.any()))
              .thenReturn(tagList);

      Task createdTask = taskService.create(task);
      List<Tag> actualTagList = createdTask.getTagList();

      assertTrue(actualTagList.containsAll(tagList));
      assertTrue(tagList.containsAll(actualTagList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithTagListExceedMaxSize() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      for(int i = 0; i < 21; i++) {
         tagList.add(new Tag());
      }

      task.setTagList(tagList);

      assertThrows(ResponseStatusException.class, () -> {
         Task createdTask = taskService.create(task);
      });
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithNonExistedProject() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      for(int i = 0; i < 21; i++) {
         tagList.add(new Tag());
      }

      Project project = new Project();
      project.setId("project_id_1");

      task.setProjectId("project_id_1");

      when(projectRepository.findById(Mockito.any())).thenReturn(Optional.empty());

      assertThrows(ResponseStatusException.class, () -> {
         Task createdTask = taskService.create(task);
      });
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithNonExistedStory() throws Exception {
      Task task = new Task();

      List<Tag> tagList = new ArrayList<>();

      for(int i = 0; i < 20; i++) {
         tagList.add(new Tag());
      }

      Project project = new Project();
      project.setId("project_id_1");

      task.setProjectId("project_id_1");

      Story story = new Story();
      story.setId("story_id_1");

      task.setStory(story);

      when(projectRepository.findById(Mockito.any())).thenReturn(Optional.of(project));
      when(storyRepository.findById(Mockito.any())).thenReturn(Optional.empty());

      assertThrows(ResponseStatusException.class, () -> {
         Task createdTask = taskService.create(task);
      });
   }

   @Test
   public void shouldUpdateTaskAndReflectExpectedTagList() throws Exception {
      Task task = new Task();
      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_name_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_name_2");

      tagList.add(tag_1);
      tagList.add(tag_2);
      task.setTagList(tagList);

      Task updatedTask = new Task();
      List<Tag> updatedTagList = new ArrayList<>();

      Tag tag_3 = new Tag();
      tag_3.setName("tag_name_3");

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

   @Test
   public void shouldDeleteTask() throws Exception {
      Task task = new Task();
      when(taskRepository.save(Mockito.any())).thenReturn(task);

      taskService.delete(task);
      assertTrue(task.isActive() == false);
   }

}
