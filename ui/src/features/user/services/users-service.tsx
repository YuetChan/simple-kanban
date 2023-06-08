import axios from "axios"

const url = `${process.env.REACT_APP_backend_URL}/users`;

const getUserSecretById = (id: string) => {
    return axios.get(`${url}/${id}/userSecret`).then(res => {
        return res.data.data.secret;
    });
}

const getUserByEmail = (email: string) => {
    return axios.get(`${url}?email=${email}`).then(res => {
        return res.data.data.user;
    })
}

const generateUserSecretById = (id: string) => {
    return axios.put(`${url}/${id}/userSecret`).then(res => {
        return res.data.data.secret;
    })
}

export { getUserSecretById, getUserByEmail, generateUserSecretById }