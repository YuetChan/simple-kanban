package com.tycorp.simplekanban.engine.domain.project.repository;

import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.project.Project_;
import com.tycorp.simplekanban.engine.domain.user.User;
import com.tycorp.simplekanban.engine.domain.user.User_;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.query.QueryUtils;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.criteria.*;
import java.util.List;

public class ComplexProjectRepositoryImpl implements ComplexProjectRepository {
   @PersistenceContext
   protected EntityManager em;
   
   @Override
   public Page<Project> findProjectListByCollaborator(User collaborator, Pageable pageable) {
      CriteriaBuilder cBuilder = em.getCriteriaBuilder();

      CriteriaQuery<Project> cqProject = cBuilder.createQuery(Project.class);
      Root rProject = cqProject.from(Project.class);

      ListJoin<Project, User> projects_collaborators_join = rProject.join(Project_.collaboratorList, JoinType.LEFT);
      cqProject.select(rProject)
              .where(cBuilder.equal(projects_collaborators_join.get(User_.email), collaborator.getEmail()))
              .orderBy(QueryUtils.toOrders(pageable.getSort(), rProject, cBuilder));

      int totalElements = em.createQuery(cqProject).getResultList().size();

      List<Project> matchedProjects = em.createQuery(cqProject)
              .setFirstResult(pageable.getPageNumber() * pageable.getPageSize())
              .setMaxResults(pageable.getPageSize())
              .getResultList();

      return new PageImpl(matchedProjects, pageable, totalElements);
   }
}
