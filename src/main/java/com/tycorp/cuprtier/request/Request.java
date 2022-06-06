package com.tycorp.cuprtier.request;

import com.google.gson.annotations.Expose;
import com.tycorp.cuprtier.report.Report;
import com.tycorp.cuprtier.user.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Request {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Column(name = "income_situation")
   private String incomeSituation;
   @Expose
   @Column(name = "skill_set")
   private String skillSet;
   @Expose
   @Column(name = "physique")
   private String physique;

   @Expose
   @Column(name = "bonus")
   private String bonus;

   @Expose
   @Column(name = "unlocked")
   private boolean unlocked = false;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "requests_user_join",
           joinColumns = @JoinColumn(name = "request_id"),
           inverseJoinColumns = @JoinColumn(name = "user_id")
   )
   private User user;

   @OneToOne(mappedBy = "request", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private Report report;

   @Expose
   private int queuePos;

   @Expose
   @Column(name = "created_at")
   private long createdAt;

   @Expose
   @Column(name = "unlocked_at")
   private Long unlockedAt;
}
