package com.tycorp.simplekanban.engine.domain.project.exception;

public class CollaboratorEmailToSecretMismatchException extends Exception {
    public CollaboratorEmailToSecretMismatchException(String errMsg) {
        super(errMsg);
    }
}
