import axios from "axios"

const url = `${process.env.REACT_APP_BACKEND_URL}/tags`;

const searchTagsByProjectIdAndPrefix = (projectId: string, prefix: string, start: number) => {
    return axios.get(`${url}?projectId=${projectId}&prefix=${prefix}&start=${start}`).then(res => {
        const data = res.data.data;

        return {
            tags: data.tags,
            page: start,
            totalPage: data.totalPage
        }
    })
}

export { searchTagsByProjectIdAndPrefix }