package com.tycorp.simplekanban.engine.domain.project.repository;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplexProjectRepository {
   // collaborator is required
   Page<Project> findProjectListByCollaborator(User collaborator, Pageable pageable);
   Page<Project> findProjectListByCollaboratorNot(User collaborator, Pageable pageable);
}
