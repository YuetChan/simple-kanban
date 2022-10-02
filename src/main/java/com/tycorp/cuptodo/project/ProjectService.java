package com.tycorp.cuptodo.project;

import com.tycorp.cuptodo.user.User;
import com.tycorp.cuptodo.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class);

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private ProjectUUIDRepository projectUUIDRepository;
   @Autowired
   private UserRepository userRepository;

   public Project create(Project project) {
      LOGGER.trace("Enter create(project)");

      if(!checkIfUserForEmailExists(project.getUserEmail())) {
         LOGGER.debug("User not found by email");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User invalid");
      }

      if(!checkIfCollaboratorListCountValid(project)) {
         LOGGER.debug("Collaborator list count exceeds 20");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CollaboratorList count exceeds maximum");
      }

      if(!checkIfCollaboratorListValid(project)) {
         LOGGER.debug("Some of the collaborators are invalid");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Collaboratorlist invalid");
      }

      LOGGER.debug("Attach user, collaborator list and UUID to project");
      attachUserToProject(project);
      attachCollaboratorListToProject(project);

      project = projectRepository.save(project);

      attachNewProjectUUIDToProject(project);

      return project;
   }

   public Project update(Project originalProject, Project updatedProject,
                         Map<String, String> collaboratorEmailSecretMap) {
      LOGGER.trace("Enter update(originalProject, updatedProject, collaboratorSecretMap)");

      if(!checkIfCollaboratorListCountValid(updatedProject)) {
         LOGGER.debug("Collaborator count exceeds 20");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CollaboratorList count exceeds maximum");
      }

      if(!checkIfCollaboratorListValid(updatedProject)) {
         LOGGER.debug("Some of the collaborators are invalid");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CollaboratorList invalid");
      }

      // Update project properties
      LOGGER.debug("Update project properties");
      originalProject.setName(updatedProject.getName());
      originalProject.setDescription(updatedProject.getDescription());

      LOGGER.debug("Update collaborator list for project");
      updateCollaboratorListForProject(originalProject, updatedProject, collaboratorEmailSecretMap);

      return originalProject;
   }

   public void delete(Project project) {
      LOGGER.trace("Enter delete(project)");
      project.setActive(false);
      projectRepository.save(project);
   }

   public boolean checkIfUserForEmailExists(String email) {
      LOGGER.trace("Enter checkIfUserForEmailExists(email)");
      return userRepository.findByEmail(email).isPresent();
   }

   public boolean checkIfCollaboratorListCountValid(Project project) {
      LOGGER.trace("Enter checkIfCollaboratorListCountValid(project)");
      return project.getCollaboratorList().size() <= 20;
   }

   public boolean checkIfCollaboratorListValid(Project project) {
      LOGGER.trace("Enter checkIfCollaboratorListValid(project)");
      List<String> collaboratorEmailList = getCollaboratorEmailList(project.getCollaboratorList());
      return userRepository.countByEmailIn(collaboratorEmailList) == collaboratorEmailList.size();
   }

   public void attachUserToProject(Project project) {
      LOGGER.trace("Enter attachUserToProject(project)");
      project.setUser(userRepository.findByEmail(project.getUserEmail()).get());
   }

   public void attachCollaboratorListToProject(Project project) {
      LOGGER.trace("Enter attachCollaboratorListToProject(project)");

      List<String> collaboratorEmailList = getCollaboratorEmailList(project.getCollaboratorList());
      List<User> collaboratorList = userRepository.findAllByEmailIn(collaboratorEmailList);

      project.setCollaboratorList(collaboratorList);
   }

   public void attachNewProjectUUIDToProject(Project project) {
      LOGGER.trace("Enter attachNewProjectUUIDToProject(project)");

      ProjectUUID projectUUID = new ProjectUUID();
      projectUUID.setProject(project);

      projectUUIDRepository.save(projectUUID);
   }

   private List<String> getCollaboratorEmailList(List<User> collaboratorList) {
      LOGGER.trace("Enter getCollaboratorEmailList(collaboratorList)");
      return collaboratorList
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());
   }

   public void updateCollaboratorListForProject(Project originalProject, Project updatedProject,
                                                 Map<String, String> collaboratorEmailSecretMap) {
      LOGGER.trace("Enter updateCollaboratorListFromProject(project)");

      List<User> updatedCollaboratorList = updatedProject.getCollaboratorList();
      List<String> updatedCollaboratorEmailList = updatedCollaboratorList.stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      // Remove share project from each collaborators
      LOGGER.debug("Remove share projects from each target collaborators");
      List<User> originalCollaboratorList = originalProject.getCollaboratorList();

      List<User> collaboratorToRemoveList = originalCollaboratorList
              .stream()
              .filter(collaborator -> !updatedCollaboratorEmailList.contains(collaborator.getEmail()))
              .collect(Collectors.toList());
      List<String> collaboratorToRemoveEmailList = collaboratorToRemoveList
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      collaboratorToRemoveList = userRepository.findAllByEmailIn(collaboratorToRemoveEmailList);
      for(var collaborator : collaboratorToRemoveList) {
         collaborator.removeShareProject(originalProject);
      }

      userRepository.saveAll(collaboratorToRemoveList);

      // Add share project to each collaborators
      LOGGER.debug("Add share projects to each target collaborators");
      List<String> originalCollaboratorEmailList = originalCollaboratorList
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .collect(Collectors.toList());

      List<String> collaboratorToAddEmailList = updatedCollaboratorList
              .stream()
              .map(collaborator -> collaborator.getEmail())
              .filter(collaboratorEmail -> !originalCollaboratorEmailList.contains(collaboratorEmail)

                      // Missing this condition would cause sticky entry on the projects_collaborators_join table
                      && !originalCollaboratorEmailList.contains(originalProject.getUserEmail()))
              .collect(Collectors.toList());

      List<User> collaboratorToAddList = userRepository.findAllByEmailIn(collaboratorToAddEmailList);

      if(!checkIfSecretsAreValid(collaboratorToAddList, collaboratorEmailSecretMap)) {
         LOGGER.debug("Some of the secrets are invalid");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Secrets invalid");
      }

      originalProject.getCollaboratorList().addAll(collaboratorToAddList);
      projectRepository.save(originalProject);
   }

   public boolean checkIfSecretsAreValid(List<User> userList,
                                          Map<String, String> userEmailSecretMap) {
      LOGGER.trace("Enter checkIfSecretsAreValid(userList, userEmailSecretMap)");
      for(var collaborator: userList) {
         if (!collaborator.getUserSecret()
                 .getSecret()
                 .equals(userEmailSecretMap.get(collaborator.getEmail()))) {
            return false;
         }
      }

      return true;
   }
}


