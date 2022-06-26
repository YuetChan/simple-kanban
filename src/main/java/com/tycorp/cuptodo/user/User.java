package com.tycorp.cuptodo.user;

import com.google.gson.annotations.Expose;
import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.user.value.Permissible;
import com.tycorp.cuptodo.user.value.Permission;
import com.tycorp.cuptodo.user.value.Permit;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class User {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Column(name = "email")
   private String email;
   @Expose
   @Column(name = "name")
   private String name;

   @Column(name = "role")
   private String role = "user";

   @Expose
   @ElementCollection(fetch = FetchType.LAZY)
   @CollectionTable(name = "permissions_user_join", joinColumns = @JoinColumn(name = "user_id"))
   @AttributeOverrides({
           @AttributeOverride(name = "objectId", column = @Column(name = "object_id")),
           @AttributeOverride(name = "permit", column = @Column(name = "permit")),
           @AttributeOverride(name = "permissible", column = @Column(name = "permissible"))
   })
   private List<Permission> permissionList =  new ArrayList<>();

   @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Project> projectList = new ArrayList<>();

   @ManyToMany(mappedBy = "collaboratorList", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Project> shareProjectList = new ArrayList<>();

   public User(String email, String role) {
      this.email = email;
      this.name = "user" + email.hashCode();
      this.role = role;
   }

   public void removeShareProject(Project shareProject) {
      getShareProjectList().remove(shareProject);
      shareProject.getCollaboratorList().remove(this);
   }

//   public boolean hasPermitByPermissbleAndObjectId(Permit permit, Permissible permissible, String projectId) {
//      return getPermissionList().stream().filter(permission -> {
//         if(permission.getPermissible().equals(permissible) && permission.getProjectId().equals(projectId)) {
//            return permission.getPermit().equals(permit);
//         }
//
//         return false;
//      }).collect(Collectors.toList()).size() == 1;
//   }
}
