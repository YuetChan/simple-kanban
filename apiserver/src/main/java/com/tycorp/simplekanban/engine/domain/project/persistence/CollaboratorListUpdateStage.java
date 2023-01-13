package com.tycorp.simplekanban.engine.domain.project.persistence;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.exception.CollaboratorEmailToSecretMismatchException;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Component
public class CollaboratorListUpdateStage implements PersistenceStageI<Project>  {
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    @Resource(name = "configCache")
    private Map<String, Object> configCache;

    // Updated project is assumed to be in transient state
    @Override
    public Project process(Project updatedProject) throws CollaboratorEmailToSecretMismatchException {
        // Obtain project in managed state
        Project orgProject = projectRepository.findById(updatedProject.getId()).get();

        List<User> orgCollaboratorList = orgProject.getCollaboratorList();
        List<String> orgCollaboratorEmailList = toEmailList(orgCollaboratorList);

        List<User> updatedCollaboratorList = updatedProject.getCollaboratorList();
        List<String> updatedCollaboratorEmailList = toEmailList(updatedCollaboratorList);

        // Remove share project from each collaborators
        List<User> collaboratorToRemoveList = orgCollaboratorList.stream()
                .filter(collaborator -> !updatedCollaboratorEmailList.contains(collaborator.getEmail()))
                .collect(Collectors.toList());

        removeShareProjectFromEachCollaborators(collaboratorToRemoveList, orgProject);

        // Add share project to each collaborators
        List<String> emailToAddList = updatedCollaboratorEmailList.stream()
                .filter(email -> !orgCollaboratorEmailList.contains(email)
                        // A hack to fix sticky entry issue on projects_collaborators_join
                        && !orgCollaboratorEmailList.contains(orgProject.getUserEmail()))

                .collect(Collectors.toList());

        addShareProjectToEachCollaborators(userRepository.findAllByEmailIn(emailToAddList), orgProject);

        return updatedProject;
    }

    private void removeShareProjectFromEachCollaborators(List<User> collaboratorList, Project shareProject) {
        List<User> managedCollaboratorList = userRepository.findAllByEmailIn(toEmailList(collaboratorList));
        for(var collaborator : managedCollaboratorList) {
            collaborator.removeShareProject(shareProject);
        }

        userRepository.saveAll(managedCollaboratorList);
    }

    private void addShareProjectToEachCollaborators(List<User> collaboratorList, Project shareProject) {
        shareProject.getCollaboratorList().addAll(collaboratorList);
        projectRepository.save(shareProject);
    }

    private List<String> toEmailList(List<User> collaboratorList) {
        return collaboratorList.stream()
                .map(collaborator -> collaborator.getEmail())
                .collect(Collectors.toList());
    }
}
