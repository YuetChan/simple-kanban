package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectUUIDRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class PersistProjectUUIDToProjectStage implements PersistenceStageI<Project> {
    // Repositories
    @Autowired
    private ProjectUUIDRepository projectUUIDRepository;

    // Project should be in transient state
    @Transactional
    @Override
    public Project process(Project project) {
        ProjectUUID projectUUID = new ProjectUUID();
        projectUUID.setProject(project);

        project.setProjectUUID(projectUUIDRepository.save(projectUUID));

        return project;
    }
}
