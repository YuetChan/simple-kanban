package com.tycorp.simplekanban.task;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplexTaskRepository {
   Page<Task> findByParams(String projectId,
                           boolean archived,
                           List<String> tagList,
                           Pageable pageable);
}
