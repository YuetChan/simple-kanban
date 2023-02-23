package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.core.AppContextUtils;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskNodeRepository;
import com.tycorp.simplekanban.engine.domain.task.repository.TaskRepository;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskCreateValidator;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskDeleteValidator;
import com.tycorp.simplekanban.engine.domain.task.validation.validator.DefaultTaskUpdateValidator;
import com.tycorp.simplekanban.engine.domain.task.value.Priority;
import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectUUIDRepository;
import com.tycorp.simplekanban.engine.domain.tag.Tag;
import com.tycorp.simplekanban.engine.domain.tag.TagService;
import com.tycorp.simplekanban.engine.pattern.observer.TaskServiceObserver;
import com.tycorp.simplekanban.engine.pattern.persistence.PersistencePipeline;
import com.tycorp.simplekanban.engine.pattern.validation.ValidationResult;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
public class TaskService {
   // Loggers
   private static final Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

   private List<TaskServiceObserver> observerList = new ArrayList<>();

   // Services
   @Autowired
   private TagService tagService;

   // Repositories
   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private TaskNodeRepository taskNodeRepository;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private ProjectUUIDRepository projectUUIDRepository;

   // Persistence stage
   @Autowired
   private PersistProjectToTaskStage persistProjectToTaskStage;

   @Autowired
   private PersistTaskNodeToTaskStage persistTaskNodeToTaskStage;

   @Autowired
   private PersistTaskStage persistTaskStage;

   @Autowired
   private MergePropertiesToTaskStage mergePropertiesToTaskStage;

   @Autowired
   private MergeTaskNodeToTaskStage mergeTaskNodeToTaskStage;

   // Default task validators
   @Autowired
   private DefaultTaskCreateValidator defaultTaskCreateValidator;

   @Autowired
   private DefaultTaskUpdateValidator defaultTaskUpdateValidator;

   @Autowired
   private DefaultTaskDeleteValidator defaultTaskDeleteValidator;

   public TaskService() {
//      initObserverList();
   }

//   public void initObserverList() {
//      LOGGER.debug("initObserverList");
//      for(var observer: AppContextUtils.getBeanOfType(TaskServiceObserver.class).values()) {
//         this.observerList.add(observer);
//      }
//   }

