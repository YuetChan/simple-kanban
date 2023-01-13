package com.tycorp.simplekanban.project;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.ProjectService;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
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
   @Spy
   @InjectMocks
   private ProjectService projectService;

   @Mock
   private ProjectRepository projectRepository;
   @Mock
   private UserRepository userRepository;

   @Test
   public void shouldCreateProjectWithExpectedCollaboratorList() throws Exception {
      Project project = new Project();

      User owner = new User();
      owner.setEmail("project_owner@simplekanban.com");

      project.setUser(owner);

      User collaborator_1 = new User();
      collaborator_1.setEmail("collaborator_1@simplekanban.com");

      User collaborator_2 = new User();
      collaborator_1.setEmail("collaborator_2@simplekanban.com");

      List<User> collaboratorList = new ArrayList<>();

      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      project.setCollaboratorList(collaboratorList);

      List<String> collaboratorEmailList = collaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      doReturn(true).when(projectService).checkIfUserForEmailExists(Mockito.any());
      doReturn(true).when(projectService).checkIfCollaboratorListValid(Mockito.any());
      doReturn(true).when(projectService).checkIfCollaboratorListCountValid(Mockito.any());

      doNothing().when(projectService).attachCollaboratorListToProject(Mockito.any());
      doNothing().when(projectService).attachUserToProject(Mockito.any());

      when(projectRepository.save(Mockito.any())).thenReturn(project);

      doNothing().when(projectService).attachNewProjectUUIDToProject(Mockito.any());

      List<String> actualCollaboratorEmailList = projectService.create(project).getCollaboratorList().stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(collaboratorEmailList.containsAll(actualCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(collaboratorEmailList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithInvalidUser() throws Exception {
      doReturn(false).when(projectService).checkIfUserForEmailExists(Mockito.any());
      assertThrows(ResponseStatusException.class, () -> projectService.create(new Project()));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithCollaboratorListCountExceedMaximum() throws Exception {
      when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.empty());

      doReturn(true).when(projectService).checkIfUserForEmailExists(Mockito.any());
      doReturn(false).when(projectService).checkIfCollaboratorListCountValid(Mockito.any());
      doReturn(true).when(projectService).checkIfCollaboratorListValid(Mockito.any());

      Project project = new Project();

      List<User> collaboratorList = new ArrayList();
      for(int i = 0; i < 22; i++) {
         collaboratorList.add(new User());
      }

      project.setCollaboratorList(collaboratorList);

      assertThrows(ResponseStatusException.class, () -> projectService.create(project));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenUpdateProjectWithCollaboratorListCountExceedMaximum() throws Exception {
      Project originalProject = new Project();

      User owner = new User();
      owner.setEmail("project_owner@simplekanban.com");

      originalProject.setUser(owner);

      User collaborator_1 = new User();

      collaborator_1.setEmail("collaborator_1@simplekanban.com");
      collaborator_1.getShareProjectList().add(originalProject);

      User collaborator_2 = new User();

      collaborator_2.setEmail("collaborator_2@simplekanban.com");
      collaborator_2.getShareProjectList().add(originalProject);

      List<User> collaboratorList = new ArrayList<>();

      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      originalProject.setCollaboratorList(collaboratorList);

      Project updatedProject = new Project();
      updatedProject.setUser(owner);

      User collaborator_3 = new User();
      collaborator_3.setEmail("collaborator_3@simplekanban.com");

      Map<String, String> collaboratorEmailSecretMap = new HashMap();
      collaboratorEmailSecretMap.put("collaborator_3@simplekanban.com", "ABCDE");

      List<User> updatedCollaboratorList = new ArrayList<>();

      updatedCollaboratorList.add(collaborator_3);
      updatedProject.setCollaboratorList(updatedCollaboratorList);

      doReturn(false).when(projectService).checkIfCollaboratorListCountValid(Mockito.any());
      doReturn(true).when(projectService).checkIfCollaboratorListValid(Mockito.any());

      assertThrows(ResponseStatusException.class, () -> projectService.update(originalProject, updatedProject, collaboratorEmailSecretMap));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenUpdateProjectWithCollaboratorListInvalid() throws Exception {
      Project originalProject = new Project();

      User owner = new User();
      owner.setEmail("project_owner@simplekanban.com");

      originalProject.setUser(owner);

      User collaborator_1 = new User();

      collaborator_1.setEmail("collaborator_1@simplekanban.com");
      collaborator_1.getShareProjectList().add(originalProject);

      User collaborator_2 = new User();

      collaborator_2.setEmail("collaborator_2@simplekanban.com");
      collaborator_2.getShareProjectList().add(originalProject);

      List<User> collaboratorList = new ArrayList<>();

      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      originalProject.setCollaboratorList(collaboratorList);

      Project updatedProject = new Project();
      updatedProject.setUser(owner);

      User collaborator_3 = new User();
      collaborator_3.setEmail("collaborator_3@simplekanban.com");

      Map<String, String> collaboratorEmailSecretMap = new HashMap();
      collaboratorEmailSecretMap.put("collaborator_3@simplekanban.com", "ABCDE");

      List<User> updatedCollaboratorList = new ArrayList<>();

      updatedCollaboratorList.add(collaborator_3);
      updatedProject.setCollaboratorList(updatedCollaboratorList);

      doReturn(true).when(projectService).checkIfCollaboratorListCountValid(Mockito.any());
      doReturn(false).when(projectService).checkIfCollaboratorListValid(Mockito.any());

      assertThrows(ResponseStatusException.class, () -> projectService.update(originalProject, updatedProject, collaboratorEmailSecretMap));
   }

   @Test
   public void shouldUpdateProjectAndReflectCollaboratorList() throws Exception {
      Project originalProject = new Project();

      User owner = new User();
      owner.setEmail("project_owner@simplekanban.com");

      originalProject.setUser(owner);

      User collaborator_1 = new User();

      collaborator_1.setEmail("collaborator_1@simplekanban.com");
      collaborator_1.getShareProjectList().add(originalProject);

      User collaborator_2 = new User();

      collaborator_2.setEmail("collaborator_2@simplekanban.com");
      collaborator_2.getShareProjectList().add(originalProject);

      List<User> originalCollaboratorList = new ArrayList<>();

      originalCollaboratorList.add(collaborator_1);
      originalCollaboratorList.add(collaborator_2);

      originalProject.setCollaboratorList(originalCollaboratorList);

      Project updatedProject = new Project();
      updatedProject.setUser(owner);

      User collaborator_3 = new User();
      collaborator_3.setEmail("collaborator_3@simplekanban.com");

      Map<String, String> collaboratorEmailSecretMap = new HashMap();
      collaboratorEmailSecretMap.put("collaborator_3@simplekanban.com", "ABCDE");

      List<User> updatedCollaboratorList = new ArrayList<>();
      updatedCollaboratorList.add(collaborator_3);

      List<String> updatedCollaboratorEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());
      updatedProject.setCollaboratorList(updatedCollaboratorList);

      List<String> originalCollaboratorEmailList = originalCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      when(userRepository.findAllByEmailIn(Mockito.any())).thenReturn(updatedCollaboratorList);

//      doReturn(true).when(projectService).checkIfSecretsAreValid(Mockito.any(), Mockito.any());
//      doReturn(true).when(projectService).checkIfCollaboratorListCountValid(Mockito.any());
//      doReturn(true).when(projectService).checkIfCollaboratorListValid(Mockito.any());

      when(projectRepository.save(Mockito.any())).thenReturn(updatedProject);

      List<String> actualCollaboratorEmailList = projectService.update(originalProject, updatedProject,
                      collaboratorEmailSecretMap).getCollaboratorList()
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(actualCollaboratorEmailList.containsAll(updatedCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(originalCollaboratorEmailList));
   }
}
