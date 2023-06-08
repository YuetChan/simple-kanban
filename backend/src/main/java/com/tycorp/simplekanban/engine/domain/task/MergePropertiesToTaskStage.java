package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class MergePropertiesToTaskStage implements PersistenceStageI<Task>  {
    // Repositories
    @Autowired
    private TaskRepository taskRepository;

    // Task should be in transient state
    @Transactional
    @Override
    public Task process(Task task) {
        Task orgTask = taskRepository.findById(task.getId()).get();

        orgTask.setTitle(task.getTitle());
        orgTask.setDescription(task.getDescription());
        orgTask.setNote(task.getNote());

        orgTask.setPriority(task.getPriority());
        orgTask.setSubTaskList(task.getSubTaskList());

        orgTask.setDueAt(task.getDueAt());
        orgTask.setAssigneeEmail(task.getAssigneeEmail());

        taskRepository.save(orgTask);

        return task;
    }
}
