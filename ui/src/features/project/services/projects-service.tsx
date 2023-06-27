import axios from "axios";

import { Project } from "../../../types/Project";

const url = `${process.env.REACT_APP_BACKEND_URL}/projects`;

const getProjectById = (id: string) => {
    return axios.get(`${url}/${id}`).then(res => {
        return res.data.data.project;
    });
}

const searchProjectsByUserEmail = (email: string, start: number) => {
    return axios.get(`${url}?userEmail=${email}&start=${start}`).then(res => {
        const data = res.data.data;

        return {
            projects: data.projects,
            page: data.page,
            totalPage: data.totalPage
        };
    });
}

const searchShareProjectsByUserEmail = (email: string, start: number) => {
    return axios.get(`${url}/share?userEmail=${email}&start=${start}`).then(res => {
        const data = res.data.data;

        return {
            projects: data.projects,
            page: data.page,
            totalPage: data.totalPage
        };
    });
}

const searchProjectsByNotUserEmail = (email: string, start: number) => {
    return axios.get(`${url}/not?userEmail=${email}&start=${start}`).then(res => {
        const data = res.data.data;

        return {
            projects: data.projects,
            page: data.page,
            totalPage: data.totalPage
        };
    });
}

const createProject = (project: Project) => {
    return axios.post(`${url}`, {
        data: {
            project: project
        }
    }).then(res => {
        console.log(res)
        return res.data.data; 
    });
}

const deleteProject = (id: string) => {
    return axios.delete(`${url}/${id}`).then(res => res);
}

const updateProjectById = (id: string, project: Project) => {
    return axios.patch(`${url}/${id}`, {
        data: {
            project: project
        }
    }).then(res => res)
}

export {
    getProjectById, 
    searchProjectsByUserEmail, searchProjectsByNotUserEmail,
    searchShareProjectsByUserEmail, createProject, deleteProject,
    updateProjectById
}