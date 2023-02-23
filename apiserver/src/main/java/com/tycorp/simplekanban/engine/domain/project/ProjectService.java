package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectCreateValidator;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectDeleteValidator;
import com.tycorp.simplekanban.engine.domain.project.validation.validator.DefaultProjectUpdateValidator;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.pattern.observer.TaskServiceObserver;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistencePipeline;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.plugin.PluginConfig;
import com.tycorp.simplekanban.plugin.repository.PluginConfigRepository;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectService {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class);

   // Observers
   private List<TaskServiceObserver> observers = new ArrayList<>();

   // Repositories
   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private PluginConfigRepository pluginConfigRepository;

   // Persistence pipeline stages
   @Autowired
   private PersistUserToProjectStage persistUserToProjectStage;

   @Autowired
   private PersistCollaboratorListToProjectStage persistCollaboratorListToProjectStage;

   @Autowired
   private PersistProjectStage persistProjectStage;

   @Autowired
   private PersistProjectUUIDToProjectStage persistProjectUuidToProjectStage;

   @Autowired
   private MergeCollaboratorListToProjectStage mergeCollaboratorListToProjectStage;

   @Autowired
   private MergePropertiesToProjectStage mergePropertiesToProjectStage;

   // Global config cache
   @Resource(name = "configCache")
   private Map<String, Object> configCache;

   // Default validators
   @Autowired
   private DefaultProjectCreateValidator defaultProjectCreateValidator;

   @Autowired
   private DefaultProjectUpdateValidator defaultProjectUpdateValidator;

   @Autowired
   private DefaultProjectDeleteValidator defaultProjectDeleteValidator;

   // Project needed to be in transient state
   public Project create(CreateModel model) {
      // Creates pojo project from model
      Project project = new Project();

      project.setName(model.name);
      project.setDescription(model.description);

      project.setUserEmail(model.userEmail);

      // Validates the project
      ValidationResult validationResult = defaultProjectCreateValidator.validate(project);

      // Runs pipeline on valid project
      if(validationResult.isValid()) {
         return new PersistencePipeline<>(
                 persistUserToProjectStage,
                 persistProjectStage,
                 persistProjectUuidToProjectStage)
                 .process(project);
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   // Updated project needed to be in transient state
   public void update(UpdateModel model) {
      // Creates pojo project from model
      Project updatedProject = new Project();

      updatedProject.setId(model.id);

      updatedProject.setName(model.name);
      updatedProject.setDescription(model.description);

      // Allows pipeline stage to access collaboratorEmailToSecretMap since configCache is globally accessible
      this.configCache.put("collaboratorEmailToSecretMap", model.collaboratorEmailToSecretMap);

      List<User> updatedCollaboratorList = ((Map<String, String>)configCache.get("collaboratorEmailToSecretMap"))
              .keySet()
              .stream()
              .map(email -> {
                 User user = new User();
                 user.setEmail(email);
                 return user;
              })
              .collect(Collectors.toList());

      updatedProject.setCollaboratorList(updatedCollaboratorList);

      // Validates updated project
      ValidationResult validationResult = defaultProjectUpdateValidator.validate(updatedProject);

      // Runs pipeline on valid updated project
      if(validationResult.isValid()) {
         new PersistencePipeline<>(
                 mergePropertiesToProjectStage,
                 mergeCollaboratorListToProjectStage)
                 .process(updatedProject);

         return;
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   public void addPlugin(String id, PluginConfig config) {
      Optional<Project> projectMaybe = projectRepository.findById(id);

      if(projectMaybe.isPresent()) {
         Project project = projectMaybe.get();

         config.setProject(project);
         pluginConfigRepository.save(config);
      }
   }

   public void removePlugin(String configId) {
      Optional<PluginConfig> pluginConfigMaybe = pluginConfigRepository.findById(configId);

      if(pluginConfigMaybe.isPresent()) {
         PluginConfig config = pluginConfigMaybe.get();
         config.setActive(false);

         pluginConfigRepository.save(config);
      }
   }

   public void delete(String id) {
      ValidationResult validationResult = defaultProjectDeleteValidator.validate(id);

      if(validationResult.isValid()) {
         Project project = projectRepository.findById(id).get();
         project.setActive(false);

         projectRepository.save(project);

         return;
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   @AllArgsConstructor
   public static class CreateModel {
      private String name;
      private String description;

      private String userEmail;
   }

   @AllArgsConstructor
   public static class UpdateModel {
      private String id;
      private String name;
      private String description;

      private Map<String, String> collaboratorEmailToSecretMap;
   }

}


