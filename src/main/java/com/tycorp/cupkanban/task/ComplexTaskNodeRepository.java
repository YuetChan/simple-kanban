package com.tycorp.cupkanban.task;

import com.tycorp.cupkanban.task.value.Status;

public interface ComplexTaskNodeRepository {
   long countByProjectIdAndStatus(String projectId, Status status);
}
