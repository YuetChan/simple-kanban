package com.tycorp.cuptodo.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplexTaskRepository {
   Page<Task> findByParams(String project,
                           long startAt, long endAt,
                           List<String> tags,
                           Pageable pageable);
}
