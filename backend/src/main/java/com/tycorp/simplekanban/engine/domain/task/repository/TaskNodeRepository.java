package com.tycorp.simplekanban.engine.domain.task.repository;

import com.tycorp.simplekanban.engine.domain.task.TaskNode;
import com.tycorp.simplekanban.engine.domain.task.repository.ComplexTaskNodeRepository;
import com.tycorp.simplekanban.engine.domain.task.value.Status;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Optional;

@Repository
public interface TaskNodeRepository extends CrudRepository<TaskNode, String> {
   Optional<TaskNode> findByHeadUUID(String headUUID);
   Optional<TaskNode> findByTailUUID(String tailUUID);

   long countByProjectIdAndStatus(String projectId, Status status);
}
