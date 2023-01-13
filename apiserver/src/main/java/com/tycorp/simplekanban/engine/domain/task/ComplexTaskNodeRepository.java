package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.value.Status;

public interface ComplexTaskNodeRepository {
   long countByProjectIdAndStatus(String projectId, Status status);
}