   @Transactional
   public Task create(CreateModel model) {
      // Creates tag list from model
      List<Tag> tagList = new ArrayList<>();

      for(Tag tag : model.tagList) {
         tagList.add(tag);
      }

      // Creates task node from model
      TaskNode node = new TaskNode();

      node.setHeadUUID(model.headUUID);
      node.setTailUUID(model.tailUUID);
      node.setStatus(model.status);

      node.setProjectId(model.projectId);

      // Create task from model, tag list and task node
      Task task = new Task();

      task.setTitle(model.title);
      task.setDescription(model.description);
      task.setNote(model.note);

      task.setPriority(model.priority);

      task.setAssigneeEmail(model.assigneeEmail);
      task.setDueAt(model.dueAt);

      task.setTaskNode(node);
      task.setTagList(tagList);

      // Validates new task
      ValidationResult validationResult = defaultTaskCreateValidator.validate(task);

      if(validationResult.isValid()) {
         task = new PersistencePipeline<>(
                 persistTaskStage,
                 persistProjectToTaskStage)
                 .process(task);

         if(!insertNewTaskNodeToLinkedList(task.getId(), node)) {
            LOGGER.debug("Failed to insert task to linkedList");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to insert task to linkedList");
         }

         attachTagListToNewTask(task.getId(), tagList);

         return task;
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   // Updated task needed to be in transient state
   @Transactional
   public void update(UpdateModel model) {
      notifyObserversPreUpdate(model);

      // Creates tag list from model
      List<Tag> updatedTagList = new ArrayList<>();

      for(Tag tag : model.tagList) {
         updatedTagList.add(tag);
      }

      // Creates task node from model
      TaskNode updatedNode = new TaskNode();

      updatedNode.setHeadUUID(model.headUUID);
      updatedNode.setTailUUID(model.tailUUID);
      updatedNode.setStatus(model.status);

      // Creates updated task from model, tag list and task node
      Task updatedTask = new Task();

      updatedTask.setId(model.id);

      updatedTask.setTitle(model.title);
      updatedTask.setDescription(model.description);
      updatedTask.setNote(model.note);

      updatedTask.setPriority(model.priority);

      updatedTask.setDueAt(model.dueAt);
      updatedTask.setAssigneeEmail(model.assigneeEmail);

      // Validates updated task
      ValidationResult validationResult = defaultTaskUpdateValidator.validate(updatedTask);

      if(validationResult.isValid()) {
         new PersistencePipeline<>(mergePropertiesToTaskStage)
                 .process(updatedTask);

         // Detaches task node from linkedlist
         if(detachTaskNodeFromLinkedList(updatedTask.getId())) {
            LOGGER.debug("Task is detached from linkedlist");

            if(updatedNode.getStatus().equals(Status.ARCHIVE)) {
               LOGGER.debug("Task status is archived");

               updatedNode.setTailUUID("");
               updatedNode.setHeadUUID("");

               taskNodeRepository.save(updatedNode);
            }else {
               // Attachs task node to linkedList
               if(!updateTaskNodeOnLinkedList(updatedTask.getId(), updatedNode)) {
                  LOGGER.debug("Failed to reinsert task node to linkedlist");
                  throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to reinsert task node to linkedlist");
               }
            }
         }else {
            LOGGER.debug("Failed to detach task node from linkedlist");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to detach task node from linkedlist");
         }

         Task orgTask = taskRepository.findById(updatedTask.getId()).get();

         // Removes tag list from or add tag to task
         List<Tag> orgTagList = orgTask.getTagList();

         List<String> orgTagListNames = orgTagList.stream()
                 .map(tag -> tag.getName())
                 .collect(Collectors.toList());

         List<String> updatedTagListNames = updatedTagList.stream()
                 .map(tag -> tag.getName())
                 .collect(Collectors.toList());

         List<Tag> tagToRemoveList = orgTagList.stream()
                 .filter(tag -> !updatedTagListNames.contains(tag.getName()))
                 .collect(Collectors.toList());

         List<Tag> tagToAddList = updatedTagList.stream()
                 .filter(tag -> !orgTagListNames.contains(tag.getName()))
                 .collect(Collectors.toList());

         List<String> tagToAddNameList = tagToAddList.stream()
                 .map(tag -> tag.getName())
                 .collect(Collectors.toList());

         attachTagListToTask(orgTask, tagToAddNameList);
         removeTagListFromTask(orgTask, tagToRemoveList);

         notifyObserversPostUpdate(model);

         return;
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   @Transactional
   public void attachTagListToTask(Task task, List<String> tagNameList) {
      // Populates tag from child side
      tagService.addTagList(
              tagNameList,
              task.getProject().getId(),
              task.getId());
   }

   @Transactional
   public void removeTagListFromTask(Task task, List<Tag> tagList) {
      // Removes from parent side
      task.removeTags(tagList);
      taskRepository.save(task);
   }

   @Transactional
   public void delete(String id) {
      notifyObserversPreDelete(id);

      // Validates task via id
      ValidationResult validationResult = defaultTaskDeleteValidator.validate(id);

      if(validationResult.isValid()) {
         Task task = taskRepository.findById(id).get();
         delete(task);

         notifyObserversPostDelete(id);

         return;
      }

      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, validationResult.getErrorMsg());
   }

   @Transactional
   public void delete(Task task) {
      task.setActive(false);
      taskRepository.save(task);

      // Detaches task from linkedlist and should always return true
      detachTaskNodeFromLinkedList(task.getId());
   }

   private void notifyObserversPreUpdate(UpdateModel model) {
      for(var observer: observerList) {
         observer.preUpdate(model);
      }
   }

   private void notifyObserversPostUpdate(UpdateModel model) {
      for(var observer: observerList) {
         observer.postUpdate(model);
      }
   }

   private void notifyObserversPreDelete(String id) {
      for(var observer: observerList) {
         observer.preDelete(id);
      }
   }

   private void notifyObserversPostDelete(String id) {
      for(var observer: observerList) {
         observer.postDelete(id);
      }
   }

   @Transactional
   public boolean insertNewTaskNodeToLinkedList(String id, TaskNode node) {
      Task task = new Task();

      task.setId(id);
      task.setTaskNode(node);

      return insertNewTaskNodeToLinkedListByBaseCase(task) || insertNewTaskNodeToLinkedListByStepCase(task);
   }

   @Transactional
   public boolean insertNewTaskNodeToLinkedListByBaseCase(Task task) {
      TaskNode node = task.getTaskNode();
      Task orgTask =  taskRepository.findById(task.getId()).get();

      // When zero node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(node.getProjectId(), node.getStatus()) == 0) {
         LOGGER.debug("Task node count is 0");

         // Validates new node against util uuids
         if(checkIfHeadUUIDAnUtilUUID(node) && checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Both head and tail UUIDs are valid");

            // Persists new task node
            new PersistencePipeline<>(persistTaskNodeToTaskStage)
                    .process(task);

            return true;
         }

         return false;
      }

      // When one node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(node.getProjectId(), node.getStatus()) == 1) {
         LOGGER.debug("Task node count is 1");

         // Validate new node against util uuid
         if(checkIfHeadUUIDAnUtilUUID(node)) {
            LOGGER.debug("Head UUID is valid");

            Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());
            if(tailTaskMaybe.isPresent()) {
               LOGGER.debug("Tail node is present");

               // Update tail node
               TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
               tailNode.setHeadUUID(orgTask.getId());

               taskNodeRepository.save(tailNode);

               // Persist new task node
               new PersistencePipeline<>(persistTaskNodeToTaskStage)
                       .process(task);

               return true;
            }
         }

         // Validates new node against util uuid
         if(checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Tail UUID is valid");

            Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
            if(headTaskMaybe.isPresent()) {
               LOGGER.debug("Head node is present");

               // Update head node
               TaskNode headNode = headTaskMaybe.get().getTaskNode();
               headNode.setTailUUID(orgTask.getId());

               taskNodeRepository.save(headNode);

               // Persist new task node
               new PersistencePipeline<>(persistTaskNodeToTaskStage)
                       .process(task);

               return true;
            }
         }

         return false;
      }

      return false;
   }

