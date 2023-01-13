package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.project.Project_;
import com.tycorp.simplekanban.engine.domain.tag.Tag;
import com.tycorp.simplekanban.tag.Tag_;
import com.tycorp.simplekanban.task.TaskNode_;
import com.tycorp.simplekanban.task.Task_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.List;

public class ComplexTaskRepositoryImpl implements ComplexTaskRepository {
   private static final Logger LOGGER = LoggerFactory.getLogger(ComplexTaskRepositoryImpl.class);

   @PersistenceContext
   protected EntityManager em;

   public Page<Task> findByParams(String projectId,
                                  boolean archived,
                                  List<String> tagList,
                                  Pageable pageable) {
      if(projectId == null || pageable == null) {
         throw new IllegalArgumentException();
      }

      if(tagList == null) {
         throw new IllegalArgumentException();
      }

      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Task> cqTask = cBuilder.createQuery(Task.class);
      Root rTask = cqTask.from(Task.class);

      Subquery<Long> cqSubTask = cqTask.subquery(Long.class);
      Root rSubTask = cqSubTask.from(Task.class);

      ListJoin<Task, Tag> task_tags_join = rSubTask.join(Task_.tagList, JoinType.LEFT);
      Join<Task, Project> tasks_project_join = rSubTask.join(Task_.project, JoinType.LEFT);

      Predicate matchProjectId = cBuilder.equal(tasks_project_join.get(Project_.ID), projectId);

      Join<Task, TaskNode> task_task_node_join = rSubTask.join(Task_.taskNode, JoinType.LEFT);
      Predicate matchArchived = cBuilder.notEqual(task_task_node_join.get(TaskNode_.status), Status.ARCHIVE);

//      Predicate matchStartAt = startAt == null
//              ? cBuilder.conjunction()
//              : cBuilder.greaterThanOrEqualTo(rSubTask.get(Task_.createdAt), startAt);
//      Predicate matchEndAt = endAt == null
//              ? cBuilder.conjunction()
//              : cBuilder.lessThanOrEqualTo(rSubTask.get(Task_.createdAt), endAt);

      Predicate matchTags = tagList.size() == 0
              ? cBuilder.conjunction()
              : cBuilder.and(task_tags_join.get(Tag_.name).in(tagList),
              cBuilder.equal(task_tags_join.get(Tag_.ACTIVE), true));

      Predicate matchAll = cBuilder.and(matchProjectId, matchTags, matchArchived);

      Expression<Long> taskCount = cBuilder.count(rSubTask.get(Task_.id));
      Expression<String> id = rSubTask.get(Task_.id);

      cqSubTask.select(rSubTask.get(Task_.id))
              .where(matchAll)
              .groupBy(id)
              .having(cBuilder.greaterThanOrEqualTo(taskCount, tagList == null ? 0l : tagList.size()));

      cqTask.select(rTask)
              .where(cBuilder.in(rTask.get(Task_.id)).value(cqSubTask));

      rTask.fetch(Task_.tagList, JoinType.LEFT);

      int totalElements = em.createQuery(cqTask).getResultList().size();

      List<Task> matchedTasks = em.createQuery(cqTask)
              .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
              .setMaxResults(pageable.getPageSize())
              .getResultList();

      return new PageImpl(matchedTasks, pageable, totalElements);
   }

}
