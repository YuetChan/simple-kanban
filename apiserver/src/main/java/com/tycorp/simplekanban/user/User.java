package com.tycorp.simplekanban.user;

import com.google.gson.annotations.Expose;
import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.user.value.Permission;
import com.tycorp.simplekanban.user_secret.UserSecret;
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

   @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private UserSecret userSecret;

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

}