   // Task can be in transient state
   @Transactional
   public boolean insertNewTaskNodeToLinkedListByStepCase(Task task) {
      TaskNode node = task.getTaskNode();
      Task orgTask = taskRepository.findById(task.getId()).get();

      Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
      Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());

      if(headTaskMaybe.isPresent() && !tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head node is present while tail node is not present");

         TaskNode headNode = headTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = headNode.getTailUUID().equals(node.getTailUUID());

         // Validates new node against head node and util uuid
         if(checkIfNewTaskNodeValid(node, headNode) && checkIfTailUUIDAnUtilUUID(node)
                 && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid while tail UUID is an util UUID");

            // Updates head node
            headNode.setTailUUID(orgTask.getId());
            taskNodeRepository.save(headNode);

            // Persists new task node
            new PersistencePipeline<>(persistTaskNodeToTaskStage)
                    .process(task);

            return true;
         }

         return false;
      }

      if(!headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head node is not present while tail node is present");

         TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = tailNode.getHeadUUID().equals(node.getHeadUUID());

         // Validates new node against tail node and util uuid
         if(checkIfNewTaskNodeValid(node, tailNode) && checkIfHeadUUIDAnUtilUUID(node)
                 && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Tail node is valid while head UUID is an util UUID");

            // Updates tail node
            tailNode.setHeadUUID(orgTask.getId());
            taskNodeRepository.save(tailNode);

            // Persist new task node
            new PersistencePipeline<>(persistTaskNodeToTaskStage)
                    .process(task);

            return true;
         }

         return false;
      }

