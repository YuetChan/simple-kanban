package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserPersistenceStage implements PersistenceStageI<Project> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Project process(Project project) {
        project.setUser(userRepository.findByEmail(project.getUserEmail()).get());
        return project;
    }
}
