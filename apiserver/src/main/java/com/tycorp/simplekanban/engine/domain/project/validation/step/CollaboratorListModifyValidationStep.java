package com.tycorp.simplekanban.engine.domain.project.validation.step;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class CollaboratorListModifyValidationStep extends ValidationStep<Project> {
    @Override
    public ValidationResult validate(Project project) {
        Map<String, String> emailToSecretMap = (Map<String, String>) ((Map<String, Object>)AppContextUtils.getBean("configCache", Map.class)).get("collaboratorEmailToSecretMap");

        List<String> emailListFromMap = new ArrayList<>();
        for (Map.Entry<String,String> entry : emailToSecretMap.entrySet()) {
            emailListFromMap.add(entry.getKey());
        }

        return checkIfSecretsAreValid(
                project.getId(),
                emailListFromMap,
                emailToSecretMap)
                ? checkNext(project)
                : ValidationResult.invalid(
                        "Some of the secrets are invalid or " +
                                "CollaboratorEmailToSecretMap is invalid");
    }

    private boolean checkIfSecretsAreValid(String projectId,
                                           List<String> emailListFromMap,
                                           Map<String, String> emailToSecretMap) {
        UserRepository userRepository = AppContextUtils.getBean(UserRepository.class);
        ProjectRepository projectRepository = AppContextUtils.getBean(ProjectRepository.class);

        List<String> orgCollaboratorEmailList = projectRepository.findById(projectId).get().getCollaboratorList()
                .stream()
                .map(user -> user.getEmail())
                .collect(Collectors.toList());

        List<String> addedEmailList = emailListFromMap
                .stream()
                .filter(email -> !orgCollaboratorEmailList.contains(email))
                .collect(Collectors.toList());

        for(var collaborator : userRepository.findAllByEmailIn(addedEmailList)) {
            if(emailToSecretMap.get(collaborator.getEmail()) != null) {
                String secret = collaborator.getUserSecret().getSecret();

                if (!secret.equals(emailToSecretMap.get(collaborator.getEmail()))) {
                    return false;
                }
            }else {
                return false;
            }
        }

        return true;
    }
}