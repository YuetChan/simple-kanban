package com.tycorp.cuptodo.project;

import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import com.tycorp.cuptodo.user.value.Permissible;
import com.tycorp.cuptodo.user.value.Permission;
import com.tycorp.cuptodo.user.value.Permit;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class ProjectServiceTest {
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
      owner.setEmail("project_owner@gmail.com");

      project.setUser(owner);

      User collaborator_1 = new User();
      collaborator_1.setEmail("collaborator_1@gmail.com");

      User collaborator_2 = new User();
      collaborator_1.setEmail("collaborator_2@gmail.com");

      List<User> collaboratorList = new ArrayList<>();
      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      project.setCollaboratorList(collaboratorList);

      List<String> collaboratorEmailList = collaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.of(owner));
      when(userRepository.findAllByEmailIn(Mockito.any())).thenReturn(collaboratorList);
      when(userRepository.countByEmailIn(Mockito.any())).thenReturn(2);

      when(projectRepository.save(Mockito.any())).thenReturn(project);

      Project createdProject = projectService.create(project);

      List<String> actualCollaboratorEmailList = createdProject.getCollaboratorList().stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(collaboratorEmailList.containsAll(actualCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(collaboratorEmailList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithNonExistedUser() throws Exception {
      when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.empty());

      assertThrows(ResponseStatusException.class, () -> {
         Project createdProject = projectService.create(new Project());
      });
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateProjectWithCollaboratorListExceedMaxSize() throws Exception {
      when(userRepository.findByEmail(Mockito.any())).thenReturn(Optional.empty());

      Project project = new Project();

      List<User> collaboratorList = new ArrayList();
      for(int i = 0; i < 22; i++) {
         collaboratorList.add(new User());
      }

      project.setCollaboratorList(collaboratorList);

      assertThrows(ResponseStatusException.class, () -> {
         Project createdProject = projectService.create(project);
      });
   }

   @Test
   public void shouldUpdateProjectAndReflectCollaboratorList() throws Exception {
      Project project = new Project();

      User owner = new User();
      owner.setEmail("project_owner@gmail.com");

      project.setUser(owner);

      User collaborator_1 = new User();
      collaborator_1.setEmail("collaborator_1@gmail.com");
      collaborator_1.getShareProjectList().add(project);

      User collaborator_2 = new User();
      collaborator_2.setEmail("collaborator_2@gmail.com");
      collaborator_2.getShareProjectList().add(project);

      List<User> collaboratorList = new ArrayList<>();
      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      project.setCollaboratorList(collaboratorList);

      Project updatedProject = new Project();
      updatedProject.setUser(owner);

      User collaborator_3 = new User();
      collaborator_3.setEmail("collaborator_3@gmail.com");

      List<User> updatedCollaboratorList = new ArrayList<>();
      updatedCollaboratorList.add(collaborator_3);

      List<String> updatedCollaboratorEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      updatedProject.setCollaboratorList(updatedCollaboratorList);

      when(userRepository.findAllByEmailIn(Mockito.any())).thenReturn(collaboratorList);
      when(userRepository.countByEmailIn(Mockito.any())).thenReturn(1);

      when(projectRepository.save(Mockito.any())).thenReturn(updatedProject);

      Project _updatedProject = projectService.update(project, updatedProject);

      List<String> actualCollaboratorEmailList = _updatedProject.getCollaboratorList().stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(updatedCollaboratorEmailList.containsAll(actualCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(updatedCollaboratorEmailList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenUpdateProjectWithCollaboratorListExceedMaxSize() throws Exception {
      Project project = new Project();

      User owner = new User();
      owner.setEmail("project_owner@gmail.com");

      project.setUser(owner);

      User collaborator_1 = new User();
      collaborator_1.setEmail("collaborator_1@gmail.com");
      collaborator_1.getShareProjectList().add(project);

      User collaborator_2 = new User();
      collaborator_2.setEmail("collaborator_2@gmail.com");
      collaborator_2.getShareProjectList().add(project);

      List<User> collaboratorList = new ArrayList<>();
      collaboratorList.add(collaborator_1);
      collaboratorList.add(collaborator_2);

      project.setCollaboratorList(collaboratorList);

      Project updatedProject = new Project();
      updatedProject.setUser(owner);

      User collaborator_3 = new User();
      collaborator_3.setEmail("collaborator_3@gmail.com");

      List<User> updatedCollaboratorList = new ArrayList<>();
      updatedCollaboratorList.add(collaborator_3);

      List<String> updatedCollaboratorEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      updatedProject.setCollaboratorList(updatedCollaboratorList);

      when(userRepository.findAllByEmailIn(Mockito.any())).thenReturn(collaboratorList);
      when(userRepository.countByEmailIn(Mockito.any())).thenReturn(1);

      when(projectRepository.save(Mockito.any())).thenReturn(updatedProject);

      Project _updatedProject = projectService.update(project, updatedProject);

      List<String> actualCollaboratorEmailList = _updatedProject.getCollaboratorList().stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      assertTrue(updatedCollaboratorEmailList.containsAll(actualCollaboratorEmailList));
      assertTrue(actualCollaboratorEmailList.containsAll(updatedCollaboratorEmailList));
   }

   @Test
   public void shouldUpdateUserPermissionsForProject() {
      Project project = new Project();
      project.setId("project_id_1");

      Map<String, List<Permission>> userPermissionsMp = new HashMap();
      List<Permission> permissionList = new ArrayList();
      permissionList.add(new Permission(project.getId(), Permissible.PROJECT_STORY.toString(), Permit.READ.toString()));
      permissionList.add(new Permission(project.getId(), Permissible.PROJECT_STORY.toString(), Permit.WRITE.toString()));

      userPermissionsMp.put("yuetcheukchan@gmail.com", permissionList);
      userPermissionsMp.put("cchan@gmail.com", permissionList);

      User user1 = new User();
      user1.setEmail("yuetcheukchan@gmail.com");

      User user2 = new User();
      user2.setEmail("cchan@gmail.com");

      List<User> userList = new ArrayList();
      userList.add(user1);
      userList.add(user2);

      when(userRepository.findAllByEmailIn(Mockito.any())).thenReturn(userList);
      when(userRepository.saveAll(Mockito.any())).thenReturn(userList);

      projectService.updatePermissions(project, userPermissionsMp);

      assertTrue(userList.get(0).getPermissionList().size() == 2);
      assertTrue(userList.get(1).getPermissionList().size() == 2);
   }

}
