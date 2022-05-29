package com.tycorp.cuprtier.user;

import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface UserRepository extends PagingAndSortingRepository<User, String>  {
   Optional<User> findByEmail(String email);
}
