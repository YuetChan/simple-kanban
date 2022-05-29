package com.tycorp.cuprtier.request;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends PagingAndSortingRepository<Request, String> {
   long countByCreatedAtLessThanAndUnlocked(long createdAt, boolean unlocked);
}
