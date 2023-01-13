package com.tycorp.simplekanban.engine.domain.tag;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ComplexTagRepository {
   Page<Tag> findByProjectIdAndNameLike(String projectId, String name, Pageable pageable);
   Page<Tag> findByProjectIdAndNameIn(String projectId, List<String> nameList, Pageable pageable);
}
