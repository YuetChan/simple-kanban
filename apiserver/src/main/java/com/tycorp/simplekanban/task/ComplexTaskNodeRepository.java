package com.tycorp.simplekanban.task;

import com.tycorp.simplekanban.task.value.Status;

public interface ComplexTaskNodeRepository {
   long countByProjectIdAndStatus(String projectId, Status status);
}
