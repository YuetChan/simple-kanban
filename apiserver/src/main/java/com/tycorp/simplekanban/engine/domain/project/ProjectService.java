package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.persistence.*;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectUUIDRepository;
import com.tycorp.simplekanban.engine.domain.project.validation.DefaultProjectCreateValidator;
import com.tycorp.simplekanban.engine.domain.project.validation.DefaultProjectUpdateValidator;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistencePipeline;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProjectService {
   private static final Logger LOGGER = LoggerFactory.getLogger(ProjectService.class);

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private UserPersistenceStage userPersistenceStage;
   @Autowired
   private CollaboratorListPersistenceStage collaboratorListPersistenceStage;
   @Autowired
   private ProjectCommitStage projectCommitStage;
   @Autowired
   private UUIDPersistenceStage uuidPersistenceStage;

   @Autowired
   private CollaboratorListUpdateStage collaboratorListUpdateStage;
   @Autowired
   private PropertiesUpdateStage propertiesUpdateStage;

   @Resource(name = "configCache")
   private Map<String, Object> configCache;

   @Autowired
   private DefaultProjectCreateValidator defaultProjectCreateValidator;

   @Autowired
   private DefaultProjectUpdateValidator defaultProjectUpdateValidator;

   public Project create(Project project) {
      ValidationResult validationResult = defaultProjectCreateValidator.validate(project);

      if(validationResult.isValid()) {
         return new PersistencePipeline<>(
                 userPersistenceStage,
                 collaboratorListPersistenceStage,
                 projectCommitStage,
                 uuidPersistenceStage)
                 .process(project);
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   public Project update(Project updatedProject, Map<String, String> collaboratorEmailToSecretMap) {
      configCache.put("collaboratorEmailToSecretMap", collaboratorEmailToSecretMap);

      ValidationResult validationResult = defaultProjectUpdateValidator.validate(updatedProject);


      if(projectRepository.findById(updatedProject.getId()).isPresent()) {
         return new PersistencePipeline<>(
                 collaboratorListUpdateStage,
                 propertiesUpdateStage)
                 .process(updatedProject);
      }

      LOGGER.debug("Project: [{}] is not found", updatedProject.getId());

      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found");
   }

   public void delete(Project project) {
      project.setActive(false);
      projectRepository.save(project);
   }

}


