package com.tycorp.simplekanban.project;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectUUIDRepository extends CrudRepository<ProjectUUID, String> {
   Optional<ProjectUUID> findByUuid1(String uuid1);
   Optional<ProjectUUID> findByUuid2(String uuid2);
   Optional<ProjectUUID> findByUuid3(String uuid3);
   Optional<ProjectUUID> findByUuid4(String uuid4);
   Optional<ProjectUUID> findByUuid5(String uuid5);
   Optional<ProjectUUID> findByUuid6(String uuid6);
   Optional<ProjectUUID> findByUuid7(String uuid7);
   Optional<ProjectUUID> findByUuid8(String uuid8);
}
