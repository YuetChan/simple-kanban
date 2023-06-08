package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Component
class PersistCollaboratorListToProjectStage implements PersistenceStageI<Project> {
    // Repositories
    @Autowired
    private UserRepository userRepository;

    // Project should be in transient state
    @Transactional
    @Override
    public Project process(Project project) {
        List<String> emailList = toEmailList(project.getCollaboratorList());
        List<User> collaboratorList = userRepository.findAllByEmailIn(emailList);

        project.setCollaboratorList(collaboratorList);

        return project;
    }

    public List<String> toEmailList(List<User> collaboratorList) {
        return collaboratorList.stream()
                .map(collaborator -> collaborator.getEmail())
                .collect(Collectors.toList());
    }
}
