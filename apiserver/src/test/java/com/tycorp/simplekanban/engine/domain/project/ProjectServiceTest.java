package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectCreateValidator;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectUpdateValidator;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class ProjectServiceTest {
   // Services
   @Spy
   @InjectMocks
   private ProjectService projectService;

   @Mock
   private Map<String, Object> configCache;

   // Default validators
   @Mock
   private DefaultProjectCreateValidator defaultProjectCreateValidator;

   @Mock
   private DefaultProjectUpdateValidator defaultProjectUpdateValidator;

   // Persistance stages
   @Mock
   private PersistProjectStage persistProjectStage;

   @Mock
   private PersistUserToProjectStage persistUserToProjectStage;

   @Mock
   private PersistProjectUUIDToProjectStage persistProjectUUIDToProjectStage;

   @Mock
   private MergePropertiesToProjectStage mergePropertiesToProjectStage;

   @Mock
   private MergeCollaboratorListToProjectStage mergeCollaboratorListToProjectStage;

   // Repositories
   @Mock
   private ProjectRepository projectRepository;

   @Test
   public void shouldCreateProjectAndReflectCollaboratorList() throws Exception {
      User collaborator_1 = new User();
      collaborator_1.setEmail("collaborator_1@simplekanban.com");

      User collaborator_2 = new User();
      collaborator_1.setEmail("collaborator_2@simplekanban.com");

      List<User> collaboratorList = new ArrayList<>();

      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      Project dummyCreatedProject = new Project();
      dummyCreatedProject.setCollaboratorList(collaboratorList);

      List<String> collaboratorEmailList = collaboratorList
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      ProjectService.CreateModel model = new ProjectService.CreateModel(
              "title",
              "description",
              "yuetchany@simplekanban.com");

      when(projectRepository.save(Mockito.any()))
              .thenReturn(dummyCreatedProject);

      when(defaultProjectCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(persistUserToProjectStage.process(Mockito.any()))
              .thenReturn(dummyCreatedProject);

      when(persistProjectUUIDToProjectStage.process(Mockito.any()))
              .thenReturn(dummyCreatedProject);

      when(persistProjectStage.process(Mockito.any()))
              .thenReturn(dummyCreatedProject);

      Project actualProject = projectService.create(model);

      List<String> actualCollaboratorEmailList = actualProject.getCollaboratorList()
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(collaboratorEmailList.containsAll(actualCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(collaboratorEmailList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithInvalidUser() throws Exception {
      ProjectService.CreateModel model = new ProjectService.CreateModel(
              "title",
              "description",
              "yuetchany@simplekanban.com");

      when(defaultProjectCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("User not found"));

      assertThrows(ResponseStatusException.class, () -> projectService.create(model));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithCollaboratorListCountExceedMaximum() throws Exception {
      ProjectService.CreateModel model = new ProjectService.CreateModel(
              "title",
              "description",
              "yuetchany@simplekanban.com");

      when(defaultProjectCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("Collaborator list count exceed maximum"));

      assertThrows(ResponseStatusException.class, () -> projectService.create(model));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenUpdateProjectWithCollaboratorListCountExceedMaximum() throws Exception {
      when(configCache.get("collaboratorEmailToSecretMap"))
              .thenReturn(new HashMap<>());

      ProjectService.UpdateModel model = new ProjectService.UpdateModel(
              "dummy-id",
              "title",
              "description");

      when(defaultProjectUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("Collaborator list count exceed maximum"));

      assertThrows(ResponseStatusException.class, () -> projectService.update(model));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenUpdateProjectWithCollaboratorListInvalid() throws Exception {
      when(configCache.get("collaboratorEmailToSecretMap"))
              .thenReturn(new HashMap<>());

      ProjectService.UpdateModel model = new ProjectService.UpdateModel(
              "dummy-id",
              "title",
              "description",
              new HashMap<>());

      when(defaultProjectUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("Some of the collaborators are invalid"));

      assertThrows(ResponseStatusException.class, () -> projectService.update(model));
   }

   @Test
   public void shouldUpdatePropertiesOfProject() throws Exception {
      // Updated project
      Project dummyUpdatedProject = new Project();

      List<User> collboratorList = new ArrayList<>();

      User user1 = new User();
      User user2 = new User();

      user1.setEmail("collaborator_1@simplekanban.com");
      user2.setEmail("collaborator_2@simplekanban.com");

      collboratorList.add(user1);
      collboratorList.add(user2);

      ProjectService.UpdateModel model = new ProjectService.UpdateModel(
              "dummy-id",
              "name",
              "description",
              collboratorList);

      when(defaultProjectUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(mergePropertiesToProjectStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedProject);

      when(mergeCollaboratorListToProjectStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedProject);

      projectService.update(model);

      verify(mergePropertiesToProjectStage).process(Mockito.any());
   }

   @Test
   public void shouldUpdateCollaboratorListOfProject() throws Exception {
      // Updated project
      Project dummyUpdatedProject = new Project();

      List<User> collboratorList = new ArrayList<>();

      User user1 = new User();
      User user2 = new User();

      user1.setEmail("collaborator_1@simplekanban.com");
      user2.setEmail("collaborator_2@simplekanban.com");

      collboratorList.add(user1);
      collboratorList.add(user2);

      ProjectService.UpdateModel model = new ProjectService.UpdateModel(
              "dummy-id",
              "name",
              "description",
              collboratorList);

      when(defaultProjectUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(mergePropertiesToProjectStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedProject);

      when(mergeCollaboratorListToProjectStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedProject);

      projectService.update(model);

      verify(mergeCollaboratorListToProjectStage).process(Mockito.any());
   }
}
