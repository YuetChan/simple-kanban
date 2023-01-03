package com.tycorp.simplekanban.project;

import com.google.gson.annotations.Expose;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.UUID;

@Getter
@Setter
@Entity
@Table(name = "project_uuid")
public class ProjectUUID {
   // this class contains uuids for different util purposes
   // one of the use case is to prevent uuids circulation when ordering tasks
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @OneToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "project_uuids_project_join",
           joinColumns = @JoinColumn(name = "project_uuid_id"),
           inverseJoinColumns = @JoinColumn(name = "project_id")
   )
   private Project project;

   @Expose
   @Column(name = "uuid1")
   private String uuid1 = UUID.randomUUID().toString();
   @Expose
   @Column(name = "uuid2")
   private String uuid2 = UUID.randomUUID().toString();

   @Expose
   @Column(name = "uuid3")
   private String uuid3 = UUID.randomUUID().toString();
   @Expose
   @Column(name = "uuid4")
   private String uuid4 = UUID.randomUUID().toString();

   @Expose
   @Column(name = "uuid5")
   private String uuid5 = UUID.randomUUID().toString();
   @Expose
   @Column(name = "uuid6")
   private String uuid6 = UUID.randomUUID().toString();

   @Expose
   @Column(name = "uuid7")
   private String uuid7 = UUID.randomUUID().toString();
   @Expose
   @Column(name = "uuid8")
   private String uuid8 = UUID.randomUUID().toString();
}
