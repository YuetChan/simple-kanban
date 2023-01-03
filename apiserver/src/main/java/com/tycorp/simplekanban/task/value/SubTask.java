package com.tycorp.simplekanban.task.value;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class SubTask {
   @Expose
   private String title;
   @Expose
   private String description;
   @Expose
   private boolean completed;

   @Expose
   private long completedAt = -1;
   @Expose
   private long createdAt = System.currentTimeMillis();
}
