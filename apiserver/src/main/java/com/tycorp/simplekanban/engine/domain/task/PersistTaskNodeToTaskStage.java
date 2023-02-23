package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.TaskNode;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskNodeRepository;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class PersistTaskNodeToTaskStage implements PersistenceStageI<Task> {
    // Repositories
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private TaskNodeRepository taskNodeRepository;

    // Task should be in transient state
    @Transactional
    @Override
    public Task process(Task task) {
        Task orgTask = taskRepository.findById(task.getId()).get();

        TaskNode node = task.getTaskNode();

        node.setTask(orgTask);
        node.setProject(orgTask.getProject());

        taskNodeRepository.save(node);

        return task;
    }
}
