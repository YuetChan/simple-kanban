package com.tycorp.cuptodo.task;

import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.project.Project_;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.story.Story_;
import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.tag.Tag_;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.List;

public class ComplexTaskRepositoryImpl implements ComplexTaskRepository {
   @PersistenceContext
   protected EntityManager em;

   public Page<Task> findByParams(String projectId,
                                  String storyId,
                                  Long startAt, Long endAt,
                                  List<String> tagList,
                                  Pageable pageable) {
      if(projectId == null || pageable == null) {
         throw new IllegalArgumentException();
      }

      if(tagList != null && tagList.size() == 0) {
         tagList = null;
      }

      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Task> cqTask = cBuilder.createQuery(Task.class);
      Root rTask = cqTask.from(Task.class);

      Subquery<Long> cqSubTask = cqTask.subquery(Long.class);
      Root rSubTask = cqSubTask.from(Task.class);

      ListJoin<Task, Tag> task_tags_join = rSubTask.join(Task_.tagList, JoinType.LEFT);
      Join<Task, Project> tasks_project_join = rSubTask.join(Task_.project, JoinType.LEFT);
      Join<Task, Story> tasks_story_join = rSubTask.join(Task_.story, JoinType.LEFT);

      Predicate matchProjectId = cBuilder.equal(tasks_project_join.get(Project_.ID), projectId);
      Predicate matchStoryId = storyId == null
              ? cBuilder.conjunction()
              : cBuilder.and(cBuilder.equal(tasks_story_join.get(Story_.ID), storyId),
              cBuilder.equal(tasks_story_join.get(Story_.ACTIVE), true));

      Predicate matchStartAt = startAt == null
              ? cBuilder.conjunction()
              : cBuilder.greaterThanOrEqualTo(rSubTask.get(Task_.createdAt), startAt);
      Predicate matchEndAt = endAt == null
              ? cBuilder.conjunction()
              : cBuilder.lessThanOrEqualTo(rSubTask.get(Task_.createdAt), endAt);

      Predicate matchTags = tagList == null
              ? cBuilder.conjunction()
              : task_tags_join.get(Tag_.name).in(tagList);

      Predicate matchAll = cBuilder.and(matchProjectId, matchStoryId, matchTags, matchStartAt, matchEndAt);

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
