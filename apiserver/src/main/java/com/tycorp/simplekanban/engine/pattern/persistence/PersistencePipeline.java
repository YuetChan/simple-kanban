package com.tycorp.simplekanban.engine.pattern.persistence;

import java.util.Arrays;
import java.util.List;

public class PersistencePipeline<T> {
    private final List<PersistenceStageI<T>> stages;

    public PersistencePipeline(PersistenceStageI<T> ...stages) {
        this.stages = Arrays.asList(stages);
    }

    public T process(T toProcess) {
        T processed = toProcess;
        for (PersistenceStageI<T> stage : stages) {
            processed = stage.process(processed);
        }

        return processed;
    }
}
