package com.tycorp.cuptodo.project;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ProjectPermissionDto {
   @Expose
   private String userEmail;
   @Expose
   private String permissible;
   @Expose
   private String permit;
}
