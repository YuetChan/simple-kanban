package com.tycorp.cupkanban.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends PagingAndSortingRepository<Project, String>, ComplexProjectRepository {
   Page<Project> findByUserEmail(String userEmail, Pageable pageable);
}
