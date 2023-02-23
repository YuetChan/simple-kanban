package com.tycorp.simplekanban.engine.core.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
@ComponentScan("com.tycorp")
public class AppConfig {
    @Bean(name="configCache")
    public Map<String, Object> configCache() {
        final Map<String, Object> cache = new HashMap<>();
        return cache;
    }
}
