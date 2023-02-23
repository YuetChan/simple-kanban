package com.tycorp.simplekanban.plugin;

import com.tycorp.simplekanban.engine.domain.task.TaskService;
import com.tycorp.simplekanban.engine.pattern.observer.TaskServiceObserver;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component("PostUpdateGmailNotificationPlugin")
public class PostUpdateGmailNotificationPlugin extends TaskServiceObserver {
    // Loggers
    private static final Logger LOGGER = LoggerFactory.getLogger(PostUpdateGmailNotificationPlugin.class);

    @Override
    public void postUpdate(TaskService.UpdateModel model) {
        LOGGER.debug("Testing");
    }
}
