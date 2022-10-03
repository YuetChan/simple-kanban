import axios from "axios"

const localhost = "http://localhost:8080/tasks";

const createTask = (task) => {
  return axios.post(`${localhost}`, {
    data: {
      task: task
    }
  }).then(res => {
    console.log(res)
    return res.data.data.task
  });
}

const updateTask = (updatedTask) => {
  return axios.patch(`${localhost}/${updatedTask.id}`, {
    data: {
      task: updatedTask
    }
  }).then(res => res);
};

const deleteTask = (id) => {
  return axios.delete(`${localhost}/${id}`).then(res => res);
}

const searchTasksByFilterParams = (start, pageSize, projectId, tags) => {
  return axios.get(`${localhost}?start=${start}&pageSize=${pageSize}&projectId=${projectId}&tags=`).then(res => {
    const data = res.data.data;

    return {
      tasks: data.tasks,
      page: start,
      totalPage: data.totalPage
    };
  })
}



export { createTask, updateTask, deleteTask, searchTasksByFilterParams };