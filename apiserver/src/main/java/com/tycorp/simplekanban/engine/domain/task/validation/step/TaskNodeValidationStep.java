package com.tycorp.simplekanban.engine.domain.task.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.TaskNode;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;
import org.springframework.beans.factory.annotation.Autowired;

public class TaskNodeValidationStep extends ValidationStep<Task>  {
    @Override
    public ValidationResult validate(Task task) {
        TaskRepository taskRepository = AppContextUtils.getBean(TaskRepository.class);

        TaskNode orgNode = taskRepository.findById(task.getId()).get().getTaskNode();
        TaskNode node  = task.getTaskNode();

        return orgNode.getId().equals(node.getId())
                ? ValidationResult.valid()
                : ValidationResult.invalid("Invalid task node id");
    }
}
