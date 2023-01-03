package com.tycorp.simplekanban.tag;

import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.project.Project_;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.List;

public class ComplexTagRepositoryImpl implements ComplexTagRepository {
   private static final Logger LOGGER = LoggerFactory.getLogger(ComplexTagRepositoryImpl.class);

   @PersistenceContext
   protected EntityManager em;

   @Override
   public Page<Tag> findByProjectIdAndNameLike(String projectId, String name, Pageable pageable) {
      LOGGER.trace("Enter findByProjectIdAndNameLike(projectId, name, pageable)");

      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Tag> cqTag = cBuilder.createQuery(Tag.class);
      Root rTag = cqTag.from(Tag.class);

      Predicate matchNameLike = cBuilder.like(rTag.get(Tag_.name), name);

      Join<Tag, Project> tags_project_join = rTag.join(Tag_.project, JoinType.LEFT);
      Predicate matchProjectId = cBuilder.equal(tags_project_join.get(Project_.id), projectId);

      cqTag.select(rTag)
              .where(cBuilder.and(matchNameLike, matchProjectId));

      int totalElements = em.createQuery(cqTag).getResultList().size();

      List<Tag> matchedTags = em.createQuery(cqTag)
              .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
              .setMaxResults(pageable.getPageSize())
              .getResultList();

      return new PageImpl(matchedTags, pageable, totalElements);
   }

   @Override
   public Page<Tag> findByProjectIdAndNameIn(String projectId, List<String> nameList, Pageable pageable) {
      if(projectId == null) {
         throw new IllegalArgumentException();
      }

      if(nameList == null) {
         throw new IllegalArgumentException();
      }

      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Tag> cqTag = cBuilder.createQuery(Tag.class);
      Root rTag = cqTag.from(Tag.class);

      Predicate matchedNameIn = rTag.get(Tag_.name).in(nameList);

      Join<Tag, Project> tags_project_join = rTag.join(Tag_.project, JoinType.LEFT);
      Predicate matchProjectId = cBuilder.equal(tags_project_join.get(Project_.id), projectId);

      cqTag.select(rTag)
              .where(cBuilder.and(matchedNameIn, matchProjectId));

      int totalElements = em.createQuery(cqTag).getResultList().size();

      List<Tag> matchedTags = em.createQuery(cqTag)
              .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
              .setMaxResults(pageable.getPageSize())
              .getResultList();

      return new PageImpl(matchedTags, pageable, totalElements);
   }
}
