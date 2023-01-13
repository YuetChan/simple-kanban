package com.tycorp.simplekanban.engine.domain.task;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TaskNodeRepository extends CrudRepository<TaskNode, String>, ComplexTaskNodeRepository {
   Optional<TaskNode> findByHeadUUID(String headUUID);
   Optional<TaskNode> findByTailUUID(String tailUUID);
}
