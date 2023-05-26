package com.tycorp.simplekanban.engine.domain.crud_event;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/crud-events")
public class CrudEventController {
    @Autowired
    private CrudEventService crudEventService;

    @GetMapping("/value/{key}")
    public Object getValue(@PathVariable String key) {
        return crudEventService.getValue(key);
    }

    @PutMapping("/value/{key}/{value}")
    public void setValue(@PathVariable String key, @PathVariable String value) {
        crudEventService.setValue(key, value);
    }
}
