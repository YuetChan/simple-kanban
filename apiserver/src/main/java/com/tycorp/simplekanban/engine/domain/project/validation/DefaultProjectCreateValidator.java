package com.tycorp.simplekanban.engine.domain.project.validation;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DefaultProjectCreateValidator implements ValidatorI<Project> {
    @Autowired
    private UserValidationStep userValidationStep;

    @Autowired
    private CollaboratorListValidationStep collaboratorListValidationStep;

    @Autowired
    private CollaboratorListCountValidationStep collaboratorListCountValidationStep;

    @Override
    public ValidationResult validate(Project project) {
        return userValidationStep
                .linkWith(collaboratorListValidationStep)
                .linkWith(collaboratorListCountValidationStep)
                .validate(project);
    }
}
