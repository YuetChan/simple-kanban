package com.tycorp.simplekanban.engine.domain.task.repository;

import com.tycorp.simplekanban.engine.domain.task.Task;
import com.tycorp.simplekanban.engine.domain.task.repository.ComplexTaskRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepository extends PagingAndSortingRepository<Task, String>, ComplexTaskRepository {
}
