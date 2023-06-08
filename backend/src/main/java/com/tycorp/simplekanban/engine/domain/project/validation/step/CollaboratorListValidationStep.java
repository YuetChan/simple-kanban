package com.tycorp.simplekanban.engine.domain.project.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

import java.util.List;
import java.util.stream.Collectors;

public class CollaboratorListValidationStep extends ValidationStep<Project> {
    @Override
    public ValidationResult validate(Project project) {
        UserRepository userRepository = AppContextUtils.getBean(UserRepository.class);

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
