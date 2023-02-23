package com.tycorp.simplekanban.engine.pattern.persistence;

public interface PersistenceStageI<T> {
    T process(T toProcess) ;
}
