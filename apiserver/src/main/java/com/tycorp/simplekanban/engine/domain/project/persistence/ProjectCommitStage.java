package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class ProjectCommitStage implements PersistenceStageI<Project> {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project process(Project project) {
        return projectRepository.save(project);
    }
}
