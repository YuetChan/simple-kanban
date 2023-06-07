import axios from "axios"
import { Task } from "../../../types/Task";

const url = `${process.env.REACT_APP_APISERVER_URL}/tasks`;

const createTask = (task: Task) => {
    return axios.post(`${url}`, {
        data: {
            task: task
        }
    }).then(res => {
        console.log(res)
        return res.data.data.task
    });
}

const updateTask = (updatedTask: Task) => {
    return axios.patch(`${url}/${updatedTask.id}`, {
        data: {
            task: updatedTask
        }
    }).then(res => res);
};

const deleteTask = (id: string) => {
    return axios.delete(`${url}/${id}`).then(res => res);
}

const searchTasksByFilterParams = (start: number, pageSize: number, projectId: string, tags: Array<string>) => {
    return axios.get(`${url}?start=${start}&pageSize=${pageSize}&projectId=${projectId}&tags=`).then(res => {
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