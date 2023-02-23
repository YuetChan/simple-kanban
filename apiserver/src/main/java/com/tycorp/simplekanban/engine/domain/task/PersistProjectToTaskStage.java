package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;

@Component
class PersistProjectToTaskStage implements PersistenceStageI<Task> {
    // Repositories
    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private ProjectRepository projectRepository;

    // Task should be in transient state
    @Transactional
    @Override
    public Task process(Task task) {
        Task orgTask = taskRepository.findById(task.getId()).get();
        orgTask.setProject(projectRepository.findById(task.getTaskNode().getProjectId()).get());

        taskRepository.save(orgTask);

        return task;
    }
}
