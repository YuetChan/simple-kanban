package com.tycorp.simplekanban.engine.domain.task;

import com.google.gson.annotations.Expose;
import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.domain.project.Project;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class TaskNode {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "task_nodes_project_join",
           joinColumns = @JoinColumn(name = "node_id"),
           inverseJoinColumns = @JoinColumn(name = "project_id")
   )
   private Project project;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "task_node_task_join",
           joinColumns = @JoinColumn(name = "node_id"),
           inverseJoinColumns = @JoinColumn(name = "task_id")
   )
   private Task task;

   @Expose
   @Column(name = "head_uuid")
   private String headUUID;
   @Expose
   @Column(name = "tail_uuid")
   private String tailUUID;

   @Expose
   @Transient
   private String projectId;

   @Expose
   @Column(name = "status")
   @Enumerated(EnumType.STRING)
   private Status status = Status.TODO;

}
