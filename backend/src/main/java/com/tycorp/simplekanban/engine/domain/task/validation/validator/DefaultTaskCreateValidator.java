package com.tycorp.simplekanban.engine.domain.task.validation.validator;

import com.tycorp.simplekanban.engine.domain.task.validation.step.ProjectValidationStep;
import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.validation.step.TagListCountValidationStep;
import com.tycorp.simplekanban.engine.domain.task.validation.step.SubtaskListCountValidationStep;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidatorI;
import org.springframework.stereotype.Component;

@Component
public class DefaultTaskCreateValidator implements ValidatorI<Task> {
    @Override
    public ValidationResult validate(Task task) {
        return new ProjectValidationStep()
                .linkWith(new TagListCountValidationStep())
                .linkWith(new SubtaskListCountValidationStep())
                .validate(task);
    }
}
