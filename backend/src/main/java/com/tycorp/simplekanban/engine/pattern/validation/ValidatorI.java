package com.tycorp.simplekanban.engine.pattern.validation;

public interface ValidatorI<T> {
    ValidationResult validate(T toValidate);
}
