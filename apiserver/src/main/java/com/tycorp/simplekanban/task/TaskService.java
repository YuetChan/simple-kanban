package com.tycorp.simplekanban.task;

import com.tycorp.simplekanban.project.Project;
import com.tycorp.simplekanban.project.ProjectRepository;
import com.tycorp.simplekanban.project.ProjectUUIDRepository;
import com.tycorp.simplekanban.tag.Tag;
import com.tycorp.simplekanban.tag.TagService;
import com.tycorp.simplekanban.task.value.Status;
import com.tycorp.simplekanban.user.UserRepository;
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
   
   @Autowired
   private UserRepository userRepository;

   @Transactional
   public Task create(Task task) {
      LOGGER.trace("Enter create(task)");

      if(!checkIfTagListCountValid(task) || !checkIfSubTaskListCountValid(task)) {
         LOGGER.debug("Tag list or sub task list count exceed maximum");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "TagList or subTaskList counts exceed maximum");
      }

      // Check if project is existed and set project
      if(!checkIfProjectForTaskExists(task)) {
         LOGGER.debug("Given project is invalid");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Given project is invalid");
      }

      attachTaskToProject(task);

      LOGGER.debug("Tag list temporarily removed from task");
      List<Tag> tagList = task.getTagList();
      task.setTagList(new ArrayList<>());

      LOGGER.debug("Task node temporarily removed from task");
      TaskNode node = task.getTaskNode();
      task.setTaskNode(new TaskNode());

      // Get task with persistent state
      task = taskRepository.save(task);
      LOGGER.debug("Task created successfully");

      task.setTaskNode(node);

      if(!insertTaskToLinkedList(task)) {
         LOGGER.debug("Failed to insert task to linkedList");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to insert task to linkedList");
      }

      // Populate tag list from the child side
      List<Tag> tagAddedList = tagService.addTagListToProjectAndTask(tagList, task.getProject(), task);
      task.getTagList().addAll(tagAddedList);

      return task;
   }

   // Original task need to be in persistent state
   @Transactional
   public Task update(Task originalTask, Task updatedTask) {
      LOGGER.trace("Enter update(originalTask, updatedTask)");

      if(!checkIfTagListCountValid(originalTask) || !checkIfSubTaskListCountValid(originalTask)) {
         LOGGER.debug("Tag list or sub task list count exceed maximum");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "tagList or subTaskList count exceed maximum");
      }

      // Update task properties
      originalTask.setTitle(updatedTask.getTitle());

      originalTask.setDescription(updatedTask.getDescription());
      originalTask.setNote(updatedTask.getNote());

      originalTask.setAssigneeEmail(updatedTask.getAssigneeEmail());
      originalTask.setDueAt(updatedTask.getDueAt());

      originalTask.setPriority(updatedTask.getPriority());

      originalTask.setSubTaskList(updatedTask.getSubTaskList());

      // Detach task node from and attach task node to linkedList
      if(detachTaskNodeFromLinkedList(originalTask)) {
         TaskNode updatedNode = updatedTask.getTaskNode();

         if(updatedNode.getStatus().equals(Status.ARCHIVE)) {
            updatedNode.setTailUUID("");
            updatedNode.setHeadUUID("");

            taskNodeRepository.save(updatedNode);
         }else {
            if(!reinsertTaskNodeToLinkedList(originalTask,
                    updatedNode.getHeadUUID(), updatedNode.getTailUUID(),
                    updatedNode.getStatus())) {
               LOGGER.debug("Failed to reinsert task node to linkedlist");
               throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update task node.");
            }
         }
      }else {
         LOGGER.debug("Failed to detach task node from linkedlist");
         throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to update task node.");
      }

      LOGGER.debug("Task node detached");

      // Remove tag list from or add tag to task
      List<Tag> tagList = originalTask.getTagList();
      List<String> tagListNames = tagList.stream()
              .map(tag -> tag.getName())
              .collect(Collectors.toList());

      List<Tag> updatedTagList = updatedTask.getTagList();
      List<String> updatedTagListNames = updatedTagList.stream()
              .map(tag -> tag.getName())
              .collect(Collectors.toList());

      List<Tag> tagToRemoveList = tagList.stream()
              .filter(tag -> !updatedTagListNames.contains(tag.getName()))
              .collect(Collectors.toList());
      List<Tag> tagToAddList = updatedTagList.stream()
              .filter(tag -> !tagListNames.contains(tag.getName()))
              .collect(Collectors.toList());

      // Populate from the child side
      List<Tag> tagAddedList = tagService.addTagListToProjectAndTask(tagToAddList,
              originalTask.getProject(), originalTask);
      originalTask.getTagList().addAll(tagAddedList);

      // Remove from parent side
      originalTask.removeTags(tagToRemoveList);
      originalTask = taskRepository.save(originalTask);

      LOGGER.debug("Task updated successfully");

      return taskRepository.save(originalTask);
   }

   @Transactional
   public void delete(Task task) {
      LOGGER.trace("Enter delete(task)");

      // Delete task
      task.setActive(false);
      taskRepository.save(task);

      // Detach task from linkedlist
      // It should always return true
      detachTaskNodeFromLinkedList(task);

      LOGGER.debug("Task deleted successfully");
   }

   // Task need to be in persistent state
   @Transactional
   public boolean detachTaskNodeFromLinkedList(Task task) {
      LOGGER.trace("Enter detachTaskNodeFromLinkedList(task)");

      TaskNode node = task.getTaskNode();

      if(checkIfHeadUUIDAnUtilUUID(node) && checkIfTailUUIDAnUtilUUID(node)) {
         return true;
      }

      if(checkIfHeadUUIDAnUtilUUID(node)) {
         TaskNode tailNode = taskRepository.findById(node.getTailUUID()).get().getTaskNode();
         tailNode.setHeadUUID(node.getHeadUUID());

         taskNodeRepository.save(tailNode);
      }

      if(checkIfTailUUIDAnUtilUUID(node)) {
         TaskNode headNode = taskRepository.findById(node.getHeadUUID()).get().getTaskNode();
         headNode.setTailUUID(node.getTailUUID());

         taskNodeRepository.save(headNode);
      }

      if(!checkIfHeadUUIDAnUtilUUID(node) && !checkIfTailUUIDAnUtilUUID(node)) {
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
      LOGGER.trace("Enter attachTaskNodeToLinkedList(task)");
      return reinsertTaskNodeToLinkedListByBaseCase(task, headUUID, tailUUID, status)
              || reinsertTaskNodeToLinkedListByStepCase(task, headUUID, tailUUID, status);
   }

   // Task need to be in persistent state
   @Transactional
   public boolean reinsertTaskNodeToLinkedListByBaseCase(Task task, String headUUID, String tailUUID, Status status) {
      LOGGER.trace("Enter reinsertTaskNodeToLinkedListByBaseCase(task, headUUID, tailUUID, status)");

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
            LOGGER.debug("Head UUID and tail UUID are valid");

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
      LOGGER.trace("Enter reinsertTaskNodeToLinkedListByStepCase(task, headUUID, tailUUID, status)");

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
            LOGGER.debug("Validate head node and tail UUID  is an util UUID");

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
            LOGGER.debug("Validate tail node and head UUID is an util UUID");

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

      if(headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()
              && !headUUID.equals(tailUUID)) {
         LOGGER.debug("Both head, tail tasks are present while head UUID not equal to tail UUID");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Get the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID())
                 && headNode.getTailUUID().equals(tailTask.getId());

         // Validate node against head node and check the consecutiveness
         if(checkIfTaskNodeValid(node, headNode) && areHeadAndTailNodesConsecutive) {
            LOGGER.debug("Validate head node");

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
   public boolean insertTaskToLinkedList(Task task) {
      LOGGER.trace("Enter insertTaskPosition(task)");
      return insertTaskNodeToLinkedListByBaseCase(task) || insertTaskNodeToLinkedListByStepCase(task);
   }

   // Task need to be in persistent state
   @Transactional
   public boolean insertTaskNodeToLinkedListByBaseCase(Task task) {
      LOGGER.trace("Enter insertTaskNodeToLinkedListByBaseCase(task)");

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
      LOGGER.trace("Enter insertTaskNodeToLinkedListByStepCase(task)");

      TaskNode node = task.getTaskNode();

      Optional<Task> headTaskMaybe = taskRepository.findById(node.getHeadUUID());
      Optional<Task> tailTaskMaybe = taskRepository.findById(node.getTailUUID());

      if(headTaskMaybe.isPresent() && !tailTaskMaybe.isPresent()) {
         LOGGER.debug("Head node is present while tail node is not present");

         TaskNode headNode = headTaskMaybe.get().getTaskNode();
         boolean areHeadAndTailNodesConsecutive = headNode.getTailUUID().equals(node.getTailUUID());

         // Validate new node against head node and util uuid
         if(checkIfNewTaskNodeValid(node, headNode) && checkIfTailUUIDAnUtilUUID(node) && areHeadAndTailNodesConsecutive) {
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

      if(headTaskMaybe.isPresent() && tailTaskMaybe.isPresent()
              && !node.getHeadUUID().equals(node.getTailUUID())) {
         LOGGER.debug("Both task and tail nodes exist while head UUID not equal to tail UUID");

         Task headTask = headTaskMaybe.get();
         Task tailTask = tailTaskMaybe.get();

         TaskNode headNode = headTask.getTaskNode();
         TaskNode tailNode = tailTask.getTaskNode();

         // Get the consecutiveness of head and tail nodes
         boolean areHeadAndTailNodesConsecutive = headTask.getId().equals(tailNode.getHeadUUID()) && headNode.getTailUUID().equals(tailTask.getId());

         // Validate new node against head node and check the consecutiveness
         if(checkIfNewTaskNodeValid(node, headNode) && areHeadAndTailNodesConsecutive) {
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
      LOGGER.trace("Enter validateHeadUUIDAnUtilUUID(node)");

      String headUUID = node.getHeadUUID();
      Status status = node.getStatus();

      if(status.equals(Status.BACKLOG)) {
         return projectUUIDRepository.findByUuid1(headUUID).isPresent();
      }

      if(status.equals(Status.TODO)) {
         return projectUUIDRepository.findByUuid3(headUUID).isPresent();
      }

      if(status.equals(Status.IN_PROGRESS)) {
         return projectUUIDRepository.findByUuid5(headUUID).isPresent();
      }

      if(status.equals(Status.DONE)) {
         return projectUUIDRepository.findByUuid7(headUUID).isPresent();
      }

      return false;
   }

   @Transactional
   public boolean checkIfTailUUIDAnUtilUUID(TaskNode node) {
      LOGGER.trace("Enter checkIfTailUUIDAnUtilUUID(node)");

      String tailUUID = node.getTailUUID();
      Status status = node.getStatus();

      if(status.equals(Status.BACKLOG)) {
         return projectUUIDRepository.findByUuid2(tailUUID).isPresent();
      }

      if(status.equals(Status.TODO)) {
         return projectUUIDRepository.findByUuid4(tailUUID).isPresent();
      }

      if(status.equals(Status.IN_PROGRESS)) {
         return projectUUIDRepository.findByUuid6(tailUUID).isPresent();
      }

      if(status.equals(Status.DONE)) {
         return projectUUIDRepository.findByUuid8(tailUUID).isPresent();
      }

      return false;
   }

   public void attachTaskToProject(Task task) {
      LOGGER.trace("Enter attachTaskToProject(task)");
      Project project = projectRepository.findById(task.getTaskNode().getProjectId()).get();
      task.setProject(project);
   }

   @Transactional
   public boolean checkIfProjectForTaskExists(Task task) {
      LOGGER.trace("Enter checkIfProjectForTaskExists(task)");
      return projectRepository.findById(task.getTaskNode().getProjectId()).isPresent();
   }

   @Transactional
   public boolean checkIfTagListCountValid(Task task) {
      LOGGER.trace("Enter checkIfTagListCountValid(task)");
      return task.getTagList().size() <= 20;
   }

   @Transactional
   public boolean checkIfSubTaskListCountValid(Task task) {
      LOGGER.trace("Enter checkIfSubTaskListCountValid(task)");
      return task.getSubTaskList().size() <= 20;
   }

   @Transactional
   public boolean checkIfProjectOfNewTaskNodeValid(TaskNode newNode, TaskNode originalNode) {
      LOGGER.trace("Enter checkIfProjectOfNewTaskNodeValid(newNode, existedNode)");
      return newNode.getProjectId().equals(originalNode.getProject().getId());
   }

   @Transactional
   public boolean checkIfStatusOfNewTaskNodeValid(TaskNode newNode, TaskNode originalNode) {
      LOGGER.trace("Enter checkIfStatusOfNewTaskNodeValid(newNode, originalNode)");
      return newNode.getStatus().equals(originalNode.getStatus());
   }

   @Transactional
   public boolean checkIfNewTaskNodeValid(TaskNode newNode, TaskNode existedNode) {
      LOGGER.trace("Enter checkIfNewTaskNodeValid(newNode, existedNode)");
      return checkIfProjectOfNewTaskNodeValid(newNode, existedNode)
              && checkIfStatusOfNewTaskNodeValid(newNode, existedNode);
   }

   @Transactional
   public boolean checkIfProjectOfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      LOGGER.trace("Enter checkIfProjectOfTaskNodeValid(newNode, existedNode)");
      return node.getProject().getId().equals(existedNode.getProject().getId());
   }

   @Transactional
   public boolean checkIfStatusOfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      LOGGER.trace("Enter checkIfStatusOfTaskNodeValid(newNode, existedNode)");
      return node.getStatus().equals(existedNode.getStatus());
   }

   @Transactional
   public boolean checkIfTaskNodeValid(TaskNode node, TaskNode existedNode) {
      LOGGER.trace("Enter checkIfTaskNodeValid(newNode, existedNode)");
      return checkIfProjectOfTaskNodeValid(node, existedNode)
              && checkIfStatusOfTaskNodeValid(node, existedNode);
   }
}
