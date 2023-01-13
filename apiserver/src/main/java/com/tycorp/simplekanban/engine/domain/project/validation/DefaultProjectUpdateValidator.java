package com.tycorp.simplekanban.engine.domain.project.validation;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class DefaultProjectUpdateValidator implements ValidatorI<Project>{
    @Autowired
    private CollaboratorListValidationStep collaboratorListValidationStep;

    @Autowired
    private CollaboratorListCountValidationStep collaboratorListCountValidationStep;

    @Autowired
    private CollaboratorListModifyValidationStep collaboratorListModifyValidationStep;

    @Override
    public ValidationResult validate(Project project) {
        return collaboratorListValidationStep
                .linkWith(collaboratorListCountValidationStep)
                .linkWith(collaboratorListModifyValidationStep)
                .validate(project);
    }
}
