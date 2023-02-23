package com.tycorp.simplekanban.engine.pattern.observer;

import com.tycorp.simplekanban.engine.domain.task.TaskService;

public abstract class TaskServiceObserver {
    public void preUpdate(TaskService.UpdateModel model) { };
    public void postUpdate(TaskService.UpdateModel model) { };

    public void preDelete(String id) { };
    public void postDelete(String id) { };
}
