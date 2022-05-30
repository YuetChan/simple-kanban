package com.tycorp.cuprtier.report;

import com.google.gson.annotations.Expose;
import com.tycorp.cuprtier.request.Request;
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
public class Report {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Embedded
   @AttributeOverrides({
           @AttributeOverride(name = "entrepreneurship", column = @Column(name = "entrepreneurship_score")),
           @AttributeOverride(name = "physique", column = @Column(name = "physique_score")),
           @AttributeOverride(name = "utilCraftmanship", column = @Column(name = "util_craftmanship_score")),
           @AttributeOverride(name = "nonUtilCraftmanship", column = @Column(name = "non_util_craftmanship_score")),
           @AttributeOverride(name = "bonus", column = @Column(name = "bonus_score"))
   })
   private Score score;

   @Expose
   private long finalScore;

   @Expose
   @Embedded
   @AttributeOverrides({
           @AttributeOverride(name = "entrepreneurship", column = @Column(name = "entrepreneurship_analysis")),
           @AttributeOverride(name = "physique", column = @Column(name = "physique_analysis")),
           @AttributeOverride(name = "utilCraftmanship", column = @Column(name = "util_craftmanship_analysis")),
           @AttributeOverride(name = "nonUtilCraftmanship", column = @Column(name = "non_util_craftmanship_analysis")),
           @AttributeOverride(name = "bonus", column = @Column(name = "bonus_analysis"))
   })
   private Analysis analysis;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "reports_user_join",
           joinColumns = @JoinColumn(name = "report_id"),
           inverseJoinColumns = @JoinColumn(name = "user_id")
   )
   private User user;

   @OneToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "report_request_join",
           joinColumns = @JoinColumn(name = "report_id"),
           inverseJoinColumns = @JoinColumn(name = "request_id")
   )
   private Request request;

   @Expose
   @Column(name = "unlocked")
   private boolean unlocked = false;

   @Expose
   @Column(name = "updated_at")
   private long updatedAt;

   public Report(Request request) {
      this.request = request;
      this.user = request.getUser();

      this.score = new Score();
      this.analysis = new Analysis();
      this.updatedAt = request.getCreatedAt();
   }

   public void calculateFinalScore() {
      long finalScore = (long) (score.getEntrepreneurship() * 0.2
              + score.getPhysique() * 0.4
              + score.getNonUtilCraftmanship() * 0.1
              + score.getUtilCraftmanship() * 0.2
              + score.getBonus() * 0.1);

     this.finalScore = finalScore >= 100 ? 100 : finalScore;
   };

   public void censorReport() {
      analysis = null;
   }

}
