package com.tycorp.cupkanban.project;

import com.tycorp.cupkanban.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplexProjectRepository {
   // collaborator is required
   Page<Project> findProjectListByCollaborator(User collaborator, Pageable pageable);
}
