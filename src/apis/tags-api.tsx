import axios from "axios"

const localhost = "http://localhost:8080/tags";

const searchTagsByProjectIdAndPrefix = (projectId, prefix, start) => {
  return axios.get(`${localhost}?projectId=${projectId}&prefix=${prefix}&start=${start}`).then(res => {
    const data = res.data.data;

    return {
      tags: data.tags,
      page: start,
      totalPage: data.totalPage
    }
  })
}

export { searchTagsByProjectIdAndPrefix }