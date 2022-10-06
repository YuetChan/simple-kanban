import axios from "axios"

const localhost = 'http://localhost:8080/projects';

const getProjectById = (id) => {
  return axios.get(`${localhost}/${id}`).then(res => {
    return res.data.data.project;
  });
}

const searchProjectsByUserEmail = (email, start) => {
  return axios.get(`${localhost}?userEmail=${email}&start=${start}`).then(res => {
    const data = res.data.data;

    return {
      projects: data.projects,
      page: data.page,
      totalPage: data.totalPage
    };
  });
}

const searchShareProjectsByUserEmail = (email, start) => {
  return axios.get(`${localhost}/share?email=${email}&start=${start}`).then(res => {
    const data = res.data.data;

    return {
      projects: data.projects,
      page: data.page,
      totalPage: data.data.totalPage
    };
  });
}

const createProject = (project) => {
  return axios.post(`${localhost}`, {
    data: {
      project: project
    }
  }).then(res => res.data.data.project);
}

const deleteProject = (id) => {
  return axios.delete(`${localhost}/${id}`).then(res => res);
}

const updateProjectById = (id, project, collaboratorEmailSecretMap) => {
  return axios.patch(`${localhost}/${id}`, {
    data: {
      project: project,
      collaboratorEmailSecretMap: collaboratorEmailSecretMap
    }
  }).then(res => res)
}

const updateProjectPermissionList = (id, projectPermissionDtos) => {
  return axios.patch(`${localhost}/${id}/permissions`, {
    data: {
      projectPermissions: projectPermissionDtos
    }
  }).then(res => res)
}


export {
  getProjectById, 
  searchProjectsByUserEmail, 
  searchShareProjectsByUserEmail, createProject, deleteProject,
  updateProjectById, updateProjectPermissionList
}