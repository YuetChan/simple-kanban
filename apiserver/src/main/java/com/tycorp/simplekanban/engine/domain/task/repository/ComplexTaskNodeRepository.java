package com.tycorp.simplekanban.engine.domain.task.repository;

import com.tycorp.simplekanban.engine.domain.task.value.Status;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplexTaskNodeRepository {
   long countByProjectIdAndStatus(String projectId, Status status);
}
