package com.tycorp.simplekanban.engine.domain.project.validation;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class CollaboratorListValidationStep extends ValidationStep<Project> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public ValidationResult validate(Project project) {
        List<String> emailList = toEmailList(project.getCollaboratorList());
        return userRepository.countByEmailIn(toEmailList(project.getCollaboratorList())) == emailList.size()
                ? checkNext(project)
                : ValidationResult.invalid("Some of the collaborators are invalid");
    }

    private List<String> toEmailList(List<User> collaboratorList) {
        return collaboratorList.stream()
                .map(collaborator -> collaborator.getEmail())
                .collect(Collectors.toList());
    }
}
