package com.tycorp.simplekanban.engine.domain.project;

import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.UserRepository;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistenceStageI;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Component
class MergeCollaboratorListToProjectStage implements PersistenceStageI<Project>  {
    // Repositories
    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // Project should be in transient state
    @Transactional
    @Override
    public Project process(Project project) {
        // Obtain project in managed state
        Project orgProject = projectRepository.findById(project.getId()).get();

        List<User> orgCollaboratorList = orgProject.getCollaboratorList();
        List<String> orgCollaboratorEmailList = toEmailList(orgCollaboratorList);

        List<User> updatedCollaboratorList = project.getCollaboratorList();
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

        return project;
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
