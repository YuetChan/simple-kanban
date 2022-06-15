package com.tycorp.cuptodo.project;

import com.tycorp.cuptodo.tag.TagService;
import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
   @Autowired
   private TagService tagService;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private UserRepository userRepository;

   public Project create(Project project) {
      // Init the user email for project
      project.setUserEmail(project.getUser().getEmail());

      // Check if all collaborators are valid
      List<String> collaboratorEmailList = project.getCollaboratorList().stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      if(userRepository.countByEmailIn(collaboratorEmailList) != collaboratorEmailList.size()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
      }

      // Add collaborators to the project
      List<User> collaboratorList = userRepository.findAllByEmailIn(collaboratorEmailList);
      project.setCollaboratorList(collaboratorList);

      return projectRepository.save(project);
   }

   public Project update(Project project, Project updatedProject) {
      // Update project properties
      project.setName(updatedProject.getName());
      project.setDescription(updatedProject.getDescription());

      // Check if all collaborators are valid
      List<User> updatedCollaboratorList = updatedProject.getCollaboratorList();
      List<String> updatedCollaboratorEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      if(userRepository.countByEmailIn(updatedCollaboratorEmailList) != updatedCollaboratorList.size()) {
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
      }

      // Remove share project from each target collaborators
      List<User> collaboratorList = project.getCollaboratorList();

      List<User> collaboratorRemoveList = collaboratorList.stream()
              .filter(collaborator -> !updatedCollaboratorEmailList.contains(collaborator.getEmail()))
              .collect(Collectors.toList());

      List<String> collaboratorRemoveEmailList = collaboratorRemoveList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      collaboratorRemoveList = userRepository.findAllByEmailIn(collaboratorRemoveEmailList);
      collaboratorRemoveList.forEach(collaborator -> collaborator.removeShareProject(project));

      userRepository.saveAll(collaboratorRemoveList);

      // Add share project to each target collaborators
      List<String> collaboratorEmailList = collaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      List<String> collaboratorAddEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .filter(collaboratorEmail -> !collaboratorEmailList.contains(collaboratorEmail)

                      // Missing this condition would cause sticky entry on the projects_collaborators_join table
                      && !collaboratorEmailList.contains(project.getUserEmail()))
              .collect(Collectors.toList());

      List<User> collaboratorAddList = userRepository.findAllByEmailIn(collaboratorAddEmailList);
      project.getCollaboratorList().addAll(collaboratorAddList);

      return projectRepository.save(project);
   }
}


