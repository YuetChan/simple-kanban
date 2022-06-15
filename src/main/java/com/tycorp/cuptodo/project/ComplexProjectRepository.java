package com.tycorp.cuptodo.project;

import com.tycorp.cuptodo.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplexProjectRepository {
   // collaborator is required
   Page<Project> findProjectListByCollaborator(User collaborator, Pageable pageable);
}
