package com.tycorp.simplekanban.engine.domain.project.validation;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationStep;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CollaboratorListModifyValidationStep extends ValidationStep<Project> {
    @Autowired
    private UserRepository userRepository;

    @Resource(name = "configCache")
    private Map<String, Object> configCache;

    @Override
    public ValidationResult validate(Project project) {
        var emailToSecretMap = (Map<String, String>)configCache.get("CollaboratorEmailToSecretMap");

        List<String> emailListFromMap = new ArrayList<>();
        for (Map.Entry<String,String> entry : emailToSecretMap.entrySet()) {
            emailListFromMap.add(entry.getKey());
        }

        return checkModificationInvariance(
                toEmailList(project.getCollaboratorList()),
                emailListFromMap,
                emailToSecretMap)
                ? checkNext(project)
                : ValidationResult.invalid("Some of the secrets are invalid");
    }

    private boolean checkModificationInvariance(List<String> collaboratorEmailList,
                                                List<String> emailListFromMap,
                                                Map<String, String> emailToSecreMap) {
        return checkIfEmailToSecretMapIsValid(collaboratorEmailList, emailListFromMap)
                && checkIfSecretsAreValid(emailListFromMap, emailToSecreMap);
    }

    private boolean checkIfEmailToSecretMapIsValid(List<String> collaboratorEmailList,
                                                   List<String> emailListFromMap) {
        return collaboratorEmailList.containsAll(emailListFromMap);
    }

    private boolean checkIfSecretsAreValid(List<String> emailListFromMap,
                                           Map<String, String> emailToSecretMap) {
        for(var collaborator : userRepository.findAllByEmailIn(emailListFromMap)) {
            if(emailToSecretMap.get(collaborator.getEmail()) != null) {
                String secret = collaborator.getUserSecret().getSecret();

                if (!secret.equals(emailToSecretMap.get(collaborator.getEmail()))) {
                    return false;
                }
            }
        }

        return true;
    }

    private List<String> toEmailList(List<User> collaboratorList) {
        return collaboratorList.stream()
                .map(collaborator -> collaborator.getEmail())
                .collect(Collectors.toList());
    }
}
