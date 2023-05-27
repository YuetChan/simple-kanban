import axios from "axios";

const url = `${process.env.REACT_APP_API_SERVER}/crud-events/value`;

const getCrudEventsByProjectId = (projectId: string) => {
    return axios.get(`${url}/${projectId}`, {}).then(res => {
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