package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.Tag_;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.List;

public class ComplexTaskRepositoryImpl implements ComplexTaskRepository {
   @PersistenceContext
   protected EntityManager em;

   public Page<Task> findByParams(String projectId,
                                  Long startAt, Long endAt,
                                  List<String> tagList,
                                  Pageable pageable) {
      if(tagList != null && tagList.size() == 0) {
         tagList = null;
      }

      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Task> cqTask = cBuilder.createQuery(Task.class);
      Root rTask = cqTask.from(Task.class);

      Subquery<Long> cqSubTask = cqTask.subquery(Long.class);
      Root rSubTask = cqSubTask.from(Task.class);

      ListJoin<Task, Tag> task_tags_join = rSubTask.join(Task_.tagList, JoinType.LEFT);

      Predicate matchProjectId = cBuilder.equal(rSubTask.get(Task_.projectId), projectId);

      Predicate matchStartAt = startAt == null
              ? cBuilder.conjunction()
              : cBuilder.greaterThanOrEqualTo(rSubTask.get(Task_.createdAt), startAt);
      Predicate matchEndAt = endAt == null
              ? cBuilder.conjunction()
              : cBuilder.lessThanOrEqualTo(rSubTask.get(Task_.createdAt), endAt);

      Predicate matchTags = tagList == null
              ? cBuilder.conjunction()
              : task_tags_join.get(Tag_.name).in(tagList);

      Predicate matchAll = cBuilder.and(matchProjectId, matchTags, matchStartAt, matchEndAt);

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
