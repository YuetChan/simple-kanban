package com.tycorp.simplekanban.engine.domain.project.exception;

public class ProjectNotExistedException extends Exception {
    public ProjectNotExistedException(String errMsg) {
        super(errMsg);
    }
}
