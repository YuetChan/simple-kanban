package com.tycorp.cuprtier.report;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;

@Getter
@Setter
@Embeddable
public class Analysis {
   @Expose
   private String entrepreneurship;
   @Expose
   private String physique;
   @Expose
   private String nonUtilCraftmanship;
   @Expose
   private String utilCraftmanship;


   @Expose
   private String bonus;
}
