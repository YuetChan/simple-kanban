package com.tycorp.cuprtier.user;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.Embeddable;

@Getter
@Setter
@Embeddable
public class UploadQuota {
   @Expose
   private long lastUploadedAt;
   @Expose
   private boolean full;
}
