package com.tycorp.cuptodo.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplexTaskRepository {
   // tagList, startAt, endAt are optional
   // tagList of size 0 or null for matching all tags
   Page<Task> findByParams(String project,
                           Long startAt, Long endAt,
                           List<String> tagList,
                           Pageable pageable);
}
