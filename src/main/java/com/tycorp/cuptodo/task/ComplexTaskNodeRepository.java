package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.task.value.Status;

public interface ComplexTaskNodeRepository {
   long countByProjectIdAndStatus(String projectId, Status status);
}
