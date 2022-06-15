package com.tycorp.cuptodo.user.value;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Permission {
   @Expose
   private String projectId;
   @Expose
   private Permit permit;
}
