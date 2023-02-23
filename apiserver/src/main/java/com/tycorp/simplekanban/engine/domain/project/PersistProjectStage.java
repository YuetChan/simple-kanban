package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class PersistProjectStage implements PersistenceStageI<Project> {
    // Repositories
    @Autowired
    private ProjectRepository projectRepository;

    // Project should be in transient state
    @Transactional
    @Override
    public Project process(Project project) {
        return projectRepository.save(project);
    }
}
