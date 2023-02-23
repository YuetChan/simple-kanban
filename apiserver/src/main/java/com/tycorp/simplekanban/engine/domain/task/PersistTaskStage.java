package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class PersistTaskStage implements PersistenceStageI<Task> {
    // Repositories
    @Autowired
    private TaskRepository taskRepository;

    // Task should be in transient state
    @Transactional
    @Override
    public Task process(Task task) {
        Task tmpTask = new Task();

        tmpTask.setTitle(task.getTitle());
        tmpTask.setDescription(task.getDescription());
        tmpTask.setNote(task.getNote());

        tmpTask.setAssigneeEmail(task.getAssigneeEmail());
        tmpTask.setPriority(task.getPriority());
        tmpTask.setDueAt(task.getDueAt());

        Task orgTask = taskRepository.save(tmpTask);
        task.setId(orgTask.getId());

        return task;
    }
}
