package com.tycorp.cuptodo.project;

import com.google.gson.annotations.Expose;
import com.tycorp.cuptodo.story.Story;
import com.tycorp.cuptodo.tag.Tag;
import com.tycorp.cuptodo.task.Task;
import com.tycorp.cuptodo.user.User;
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
public class Project {
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
   @Column(name = "description")
   private String description = "";

   @Expose
   @Column(name = "user_email")
   private String userEmail;

   @ManyToOne(fetch = FetchType.LAZY)
   @JoinTable(
           name = "projects_user_join",
           joinColumns = @JoinColumn(name = "project_id"),
           inverseJoinColumns = @JoinColumn(name = "user_id")
   )
   private User user;

   @Expose
   @ManyToMany(fetch = FetchType.LAZY)
   @JoinTable(
           name = "projects_collaborators_join",
           joinColumns = @JoinColumn(name = "project_id"),
           inverseJoinColumns = @JoinColumn(name = "collaborator_id")
   )
   private List<User> collaboratorList = new ArrayList<>();

   @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Story> storyList = new ArrayList<>();

   @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Task> taskList = new ArrayList<>();

   @OneToMany(mappedBy = "project", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
   private List<Tag> tagList = new ArrayList<>();

   @Expose
   @Column(name = "created_at")
   private long createdAt = System.currentTimeMillis();

   @Column(name = "active")
   private boolean active = true;

   public void removeStory(Story story) {
      storyList.remove(story);
      story.setProject(null);
   }

   public void removeTask(Task task) {
      taskList.remove(task);
      task.setProject(null);
   }
}
