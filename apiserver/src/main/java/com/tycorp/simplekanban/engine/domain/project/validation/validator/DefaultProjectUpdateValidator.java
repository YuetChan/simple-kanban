package com.tycorp.simplekanban.engine.domain.project.validation.validator;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.validation.step.CollaboratorListCountValidationStep;
import com.tycorp.simplekanban.engine.domain.project.validation.step.CollaboratorListModifyValidationStep;
import com.tycorp.simplekanban.engine.domain.project.validation.step.CollaboratorListValidationStep;
import com.tycorp.simplekanban.engine.domain.project.validation.step.ProjectValidationStep;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.stereotype.Component;

@Component
public class DefaultProjectUpdateValidator implements ValidatorI<Project> {
    @Override
    public ValidationResult validate(Project project) {
        return new ProjectValidationStep()
                .linkWith(new CollaboratorListModifyValidationStep())
                .linkWith(new CollaboratorListValidationStep())
                .linkWith(new CollaboratorListCountValidationStep())
                .validate(project);
    }
}
