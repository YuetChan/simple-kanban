package com.tycorp.simplekanban.engine.domain.project.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class ProjectValidationStep extends ValidationStep<Project> {
    @Override
    public ValidationResult validate(Project project) {
        ProjectRepository projectRepository = AppContextUtils.getBean(ProjectRepository.class);
        return projectRepository.existsById(project.getId())
                ? checkNext(project)
                : ValidationResult.invalid("Project not found");
    }

    public ValidationResult validate(String id) {
        ProjectRepository projectRepository = AppContextUtils.getBean(ProjectRepository.class);
        return projectRepository.existsById(id)
                ? ValidationResult.valid()
                : ValidationResult.invalid("Project not found");
    }
}
