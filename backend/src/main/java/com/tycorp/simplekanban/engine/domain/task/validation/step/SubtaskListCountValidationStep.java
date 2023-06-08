package com.tycorp.simplekanban.engine.domain.task.validation.step;

import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class SubtaskListCountValidationStep extends ValidationStep<Task> {
    @Override
    public ValidationResult validate(Task task) {
        return task.getSubTaskList().size() <= 20
                ? checkNext(task)
                : ValidationResult.invalid("Subtask list count exceeds maximum");
    }
}
