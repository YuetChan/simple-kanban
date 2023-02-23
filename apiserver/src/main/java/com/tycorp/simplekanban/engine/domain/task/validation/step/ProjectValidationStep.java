package com.tycorp.simplekanban.engine.domain.task.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class ProjectValidationStep extends ValidationStep<Task> {
    @Override
    public ValidationResult validate(Task task) {
        ProjectRepository projectRepository = AppContextUtils.getBean(ProjectRepository.class);

        return projectRepository.existsById(task.getTaskNode().getProjectId())
                ? checkNext(task)
                : ValidationResult.invalid("Project not found");
    }

    public ValidationResult validate(String id) {
        ProjectRepository projectRepository = AppContextUtils.getBean(ProjectRepository.class);
        return projectRepository.existsById(id)
                ? ValidationResult.valid()
                : ValidationResult.invalid("Project not found");
    }
}
