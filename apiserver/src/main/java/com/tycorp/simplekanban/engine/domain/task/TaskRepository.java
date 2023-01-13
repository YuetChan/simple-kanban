package com.tycorp.simplekanban.engine.domain.task;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends PagingAndSortingRepository<Task, String>, ComplexTaskRepository {
}
