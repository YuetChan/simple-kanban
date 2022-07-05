package com.tycorp.cuptodo.story;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.ProjectRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class StoryServiceTest {
   @InjectMocks
   private StoryService storyService;

   @Mock
   private StoryRepository storyRepository;
   @Mock
   private ProjectRepository projectRepository;

   @Test
   public void shouldCreateStory() {
      Story story = new Story();

      story.setName("story_name_1");
      story.setDueAt(System.currentTimeMillis());
      story.setProjectId("project_id_1");

      Project project = new Project();
      project.setId("project_id_1");

      when(projectRepository.findById(Mockito.any())).thenReturn(Optional.of(project));
      when(storyRepository.save(Mockito.any())).thenReturn(story);

      assertTrue(storyService.create(story).getProject().getId().equals("project_id_1"));
   }

   @Test
   public void shouldUpdateStory() {
      Story story = new Story();

      story.setName("story_name_1");
      story.setDueAt(System.currentTimeMillis());

      Story updateStory = new Story();

      updateStory.setName("story_name_2");
      updateStory.setDueAt(System.currentTimeMillis());

      when(storyRepository.save(Mockito.any())).thenReturn(story);

      assertTrue(storyService.update(story, updateStory).getName().equals("story_name_2"));
   }

   @Test
   public void shouldDeleteStory() {
      Story story = new Story();

      story.setName("story_name_1");
      story.setDueAt(System.currentTimeMillis());

      when(storyRepository.save(Mockito.any())).thenReturn(story);

      assertTrue(storyService.delete(story).isActive() == false);
   }


}
