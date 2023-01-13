package com.tycorp.simplekanban.engine.domain.tag;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends PagingAndSortingRepository<Tag, String>, ComplexTagRepository { }
