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
                                  long startAt, long endAt,
                                  List<String> tags,
                                  Pageable pageable) {
      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Task> cqTask = cBuilder.createQuery(Task.class);
      Root rTask = cqTask.from(Task.class);

      Subquery<Long> cqSubTask = cqTask.subquery(Long.class);
      Root rSubTask = cqSubTask.from(Task.class);

      ListJoin<Task, Tag> task_tags_join = rSubTask.join(Task_.tagList, JoinType.LEFT);

      Predicate matchProjectId = cBuilder.equal(rSubTask.get(Task_.projectId), projectId);
      Predicate matchTags = tags == null
              ? cBuilder.conjunction()
              : task_tags_join.get(Tag_.name).in(tags);

      Predicate matchAll = cBuilder.and(matchProjectId, matchTags);

      Expression<Long> taskCount = cBuilder.count(rSubTask.get(Task_.id));
      Expression<String> id = rSubTask.get(Task_.id);

      cqSubTask.select(rSubTask.get(Task_.id))
              .where(matchAll)
              .groupBy(id)
              .having(cBuilder.equal(taskCount, tags == null ? 0 : tags.size()));
      cqTask.select(rTask)
              .where(cBuilder.in(rTask.get(Task_.id)).value(cqSubTask));

      rTask.fetch(Task_.tagList, JoinType.LEFT);

      List<Task> matchedTasks = em.createQuery(cqTask)
              .setFirstResult(pageable.getPageNumber())
              .setMaxResults(pageable.getPageSize())
              .getResultList();

      return new PageImpl(matchedTasks);
   }
}
