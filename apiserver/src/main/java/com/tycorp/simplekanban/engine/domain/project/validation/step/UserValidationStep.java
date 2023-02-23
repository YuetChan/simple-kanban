package com.tycorp.simplekanban.engine.domain.project.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

public class UserValidationStep extends ValidationStep<Project> {
    @Override
    public ValidationResult validate(Project project) {
        UserRepository userRepository = AppContextUtils.getBean(UserRepository.class);
        return userRepository.findByEmail(project.getUserEmail()).isPresent()
                ? checkNext(project)
                : ValidationResult.invalid("User not found");
    }
}
