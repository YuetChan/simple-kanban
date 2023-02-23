package com.tycorp.simplekanban.engine.domain.task.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class TaskValidationStep extends ValidationStep<Task> {
    @Override
    public ValidationResult validate(Task task) {
        TaskRepository taskRepository = AppContextUtils.getBean(TaskRepository.class);
        return taskRepository.existsById(task.getId())
                ? checkNext(task)
                : ValidationResult.invalid("Task not found");
    }

    public ValidationResult validate(String id) {
        TaskRepository taskRepository = AppContextUtils.getBean(TaskRepository.class);
        return taskRepository.existsById(id)
                ? ValidationResult.valid()
                : ValidationResult.invalid("Task not found");
    }
}
