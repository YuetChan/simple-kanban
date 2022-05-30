package com.tycorp.cuprtier.user;

import com.google.gson.annotations.Expose;
import com.tycorp.cuprtier.report.Report;
import com.tycorp.cuprtier.request.Request;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
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
   @Embedded
   @AttributeOverrides({
           @AttributeOverride(name = "lastUploadedAt", column = @Column(name = "last_uploaded_at")),
           @AttributeOverride(name = "count", column = @Column(name = "count"))
   })
   private UploadQuota uploadQuota;

   @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Request> request;

   @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Report> report;

   public User(String email, String role, UploadQuota uploadQuota) {
      this.email = email;
      this.name = "user" + email.hashCode();
      this.role = role;
      this.uploadQuota = uploadQuota;
   }

   public void lockQuota() {
      this.uploadQuota.setFull(true);
   }
}
