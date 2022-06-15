package com.tycorp.cuptodo.project;

import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
public class ProjectServiceTest {
   @Mock
   private TagService tagService;

   @Mock
   private ProjectRepository projectRepository;

   @Mock
   private UserRepository userRepository;

   @InjectMocks
   private ProjectService projectService;

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
   public void shouldUpdateProjectWithExpectedCollaboratorList() throws Exception {
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

}
