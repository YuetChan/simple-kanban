package com.tycorp.simplekanban.engine.domain.task.validation.step;

import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class TagListCountValidationStep extends ValidationStep<Task> {
    @Override
    public ValidationResult validate(Task task) {
        return task.getTagList().size() <= 20
                ? checkNext(task)
                : ValidationResult.invalid("Tag list count exceeds maximum");
    }
}
