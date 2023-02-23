package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.project.Project;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.domain.tag.Tag;
import com.tycorp.simplekanban.engine.domain.tag.TagService;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskCreateValidator;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskDeleteValidator;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskUpdateValidator;
import com.tycorp.simplekanban.engine.domain.task.value.Priority;
import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.pattern.observer.TaskServiceObserver;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

@ExtendWith(SpringExtension.class)
public class TaskServiceTest {
    // Services
   @Spy
   @InjectMocks
   private TaskService taskService;

   @Mock
   private AppContextUtils appContextUtils;

   // Repositories
   @Mock
   private TaskRepository taskRepository;

   // Default validators
   @Mock
   private DefaultTaskCreateValidator defaultTaskCreateValidator;

   @Mock
   private DefaultTaskUpdateValidator defaultTaskUpdateValidator;

   @Mock
   private DefaultTaskDeleteValidator defaultTaskDeleteValidator;

   // Persistance stages
   @Mock
   private PersistTaskStage persistTaskStage;

   @Mock
   private PersistProjectToTaskStage persistProjectToTaskStage;

   @Mock
   private MergePropertiesToTaskStage mergePropertiesToTaskStage;

   @BeforeEach
   public void initTaskService() {
//      MockitoAnnotations.initMocks(this);
//      MockedStatic appContextUtilsMock = mockStatic(AppContextUtils.class);
//
//      appContextUtilsMock.when(() -> AppContextUtils.getBeanOfType(TaskServiceObserver.class))
//              .thenReturn(new HashMap<>());
   }

   @Test
   public void shouldCreateTaskAndReflectTagList() throws Exception {
      Task dummyCreatedTask = new Task();

      dummyCreatedTask.setId("pseudo-id");

      List<Tag> tagList = new ArrayList<>();

      Tag tag_1 = new Tag();
      tag_1.setName("tag_1");

      Tag tag_2 = new Tag();
      tag_2.setName("tag_2");

      tagList.add(tag_1);
      tagList.add(tag_2);

      dummyCreatedTask.setTaskNode(new TaskNode());
      dummyCreatedTask.setTagList(tagList);

      TaskService.CreateModel model = new TaskService.CreateModel(
              "title",
              "description",
              "note",
              Priority.LOW,
              "yuetchany@simplekanban.com",
              -1l,
              tagList,
              "", "", Status.BACKLOG,
              "project_id_1");

      when(defaultTaskCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(persistTaskStage.process(Mockito.any()))
              .thenReturn(dummyCreatedTask);
      when(persistProjectToTaskStage.process(Mockito.any()))
              .thenReturn(dummyCreatedTask);

      doReturn(true)
              .when(taskService).insertNewTaskNodeToLinkedList(Mockito.any(), Mockito.any());
      doNothing()
              .when(taskService).attachTagListToNewTask(Mockito.any(), Mockito.any());

      Task actualTask = taskService.create(model);

      List<Tag> actualTagList = actualTask.getTagList();

      assertTrue(actualTagList.containsAll(tagList));
      assertTrue(tagList.containsAll(actualTagList));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithTagListCountExceedMaximum() throws Exception {
      TaskService.CreateModel model = new TaskService.CreateModel(
              "title",
              "description",
              "note",
              Priority.LOW,
              "yuetchany@simplekanban.com",
              -1l,
              new ArrayList<>(),
              "", "", Status.BACKLOG,
              "project_id_1");

      when(defaultTaskCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("Tag list count exceeds maximum"));

      assertThrows(ResponseStatusException.class, () -> taskService.create(model));
   }

   @Test
   public void shouldThrowResponseStatusExceptionWhenCreateTaskWithInvalidProject() throws Exception {
      TaskService.CreateModel model = new TaskService.CreateModel(
              "title",
              "description",
              "note",
              Priority.LOW,
              "yuetchany@simplekanban.com",
              -1l,
              new ArrayList<>(),
              "", "", Status.BACKLOG,
              "project_id_1");

      when(defaultTaskCreateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.invalid("Project not found"));

      assertThrows(ResponseStatusException.class, () -> taskService.create(model));
   }

   @Test
   public void shouldUpdatePropertiesOfTask() throws Exception {
      Task dummyUpdatedTask = new Task();

      Project dummyProject = new Project();
      dummyProject.setId("dummy-id");

      when(defaultTaskUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(mergePropertiesToTaskStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedTask);

      doReturn(true)
              .when(taskService).detachTaskNodeFromLinkedList(Mockito.any());
      doReturn(true)
              .when(taskService).updateTaskNodeOnLinkedList(Mockito.any(), Mockito.any());

      Task dummyOrgTask = new Task();
      dummyOrgTask.setProject(dummyProject);

      when(taskRepository.findById(dummyUpdatedTask.getId()))
              .thenReturn(Optional.of(dummyOrgTask));

      doNothing()
              .when(taskService).attachTagListToTask(eq(dummyOrgTask), Mockito.any());
      doNothing()
              .when(taskService).removeTagListFromTask(eq(dummyOrgTask), Mockito.any());

      TaskService.UpdateModel model = new TaskService.UpdateModel(
              dummyUpdatedTask.getId(),
              "title",
              "description",
              "note",
              Priority.LOW,
              "yuetchany@simplekanban.com",
              -1l,
              new ArrayList<>(),
              "", "", Status.BACKLOG);

      taskService.update(model);

      verify(mergePropertiesToTaskStage).process(Mockito.any());
   }

   @Test
   public void shouldUpdateTagListOfTask() throws Exception {
      Task dummyUpdatedTask = new Task();

      Project dummyProject = new Project();
      dummyProject.setId("dummy-id");

      when(defaultTaskUpdateValidator.validate(Mockito.any()))
              .thenReturn(ValidationResult.valid());

      when(mergePropertiesToTaskStage.process(Mockito.any()))
              .thenReturn(dummyUpdatedTask);

      doReturn(true)
              .when(taskService).detachTaskNodeFromLinkedList(Mockito.any());
      doReturn(true)
              .when(taskService).updateTaskNodeOnLinkedList(Mockito.any(), Mockito.any());

      Task dummyOrgTask = new Task();
      dummyOrgTask.setProject(dummyProject);

      when(taskRepository.findById(dummyUpdatedTask.getId()))
              .thenReturn(Optional.of(dummyOrgTask));

      doNothing()
              .when(taskService).attachTagListToTask(eq(dummyOrgTask), Mockito.any());
      doNothing()
              .when(taskService).removeTagListFromTask(eq(dummyOrgTask), Mockito.any());

      TaskService.UpdateModel model = new TaskService.UpdateModel(
              dummyUpdatedTask.getId(),
              "title",
              "description",
              "note",
              Priority.LOW,
              "yuetchany@simplekanban.com",
              -1l,
              new ArrayList<>(),
              "", "", Status.BACKLOG);

      taskService.update(model);

      verify(taskService).attachTagListToTask(eq(dummyOrgTask), Mockito.any());
      verify(taskService).removeTagListFromTask(eq(dummyOrgTask), Mockito.any());
   }

   @Test
   public void shouldDeleteTask() throws Exception {
      Task dummyTask = new Task();
      dummyTask.setId("dummy-id");

      when(defaultTaskDeleteValidator.validate(Mockito.any())).thenReturn(ValidationResult.valid());
      when(taskRepository.findById(Mockito.any())).thenReturn(Optional.of(dummyTask));

      doNothing().when(taskService).delete(dummyTask);

      taskService.delete(dummyTask.getId());

      verify(taskService).delete(dummyTask);
   }
}
