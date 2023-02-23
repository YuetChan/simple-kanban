package com.tycorp.simplekanban.plugin.repository;

import com.tycorp.simplekanban.plugin.PluginConfig;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PluginConfigRepository extends PagingAndSortingRepository<PluginConfig, String> {
}
