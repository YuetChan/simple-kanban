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
   private Permissible permissible;
   @Expose
   private Permit permit;

   public Permission(String projectId, String permissible, String permit) {
      this.projectId = projectId;
      this.permissible = Permissible.valueOf(permissible);
      this.permit = Permit.valueOf(permit);
   }

   public boolean equals(Permission permission) {
      return this.getProjectId().equals(permission.projectId)
              && this.getPermissible().equals(permission.getPermissible())
              && this.getPermit().equals(permission.getPermit());
   }
}
