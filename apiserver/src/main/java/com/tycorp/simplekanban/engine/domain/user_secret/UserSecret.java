package com.tycorp.simplekanban.engine.domain.user_secret;

import com.google.gson.annotations.Expose;
import com.tycorp.simplekanban.engine.domain.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class UserSecret {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Column(name = "secret")
   private String secret;

   @OneToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "secret_user_join",
           joinColumns = @JoinColumn(name = "secret_id"),
           inverseJoinColumns = @JoinColumn(name = "user_id")
   )
   private User user;

   public UserSecret(String secret) {
      this.secret = secret;
   }

}
