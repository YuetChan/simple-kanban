package com.tycorp.cuptodo.story;

import com.google.gson.annotations.Expose;
import com.tycorp.cuptodo.project.Project;
import com.tycorp.cuptodo.task.Task;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Where(clause = "active=true")
public class Story {
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

   @ManyToOne
   @JoinTable(
           name = "storys_project_join",
           joinColumns = @JoinColumn(name = "story_id"),
           inverseJoinColumns = @JoinColumn(name = "project_id")
   )
   private Project project;

   @OneToMany(mappedBy = "story", fetch = FetchType.LAZY, cascade= {CascadeType.PERSIST, CascadeType.REFRESH})
   private List<Task> taskList = new ArrayList<>();

   @Expose
   @Column(name = "due_at")
   private long dueAt = -1;

   @Expose
   @Column(name = "created_at")
   private long createdAt = System.currentTimeMillis();

   @Column(name = "active")
   private boolean active = true;

   public void removeTasks(List<Task> taskList) {
      // for loop to avoid comodification error when taskList is getTaskList()
      for(int i = 0; i < taskList.size(); i ++) {
         removeTask(taskList.get(0));
      }
   }

   public void removeTask(Task task) {
      getTaskList().remove(task);
      task.setStory(null);
   }
}
