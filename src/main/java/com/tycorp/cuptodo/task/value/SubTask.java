package com.tycorp.cuptodo.task.value;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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
