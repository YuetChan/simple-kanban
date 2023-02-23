package com.tycorp.simplekanban.plugin;

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
public class PluginConfig {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", columnDefinition = "VARCHAR(255)")
    private String id;

    @Column(name = "name")
    private String name;

    @ManyToOne
    @JoinTable(
            name = "plugins_project_join",
            joinColumns = @JoinColumn(name = "plugin_id"),
            inverseJoinColumns = @JoinColumn(name = "project_id")
    )
    private Project project;

    @Column(name = "active")
    private boolean active = true;
}
