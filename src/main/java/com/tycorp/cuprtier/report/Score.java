package com.tycorp.cuprtier.report;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.Setter;
import javax.persistence.Embeddable;

@Getter
@Setter
@Embeddable
public class Score {
   @Expose
   private long entrepreneurship;
   @Expose
   private long physique;
   @Expose
   private long nonUtilCraftmanship;
   @Expose
   private long utilCraftmanship;

   @Expose
   private long bonus;
}
