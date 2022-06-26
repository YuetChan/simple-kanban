package com.tycorp.cuptodo.story;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StoryRepository extends PagingAndSortingRepository<Story, String> {
   Page<Story> findByProjectId(String projectId, Pageable pageable);
}
