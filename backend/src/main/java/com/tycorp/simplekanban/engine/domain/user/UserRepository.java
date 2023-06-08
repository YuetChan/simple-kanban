package com.tycorp.simplekanban.engine.domain.user;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, String>  {
   Optional<User> findByEmail(String email);
   List<User> findAllByEmailIn(List<String> userEmailList);

   int countByEmailIn(List<String> userEmailList);
}
