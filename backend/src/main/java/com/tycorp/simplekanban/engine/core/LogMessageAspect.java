package com.tycorp.simplekanban.engine.core;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class LogMessageAspect {
    private static final Logger LOGGER = LoggerFactory.getLogger(LogMessageAspect.class);

    @Pointcut("within(com.tycorp.simplekanban.engine.domain.project..*) " +
            "|| within(com.tycorp.simplekanban.engine.domain.task..*)" +
            "|| within(com.tycorp.simplekanban.engine.domain.tag..*)" +
            "|| within(com.tycorp.simplekanban.engine.domain.user..*)")
    private void selectAll(){ }

    @Before("selectAll()")
    public void beforeSelectAll(JoinPoint joinPoint) {
        String[] signatureArr = joinPoint.getSignature().toString().split("\\.");
        String classAndMethodStr = signatureArr[signatureArr.length - 2] + "." + signatureArr[signatureArr.length - 1];

        LOGGER.trace("Enter " + classAndMethodStr);
    }
}
