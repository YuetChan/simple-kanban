package com.tycorp.cuptodo.tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TagRepository extends PagingAndSortingRepository<Tag, String> {
   List<Tag> findByProjectIdAndNameIn(String projectId, List<String> names);
   Page<Tag> findByNameLike(String name, Pageable pageable);
}
