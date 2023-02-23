package com.tycorp.simplekanban.engine.domain.task.validation.validator;

import com.tycorp.simplekanban.engine.domain.task.validation.step.TaskValidationStep;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.stereotype.Component;

@Component
public class DefaultTaskGetValidator implements ValidatorI<String> {
    @Override
    public ValidationResult validate(String id) {
        return new TaskValidationStep().validate(id);
    }
}
