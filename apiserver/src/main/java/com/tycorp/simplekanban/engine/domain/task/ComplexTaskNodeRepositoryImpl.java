package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.project.Project_;
import com.tycorp.simplekanban.task.TaskNode_;
import com.tycorp.simplekanban.task.Task_;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;

public class ComplexTaskNodeRepositoryImpl implements ComplexTaskNodeRepository {
   @PersistenceContext
   protected EntityManager em;

   @Override
   public long countByProjectIdAndStatus(String projectId, Status status) {
      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<TaskNode> cqTaskNode = cBuilder.createQuery(TaskNode.class);
      Root rTaskNode = cqTaskNode.from(TaskNode.class);

      Join<TaskNode, Project> task_nodes_project_join = rTaskNode.join(TaskNode_.project, JoinType.LEFT);

      Predicate matchProjectId = cBuilder.equal(task_nodes_project_join.get(Project_.ID), projectId);
      Predicate matchStatus = cBuilder.equal(rTaskNode.get(TaskNode_.status), status);

      Join<TaskNode, Task> task_nodes_task_join = rTaskNode.join(TaskNode_.task, JoinType.LEFT);
      Predicate matchTask = cBuilder.equal(task_nodes_task_join.get(Task_.active), true);

      cqTaskNode.select(rTaskNode)
              .where(cBuilder.and(matchProjectId, matchStatus, matchTask));

      int totalElements = em.createQuery(cqTaskNode).getResultList().size();

      return totalElements;
   }
}
