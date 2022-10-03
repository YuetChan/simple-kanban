import axios from "axios"

const localhost = "http://localhost:8080/users";

const getUserSecretById = (id) => {
  return axios.get(`${localhost}/${id}/userSecret`).then(res => {
    return res.data.data.secret;
  });
}

const getUserByEmail = (email) => {
  return axios.get(`${localhost}?email=${email}`).then(res => {
    return res.data.data.user;
  })
}

const generateUserSecretById = (id) => {
  return axios.put(`${localhost}/${id}/userSecret`).then(res => {
    return res.data.data.secret;
  })
}

export { getUserSecretById, getUserByEmail, generateUserSecretById }