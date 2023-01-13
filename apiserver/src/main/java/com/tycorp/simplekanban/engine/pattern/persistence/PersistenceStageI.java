package com.tycorp.simplekanban.engine.pattern.persistence;

import com.tycorp.simplekanban.engine.domain.project.exception.CollaboratorEmailToSecretMismatchException;
import com.tycorp.simplekanban.engine.domain.project.exception.ProjectNotExistedException;

public interface PersistenceStageI<T> {
    T process(T toProcess) throws ProjectNotExistedException, CollaboratorEmailToSecretMismatchException;
}
