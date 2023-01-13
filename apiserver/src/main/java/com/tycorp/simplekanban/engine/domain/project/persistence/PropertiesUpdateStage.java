package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;

public class PropertiesUpdateStage implements PersistenceStageI<Project> {
    @Autowired
    private ProjectRepository projectRepository;

    @Override
    public Project process(Project updatedProject) {
        // Obtain project in managed state
        Project orgProject = projectRepository.findById(updatedProject.getId()).get();

        orgProject.setName(updatedProject.getName());
        orgProject.setDescription(updatedProject.getDescription());

        return updatedProject;
    }
}
