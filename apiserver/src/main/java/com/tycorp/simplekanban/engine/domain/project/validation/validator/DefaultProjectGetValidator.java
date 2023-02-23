package com.tycorp.simplekanban.engine.domain.project.validation.validator;

import com.tycorp.simplekanban.engine.domain.project.validation.step.ProjectValidationStep;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.stereotype.Component;

@Component
public class DefaultProjectGetValidator implements ValidatorI<String> {
    @Override
    public ValidationResult validate(String id) {
        return new ProjectValidationStep().validate(id);
    }
}
