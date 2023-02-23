package com.tycorp.simplekanban.engine.pattern.validation;

import lombok.Value;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Value
public class ValidationResult {
    private static final Logger LOGGER = LoggerFactory.getLogger(ValidationResult.class);

    private final boolean isValid;
    private final String errorMsg;

    public static ValidationResult valid() {
        return new ValidationResult(true, null);
    }

    public static ValidationResult invalid(String errorMsg) {
        LOGGER.debug(errorMsg);
        return new ValidationResult(false, errorMsg);
    }

    public boolean notValid() {
        return !isValid;
    }
}