package com.tycorp.simplekanban.tag;

import com.google.gson.annotations.Expose;
import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.task.Task;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Where(clause = "active=true")
public class Tag {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Column(name = "name")
   private String name = "";

   @Expose
   private String projectId;

   @ManyToMany()
   @JoinTable(
           name = "tags_tasks_join",
           joinColumns = @JoinColumn(name = "tag_id"),
           inverseJoinColumns = @JoinColumn(name = "task_id")
   )
   private List<Task> taskList = new ArrayList<>();

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "tags_project_join",
           joinColumns = @JoinColumn(name = "tag_id"),
           inverseJoinColumns = @JoinColumn(name = "project_id")
   )
   private Project project;

   @Column(name = "active")
   private boolean active = true;
}