      if(headTaskMaybe.isPresent()
              && tailTaskMaybe.isPresent() && !node.getHeadUUID().equals(node.getTailUUID())) {
         LOGGER.debug("Both task and tail nodes are present while head UUID and tail UUID are not equal");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Gets the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID())
                 && headNode.getTailUUID().equals(tailTask.getId());

         // Validates new node against head node and check the consecutiveness
         if(checkIfNewTaskNodeValid(node, headNode) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid");

            // Updates head and tail task nodes
            headNode.setTailUUID(orgTask.getId());
            tailNode.setHeadUUID(orgTask.getId());

            taskNodeRepository.save(headNode);
            taskNodeRepository.save(tailNode);

            // Persist new task node
            new PersistencePipeline<>(persistTaskNodeToTaskStage)
                    .process(task);

            return true;
         }

         return false;
      }

      return false;
   }

   // Task can be in transient state
   @Transactional
   public boolean updateTaskNodeOnLinkedList(String id, TaskNode node) {
      Task task = new Task();

      task.setId(id);
      task.setTaskNode(node);

      return updateTaskNodeOnLinkedListByBaseCase(task) || updateTaskNodeOnLinkedListByStepCase(task);
   }

   // Updated task needed to be in transient state
   @Transactional
   public boolean updateTaskNodeOnLinkedListByBaseCase(Task updatedTask) {
      TaskNode updatedNode = updatedTask.getTaskNode();

      Task orgTask = taskRepository.findById(updatedTask.getId()).get();
      TaskNode orgNode = orgTask .getTaskNode();

      String projectId = orgTask .getProject().getId();

      // When zero node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(projectId, updatedNode.getStatus()) == 0) {
         LOGGER.debug("Task node count is 0");

         // Validates updated node against util uuids
         if(checkIfHeadUUIDAnUtilUUID(updatedNode) && checkIfTailUUIDAnUtilUUID(updatedNode)) {
            LOGGER.debug("Head and tail UUIDs are valid");

            // Persists updated task node
            new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                    .process(updatedTask);

            return true;
         }

         return false;
      }

      // When one node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(projectId, updatedNode.getStatus()) == 1) {
         LOGGER.debug("Task node count is 1");

         if(orgNode.getHeadUUID().equals(updatedNode.getHeadUUID()) && orgNode.getTailUUID().equals(updatedNode.getTailUUID())
                 && orgNode.getStatus().equals(updatedNode.getStatus())) {
            LOGGER.debug("No changes on head UUID, tail UUID and status");
            return true;
         }

         // Validates updated node against util uuid
         if(checkIfHeadUUIDAnUtilUUID(updatedNode)) {
            LOGGER.debug("Head UUID is valid");

            Optional<Task> tailTaskMaybe = taskRepository.findById(updatedNode.getTailUUID());
            if(tailTaskMaybe.isPresent()) {
               LOGGER.debug("Tail task is present");

               // Update tail node
               TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
               tailNode.setHeadUUID(updatedTask.getId());

               taskNodeRepository.save(tailNode);

               // Persists updated task node
               new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                       .process(updatedTask);

               return true;
            }
         }

         // Validates new node against util uuid
         if(checkIfTailUUIDAnUtilUUID(updatedNode)) {
            LOGGER.debug("Tail UUID is valid");

            Optional<Task> headTaskMaybe = taskRepository.findById(updatedNode.getHeadUUID());
            if(headTaskMaybe.isPresent()) {
               LOGGER.debug("Head task is present");

               // Updates head node
               TaskNode headNode = headTaskMaybe.get().getTaskNode();
               headNode.setTailUUID(updatedTask.getId());

               taskNodeRepository.save(headNode);

               // Persists updated task node
               new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                       .process(updatedTask);

               return true;
            }
         }

         return false;
      }

      return false;
   }

   // Task needed to be in persistent state
   @Transactional
   public boolean updateTaskNodeOnLinkedListByStepCase(Task updatedTask) {
      TaskNode updatedNode = updatedTask.getTaskNode();
      TaskNode orgNode = taskRepository.findById(updatedTask.getId()).get().getTaskNode();

      Optional<Task> headTaskMaybe = taskRepository.findById(updatedNode.getHeadUUID());
      Optional<Task> tailTaskMaybe = taskRepository.findById(updatedNode.getTailUUID());

      if(headTaskMaybe.isPresent() && !tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head task is present while tail task is not present");

         TaskNode headNode = headTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = headNode.getTailUUID().equals(updatedNode.getTailUUID());

         // Validates node against head node and util uuid
         if(checkIfTaskNodeValid(updatedNode, headNode) && checkIfTailUUIDAnUtilUUID(updatedNode)
                 && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid while tail UUID is an util UUID");

            // Updates head node
            headNode.setTailUUID(updatedTask.getId());
            taskNodeRepository.save(headNode);

            // Persists updated task node
            new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                    .process(updatedTask);

            return true;
         }

         return false;
      }

      if(!headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head task is not present while tail task is present");

         TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = tailNode.getHeadUUID().equals(updatedNode.getHeadUUID());

         // Validates node against tail node and util uuid
         if(checkIfTaskNodeValid(updatedNode, tailNode) && checkIfHeadUUIDAnUtilUUID(updatedNode)
                 && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Tail node is valid while head UUID is an util UUID");

            // Update tail node
            tailNode.setHeadUUID(updatedTask.getId());
            taskNodeRepository.save(tailNode);

            // Persist updated task node
            new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                    .process(updatedTask);

            return true;
         }

         return false;
      }

      if(headTaskMaybe.isPresent()
              && tailTaskMaybe.isPresent() && !orgNode.getHeadUUID().equals(updatedNode.getTailUUID())) {
         LOGGER.debug("Both head and tail tasks are present while head and tail UUIDs are not equal");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Gets the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID())
                 && headNode.getTailUUID().equals(tailTask.getId());

         // Validates node against head node and check the consecutiveness
         if(checkIfTaskNodeValid(updatedNode, headNode) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid");

            // Update head and tail task nodes
            headNode.setTailUUID(updatedTask.getId());
            tailNode.setHeadUUID(updatedTask.getId());

            taskNodeRepository.save(headNode);
            taskNodeRepository.save(tailNode);

            // Persist updated task node
            new PersistencePipeline<>(mergeTaskNodeToTaskStage)
                    .process(updatedTask);

            return true;
         }

         return false;
      }

      return false;
   }

   public void attachTagListToNewTask(String id, List<Tag> tagList) {
      Task task = taskRepository.findById(id).get();

      // Populates tag list from the child side
      List<Tag> tagAddedList = tagService.addTagList(
              tagList.stream()
                      .map(tag -> tag.getName())
                      .collect(Collectors.toList()),
              task.getProject().getId(),
              task.getId());

      task.getTagList().addAll(tagAddedList);
   }

   @Transactional
   public boolean checkIfNewTaskNodeValid(TaskNode newNode, TaskNode existedNode) {
      return checkIfProjectOfNewTaskNodeValid(newNode, existedNode)
              && checkIfStatusOfNewTaskNodeValid(newNode, existedNode);
   }

   @Transactional
   public boolean checkIfProjectOfNewTaskNodeValid(TaskNode newNode, TaskNode originalNode) {
      return newNode.getProjectId().equals(originalNode.getProject().getId());
   }

   @Transactional
   public boolean checkIfStatusOfNewTaskNodeValid(TaskNode newNode, TaskNode originalNode) {
      return newNode.getStatus().equals(originalNode.getStatus());
   }

   @Transactional
   public boolean checkIfStatusOfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      return node.getStatus().equals(existedNode.getStatus());
   }

   @Transactional
   public boolean checkIfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      return checkIfStatusOfTaskNodeValid(node, existedNode);
   }

   @Transactional
   public boolean checkIfHeadUUIDAnUtilUUID(TaskNode node) {
      String headUUID = node.getHeadUUID();
      Status status = node.getStatus();

      if(status.equals(Status.BACKLOG)) {
         LOGGER.debug("Task status is backlog");
         return projectUUIDRepository.findByUuid1(headUUID).isPresent();
      }

      if(status.equals(Status.TODO)) {
         LOGGER.debug("Task status is todo");
         return projectUUIDRepository.findByUuid3(headUUID).isPresent();
      }

      if(status.equals(Status.IN_PROGRESS)) {
         LOGGER.debug("Task status is in progress");
         return projectUUIDRepository.findByUuid5(headUUID).isPresent();
      }

      if(status.equals(Status.DONE)) {
         LOGGER.debug("Task status is done");
         return projectUUIDRepository.findByUuid7(headUUID).isPresent();
      }

      return false;
   }

   @Transactional
   public boolean checkIfTailUUIDAnUtilUUID(TaskNode node) {
      String tailUUID = node.getTailUUID();
      Status status = node.getStatus();

      if(status.equals(Status.BACKLOG)) {
         LOGGER.debug("Task status is backlog");
         return projectUUIDRepository.findByUuid2(tailUUID).isPresent();
      }

      if(status.equals(Status.TODO)) {
         LOGGER.debug("Task status is todo");
         return projectUUIDRepository.findByUuid4(tailUUID).isPresent();
      }

      if(status.equals(Status.IN_PROGRESS)) {
         LOGGER.debug("Task status is in progress");
         return projectUUIDRepository.findByUuid6(tailUUID).isPresent();
      }

      if(status.equals(Status.DONE)) {
         LOGGER.debug("Task status is done");
         return projectUUIDRepository.findByUuid8(tailUUID).isPresent();
      }

      return false;
   }

   @Transactional
   public boolean detachTaskNodeFromLinkedList(String id) {
      TaskNode node = taskRepository.findById(id).get().getTaskNode();

      if(checkIfHeadUUIDAnUtilUUID(node) && checkIfTailUUIDAnUtilUUID(node)) {
         LOGGER.debug("Both head and tail UUIDs are util UUIDs");
         return true;
      }

      if(checkIfHeadUUIDAnUtilUUID(node)) {
         LOGGER.debug("Head UUID is an util UUID");

         TaskNode tailNode = taskRepository.findById(node.getTailUUID()).get().getTaskNode();
         tailNode.setHeadUUID(node.getHeadUUID());

         taskNodeRepository.save(tailNode);
      }

      if(checkIfTailUUIDAnUtilUUID(node)) {
         LOGGER.debug("Tail UUID is an util UUID");

         TaskNode headNode = taskRepository.findById(node.getHeadUUID()).get().getTaskNode();
         headNode.setTailUUID(node.getTailUUID());

         taskNodeRepository.save(headNode);
      }

      if(!checkIfHeadUUIDAnUtilUUID(node) && !checkIfTailUUIDAnUtilUUID(node)) {
         LOGGER.debug("Neither head and tail UUIDs are util UUIDs");

         TaskNode headNode = taskRepository.findById(node.getHeadUUID()).get().getTaskNode();
         headNode.setTailUUID(node.getTailUUID());

         taskNodeRepository.save(headNode);

         TaskNode tailNode = taskRepository.findById(node.getTailUUID()).get().getTaskNode();
         tailNode.setHeadUUID(node.getHeadUUID());

         taskNodeRepository.save(tailNode);
      }

      return true;
   }

   @AllArgsConstructor
   public static class CreateModel {
      private String title;
      private String description;
      private String note;

      private Priority priority;

      private String assigneeEmail;
      private Long dueAt;

      private List<Tag> tagList;

      private String headUUID;
      private String tailUUID;
      private Status status;

      private String projectId;
   }

   @AllArgsConstructor
   public static class UpdateModel {
      private String id;

      private String title;
      private String description;
      private String note;

      private Priority priority;

      private String assigneeEmail;
      private Long dueAt;

      private List<Tag> tagList;

      private String headUUID;
      private String tailUUID;
      private Status status;
   }
}
