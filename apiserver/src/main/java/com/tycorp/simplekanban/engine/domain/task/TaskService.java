package com.tycorp.simplekanban.engine.domain.task;

import com.tycorp.simplekanban.engine.domain.task.value.Status;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectRepository;
import com.tycorp.simplekanban.engine.domain.project.repository.ProjectUUIDRepository;
import com.tycorp.simplekanban.engine.domain.tag.Tag;
import com.tycorp.simplekanban.engine.domain.tag.TagService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TaskService {
   private static final Logger LOGGER = LoggerFactory.getLogger(TaskService.class);

   @Autowired
   private TagService tagService;

   @Autowired
   private TaskRepository taskRepository;

   @Autowired
   private TaskNodeRepository taskNodeRepository;

   @Autowired
   private ProjectRepository projectRepository;

   @Autowired
   private ProjectUUIDRepository projectUUIDRepository;

   @Transactional
   public Task create(Task task) {
      if(!checkIfTagListCountValid(task) || !checkIfSubTaskListCountValid(task)) {
         LOGGER.debug("Tag list or sub task list count exceed maximum");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "TagList or subTaskList counts exceed maximum");
      }

      if(!checkIfProjectForTaskExists(task)) {
         LOGGER.debug("Project is invalid");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Project is invalid");
      }

      attachProjectToNewTask(task);

      // Temporary remove the tag list and task node
      List<Tag> tagList = task.getTagList();
      task.setTagList(new ArrayList<>());

      TaskNode node = task.getTaskNode();
      task.setTaskNode(new TaskNode());

      // Get task in persistent state
      task = taskRepository.save(task);

      // Re-add the tag list and task node
      task.setTagList(tagList);
      task.setTaskNode(node);

      if(!insertNewTaskToLinkedList(task)) {
         LOGGER.debug("Failed to insert task to linkedList");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to insert task to linkedList");
      }

      attachTagToNewTask(task);

      return task;
   }

   // Original task need to be in persistent state
   @Transactional
   public Task update(Task originalTask, Task updatedTask) {
      if(!checkIfTagListCountValid(originalTask) || !checkIfSubTaskListCountValid(originalTask)) {
         LOGGER.debug("Tag list or sub task list count exceed maximum");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tagList or subTaskList count exceed maximum");
      }

      originalTask.setTitle(updatedTask.getTitle());

      originalTask.setDescription(updatedTask.getDescription());
      originalTask.setNote(updatedTask.getNote());

      originalTask.setAssigneeEmail(updatedTask.getAssigneeEmail());
      originalTask.setDueAt(updatedTask.getDueAt());

      originalTask.setPriority(updatedTask.getPriority());

      originalTask.setSubTaskList(updatedTask.getSubTaskList());

      // Detach task node from and attach task node to linkedList
      if(detachTaskNodeFromLinkedList(originalTask)) {
         LOGGER.debug("Task is detached from linkedlist");

         TaskNode updatedNode = updatedTask.getTaskNode();
         if(updatedNode.getStatus().equals(Status.ARCHIVE)) {
            LOGGER.debug("Task status is archived");

            updatedNode.setTailUUID("");
            updatedNode.setHeadUUID("");

            taskNodeRepository.save(updatedNode);
         }else {
            if(!reinsertTaskNodeToLinkedList(originalTask, updatedNode.getHeadUUID(), updatedNode.getTailUUID(),
                    updatedNode.getStatus())) {
               LOGGER.debug("Failed to reinsert task node to linkedlist");
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to reinsert task node to linkedlist");
            }
         }
      }else {
         LOGGER.debug("Failed to detach task node from linkedlist");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to detach task node from linkedlist");
      }

      // Remove tag list from or add tag to task
      List<Tag> tagList = originalTask.getTagList();
      List<String> tagListNames = tagList.stream().map(tag -> tag.getName()).collect(Collectors.toList());

      List<Tag> updatedTagList = updatedTask.getTagList();
      List<String> updatedTagListNames = updatedTagList.stream().map(tag -> tag.getName()).collect(Collectors.toList());

      List<Tag> tagToRemoveList = tagList.stream()
              .filter(tag -> !updatedTagListNames.contains(tag.getName()))
              .collect(Collectors.toList());

      List<Tag> tagToAddList = updatedTagList.stream()
              .filter(tag -> !tagListNames.contains(tag.getName()))
              .collect(Collectors.toList());

      // Populate from the child side
      List<Tag> tagAddedList = tagService.addTagListToProjectAndTask(tagToAddList, originalTask.getProject(),
              originalTask);
      originalTask.getTagList().addAll(tagAddedList);

      // Remove from parent side
      originalTask.removeTags(tagToRemoveList);

      originalTask = taskRepository.save(originalTask);

      return taskRepository.save(originalTask);
   }

   @Transactional
   public void delete(Task task) {
      task.setActive(false);
      taskRepository.save(task);

      // Detach task from linkedlist and should always return true
      detachTaskNodeFromLinkedList(task);
   }

   // Task need to be in persistent state
   @Transactional
   public boolean detachTaskNodeFromLinkedList(Task task) {
      TaskNode node = task.getTaskNode();

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

         TaskNode tailNode = taskRepository.findById(node.getTailUUID()).get().getTaskNode();
         tailNode.setHeadUUID(node.getHeadUUID());
      }

      return true;
   }

   // Task need to be in persistent state
   @Transactional
   public boolean reinsertTaskNodeToLinkedList(Task task, String headUUID, String tailUUID, Status status) {
      return reinsertTaskNodeToLinkedListByBaseCase(task, headUUID, tailUUID, status)
              || reinsertTaskNodeToLinkedListByStepCase(task, headUUID, tailUUID, status);
   }

   // Task need to be in persistent state
   @Transactional
   public boolean reinsertTaskNodeToLinkedListByBaseCase(Task task, String headUUID, String tailUUID, Status status) {
      TaskNode node = task.getTaskNode();
      String projectId = task.getProject().getId();

      // When zero node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(projectId, status) == 0) {
         LOGGER.debug("Task node count is 0");

         node.setHeadUUID(headUUID);
         node.setTailUUID(tailUUID);

         node.setStatus(status);

         // Validate updated node against util uuids
         if(checkIfHeadUUIDAnUtilUUID(node) && checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Head and tail UUIDs are valid");

            // Update new node
            node.setTask(task);
            node.setProject(task.getProject());

            taskNodeRepository.save(node);

            return true;
         }

         return false;
      }

      // When one node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(projectId, status) == 1) {
         LOGGER.debug("Task node count is 1");

         if(node.getHeadUUID().equals(headUUID) && node.getTailUUID().equals(tailUUID)
                 && node.getStatus().equals(status)) {
            LOGGER.debug("No changes on head UUID, tail UUID and status");
            return true;
         }

         node.setHeadUUID(headUUID);
         node.setTailUUID(tailUUID);

         node.setStatus(status);

         // Validate updated node against util uuid
         if(checkIfHeadUUIDAnUtilUUID(node)) {
            LOGGER.debug("Head UUID is valid");

            Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());
            if(tailTaskMaybe.isPresent()) {
               LOGGER.debug("Tail task is present");

               // Update tail node
               TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
               tailNode.setHeadUUID(task.getId());

               taskNodeRepository.save(tailNode);

               node.setTask(task);
               node.setProject(task.getProject());

               taskNodeRepository.save(node);

               return true;
            }
         }

         // Validate new node against util uuid
         if(checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Tail UUID is valid");

            Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
            if(headTaskMaybe.isPresent()) {
               LOGGER.debug("Head task is present");

               // Update head node
               TaskNode headNode = headTaskMaybe.get().getTaskNode();
               headNode.setTailUUID(task.getId());

               taskNodeRepository.save(headNode);

               node.setTask(task);
               node.setProject(task.getProject());

               taskNodeRepository.save(node);

               return true;
            }
         }

         return false;
      }

      return false;
   }

   // Task need to be in persistent state
   @Transactional
   public boolean reinsertTaskNodeToLinkedListByStepCase(Task task, String headUUID, String tailUUID, Status status) {
      TaskNode node = task.getTaskNode();

      node.setHeadUUID(headUUID);
      node.setTailUUID(tailUUID);

      node.setStatus(status);

      Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
      Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());

      if(headTaskMaybe.isPresent() && !tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head task is present while tail task is not present");

         TaskNode headNode = headTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = headNode.getTailUUID().equals(node.getTailUUID());

         // Validate node against head node and util uuid
         if(checkIfTaskNodeValid(node, headNode) && checkIfTailUUIDAnUtilUUID(node) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid while tail UUID is an util UUID");

            // Update head node
            headNode.setTailUUID(task.getId());
            taskNodeRepository.save(headNode);

            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            return true;
         }

         return false;
      }

      if(!headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head task is not present while tail task is present");

         TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = tailNode.getHeadUUID().equals(node.getHeadUUID());

         // Validate node against tail node and util uuid
         if(checkIfTaskNodeValid(node, tailNode) && checkIfHeadUUIDAnUtilUUID(node) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Tail node is valid while head UUID is an util UUID");

            // Update tail node
            tailNode.setHeadUUID(task.getId());
            taskNodeRepository.save(tailNode);

            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            return true;
         }

         return false;
      }

      if(headTaskMaybe.isPresent() && tailTaskMaybe.isPresent() && !headUUID.equals(tailUUID)) {
         LOGGER.debug("Both head and tail tasks are present while head and tail UUIDs are not equal");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Get the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID())
                 && headNode.getTailUUID().equals(tailTask.getId());

         // Validate node against head node and check the consecutiveness
         if(checkIfTaskNodeValid(node, headNode) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid");

            // Update head and tail task nodes
            headNode.setTailUUID(task.getId());
            tailNode.setHeadUUID(task.getId());

            taskNodeRepository.save(headNode);
            taskNodeRepository.save(tailNode);

            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            return true;
         }

         return false;
      }

      return false;
   }

   @Transactional
   public boolean insertNewTaskToLinkedList(Task task) {
      return insertTaskNodeToLinkedListByBaseCase(task) || insertTaskNodeToLinkedListByStepCase(task);
   }

   // Task need to be in persistent state
   @Transactional
   public boolean insertTaskNodeToLinkedListByBaseCase(Task task) {
      TaskNode node = task.getTaskNode();

      // When zero node with given project id and status
      if(taskNodeRepository.countByProjectIdAndStatus(node.getProjectId(), node.getStatus()) == 0) {
         LOGGER.debug("Task node count is 0");

         // Validate new node against util uuids
         if(checkIfHeadUUIDAnUtilUUID(node) && checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Both head and tail UUIDs are valid");

            // Update new node
            node.setTask(task);
            node.setProject(task.getProject());

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
               tailNode.setHeadUUID(task.getId());

               taskNodeRepository.save(tailNode);

               // Update new node
               node.setTask(task);
               node.setProject(task.getProject());

               taskNodeRepository.save(node);

               return true;
            }
         }

         // Validate new node against util uuid
         if(checkIfTailUUIDAnUtilUUID(node)) {
            LOGGER.debug("Tail UUID is valid");

            Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
            if(headTaskMaybe.isPresent()) {
               LOGGER.debug("Head node is present");

               // Update head node
               TaskNode headNode = headTaskMaybe.get().getTaskNode();
               headNode.setTailUUID(task.getId());

               taskNodeRepository.save(headNode);

               // Update new node
               node.setTask(task);
               node.setProject(task.getProject());

               taskNodeRepository.save(node);

               return true;
            }
         }

         return false;
      }

      return false;
   }

   // Task need to be in persistent state
   @Transactional
   public boolean insertTaskNodeToLinkedListByStepCase(Task task) {
      TaskNode node = task.getTaskNode();

      Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
      Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());

      if(headTaskMaybe.isPresent() && !tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head node is present while tail node is not present");

         TaskNode headNode = headTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = headNode.getTailUUID().equals(node.getTailUUID());

         // Validate new node against head node and util uuid
         if(checkIfNewTaskNodeValid(node, headNode) && checkIfTailUUIDAnUtilUUID(node) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid while tail UUID is an util UUID");

            // Update new node
            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            // Update head node
            headNode.setTailUUID(task.getId());
            taskNodeRepository.save(headNode);

            return true;
         }

         return false;
      }

      if(!headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head node is not present while tail node is present");

         TaskNode tailNode = tailTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = tailNode.getHeadUUID().equals(node.getHeadUUID());

         // Validate new node against tail node and util uuid
         if(checkIfNewTaskNodeValid(node, tailNode) && checkIfHeadUUIDAnUtilUUID(node) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Tail node is valid while head UUID is an util UUID");

            // Update node
            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            // Update tail node
            tailNode.setHeadUUID(task.getId());
            taskNodeRepository.save(tailNode);

            return true;
         }

         return false;
      }

      if(headTaskMaybe.isPresent() && tailTaskMaybe.isPresent() && !node.getHeadUUID().equals(node.getTailUUID())) {
         LOGGER.debug("Both task and tail nodes are present while head UUID and tail UUID are not equal");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Get the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID())
                 && headNode.getTailUUID().equals(tailTask.getId());

         // Validate new node against head node and check the consecutiveness
         if(checkIfNewTaskNodeValid(node, headNode) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Head node is valid");

            // Update node
            node.setProject(task.getProject());
            node.setTask(task);

            taskNodeRepository.save(node);

            // Update head and tail task nodes
            headNode.setTailUUID(task.getId());
            tailNode.setHeadUUID(task.getId());

            taskNodeRepository.save(headNode);
            taskNodeRepository.save(tailNode);

            return true;
         }

         return false;
      }

      return false;
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

   public void attachProjectToNewTask(Task task) {
      task.setProject(projectRepository.findById(task.getTaskNode().getProjectId()).get());
   }

   public void attachTagToNewTask(Task task) {
      // Populate tag list from the child side
      List<Tag> tagAddedList = tagService.addTagListToProjectAndTask(task.getTagList(), task.getProject(), task);
      task.getTagList().addAll(tagAddedList);
   }

   @Transactional
   public boolean checkIfProjectForTaskExists(Task task) {
      return projectRepository.findById(task.getTaskNode().getProjectId()).isPresent();
   }

   @Transactional
   public boolean checkIfTagListCountValid(Task task) {
      return task.getTagList().size() <= 20;
   }

   @Transactional
   public boolean checkIfSubTaskListCountValid(Task task) {
      return task.getSubTaskList().size() <= 20;
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
   public boolean checkIfNewTaskNodeValid(TaskNode newNode, TaskNode existedNode) {
      return checkIfProjectOfNewTaskNodeValid(newNode, existedNode)
              && checkIfStatusOfNewTaskNodeValid(newNode, existedNode);
   }

   @Transactional
   public boolean checkIfProjectOfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      return node.getProject().getId().equals(existedNode.getProject().getId());
   }

   @Transactional
   public boolean checkIfStatusOfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      return node.getStatus().equals(existedNode.getStatus());
   }

   @Transactional
   public boolean checkIfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      return checkIfProjectOfTaskNodeValid(node, existedNode) && checkIfStatusOfTaskNodeValid(node, existedNode);
   }
}
