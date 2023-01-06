package com.tycorp.simplekanban.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.UUID;

@Component
public class RequestMetaFilter extends OncePerRequestFilter {
    private static final Logger LOGGER = LoggerFactory.getLogger(RequestMetaFilter.class);

    @Value("${correlation.alias}")
    private String correlationAlias;

    // Insert request id to each log messages
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        LOGGER.trace("Enter doFilterInternal(request, response, filterChain)");

        String correlationId = request.getHeader(correlationAlias);
        String requestId = correlationId != null ? correlationId : UUID.randomUUID().toString();

        MDC.put("requestId", requestId);

        LOGGER.debug("Request id generation done");

        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("requestId");
        }
    }
}
