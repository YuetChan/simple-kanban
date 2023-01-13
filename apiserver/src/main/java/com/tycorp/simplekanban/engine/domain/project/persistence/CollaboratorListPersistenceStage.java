package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CollaboratorListPersistenceStage implements PersistenceStageI<Project> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public Project process(Project project) {
        List<String> emailList = toEmailList(project.getCollaboratorList());
        List<User> collaboratorList = userRepository.findAllByEmailIn(emailList);

        project.setCollaboratorList(collaboratorList);

        return project;
    }

    private List<String> toEmailList(List<User> collaboratorList) {
        return collaboratorList.stream()
                .map(collaborator -> collaborator.getEmail())
                .collect(Collectors.toList());
    }
}
