package com.tycorp.simplekanban.engine.domain.project.validation;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserValidationStep extends ValidationStep<Project> {
    @Autowired
    private UserRepository userRepository;

    @Override
    public ValidationResult validate(Project project) {
        return userRepository.findByEmail(project.getUserEmail()).isPresent()
                ? checkNext(project)
                : ValidationResult.invalid("User not found");
    }
}
