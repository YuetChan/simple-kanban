import { Tag } from "./Tag"

export interface Task {
  id: string,

  title: string,
  description: string,
  note: string,

  tagList: Array<Tag>,
  subTaskList: Array<any>,

  priority: string,
  assigneeEmail: string,
  dueAt: number,
  
  taskNode: TaskNode
}

export interface TaskNode {
  headUUID: string,
  tailUUID: string,
  status: string,
  projectId: string
}