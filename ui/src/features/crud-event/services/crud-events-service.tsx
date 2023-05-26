import axios from "axios";

const localhost = 'http://localhost:8080/crud-events/value';

const getCrudEventsByProjectId = (projectId: string) => {
    return axios.get(`${localhost}/${projectId}`, {}).then(res => {
        console.log(res)
        return res
    }).catch(error => {
        if (error.response && error.response.status === 404) {
          return null;
        }

        throw error;
      });;
}

export { getCrudEventsByProjectId }