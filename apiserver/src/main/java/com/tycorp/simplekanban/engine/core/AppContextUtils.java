package com.tycorp.simplekanban.engine.core;

import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class AppContextUtils implements ApplicationContextAware {
    private static ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext appContext) {
        context = appContext;
    }

    public static <T> T getBean(Class<T> beanClass) {
        return context.getBean(beanClass);
    }

    // Get bean by name
    public static <T> T getBean(String name, Class<T> beanClass) {
        return (T)context.getBean(name);
    }

    public static <T> Map<String, T> getBeanOfType(Class<T> abstractBeanClass) {
        return context.getBeansOfType(abstractBeanClass);
    }
}
