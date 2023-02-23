package com.tycorp.simplekanban.engine.domain.project.validation.step;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;
import org.springframework.beans.factory.annotation.Value;

public class CollaboratorListCountValidationStep extends ValidationStep<Project> {
    @Value("${project.max-collaborator-count}")
    private int MAX_COLLABORATOR_COUNT = 20;

    @Override
    public ValidationResult validate(Project project) {
        return project.getCollaboratorList().size() <= MAX_COLLABORATOR_COUNT
                ? checkNext(project)
                : ValidationResult.invalid("Collaborator list count exceed maximum");
    }
}
