package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.ProjectUUID;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectUUIDRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UUIDPersistenceStage implements PersistenceStageI<Project> {
    @Autowired
    private ProjectUUIDRepository projectUUIDRepository;

    @Override
    public Project process(Project project) {
        ProjectUUID projectUUID = new ProjectUUID();
        projectUUID.setProject(project);

        project.setProjectUUID(projectUUIDRepository.save(projectUUID));

        return project;
    }
}
