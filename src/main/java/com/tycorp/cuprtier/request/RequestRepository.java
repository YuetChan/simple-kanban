package com.tycorp.cuprtier.request;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RequestRepository extends PagingAndSortingRepository<Request, String> {
   Page<Request> findAllByUnlocked(boolean unlocked, Pageable pageable);
   long countByCreatedAtLessThanAndUnlocked(long createdAt, boolean unlocked);
}
