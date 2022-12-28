package com.tycorp.cupkanban.task;

import com.google.gson.annotations.Expose;
import com.tycorp.cupkanban.project.Project;
import com.tycorp.cupkanban.tag.Tag;
import com.tycorp.cupkanban.task.value.Priority;
import com.tycorp.cupkanban.task.value.SubTask;
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
public class Task {
   @Expose
   @Id
   @GeneratedValue(generator = "uuid2")
   @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
   @Column(name = "id", columnDefinition = "VARCHAR(255)")
   private String id;

   @Expose
   @Column(name = "title")
   private String title = "";

   @Expose
   @Column(name = "description")
   private String description = "";

   @Expose
   @Column(name = "note")
   private String note = "";

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "tasks_project_join",
           joinColumns = @JoinColumn(name = "task_id"),
           inverseJoinColumns = @JoinColumn(name = "project_id")
   )
   private Project project;

   @Expose
   @ElementCollection(fetch = FetchType.LAZY)
   @CollectionTable(name = "sub_tasks_task_join", joinColumns = @JoinColumn(name = "task_id"))
   @Column(name = "sub_tasks")
   @AttributeOverrides({
           @AttributeOverride(name = "title", column = @Column(name = "title")),
           @AttributeOverride(name = "description", column = @Column(name = "description")),
           @AttributeOverride(name = "completed", column = @Column(name = "completed")),
           @AttributeOverride(name = "completedAt", column = @Column(name = "completed_at")),
           @AttributeOverride(name = "createdAt", column = @Column(name = "created_at"))
   })
   private List<SubTask> subTaskList = new ArrayList<>();

   @Expose
   @ManyToMany(mappedBy = "taskList", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Tag> tagList = new ArrayList<>();

   @Expose
   @Column(name = "priority")
   @Enumerated(EnumType.STRING)
   private Priority priority = Priority.LOW;

   @Expose
   @Column(name = "assignee_email")
   private String assigneeEmail;

   @Expose
   @Column(name = "due_at")
   private long dueAt = -1;

   @Expose
   @Column(name = "created_at")
   private long createdAt = System.currentTimeMillis();

   @Expose
   @OneToOne(mappedBy = "task", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
   private TaskNode taskNode;

   @Column(name = "active")
   private boolean active = true;


   public void removeTags(List<Tag> tagList) {
      // for loop to avoid comodification error when tagList is getTagList()
      for(int i  = 0; i < tagList.size(); i++) {
         removeTag(tagList.get(i));
      }
   }

   public void removeTag(Tag tag) {
      getTagList().remove(tag);
      tag.getTaskList().remove(this);
   }
}
