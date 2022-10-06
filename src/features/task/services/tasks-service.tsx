import axios from "axios"
import { Task } from "../../Task";

const localhost = "http://localhost:8080/tasks";

const createTask = (task: Task) => {
  return axios.post(`${localhost}`, {
    data: {
      task: task
    }
  }).then(res => {
    console.log(res)
    return res.data.data.task
  });
}

const updateTask = (updatedTask: Task) => {
  return axios.patch(`${localhost}/${updatedTask.id}`, {
    data: {
      task: updatedTask
    }
  }).then(res => res);
};

const deleteTask = (id: string) => {
  return axios.delete(`${localhost}/${id}`).then(res => res);
}

const searchTasksByFilterParams = (start: number, pageSize: number, projectId: string, tags) => {
  return axios.get(`${localhost}?start=${start}&pageSize=${pageSize}&projectId=${projectId}&tags=`).then(res => {
    const data = res.data.data;

    return {
      tasks: data.tasks,
      page: start,
      totalPage: data.totalPage
    };
  })
}

export { 
  createTask, updateTask, deleteTask, 
  searchTasksByFilterParams 
};