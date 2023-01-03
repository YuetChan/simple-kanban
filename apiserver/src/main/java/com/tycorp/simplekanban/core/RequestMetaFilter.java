package com.tycorp.simplekanban.core;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
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

    // Insert request id to log message
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        LOGGER.trace("doFilterInternal(request, response, filterChain)");

        LOGGER.info("Generating requestId");

        String correlationId = request.getHeader("correlationId");
        String requestId = correlationId != null ? correlationId : UUID.randomUUID().toString();

        MDC.put("requestId", requestId);

        LOGGER.info("Request id generation done");
        try {
            filterChain.doFilter(request, response);
        } finally {
            MDC.remove("requestId");
        }
    }
}
