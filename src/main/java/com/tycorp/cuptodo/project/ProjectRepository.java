package com.tycorp.cuptodo.project;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends PagingAndSortingRepository<Project, String> {
   Page<Project> findByUserEmail(String userEmail, Pageable pageable);
}
