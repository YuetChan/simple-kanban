import React, { useEffect } from "react";

import {  useSelector } from "react-redux";

import { Pagination, Stack } from "@mui/material";

import { searchTagsByProjectIdAndPrefix } from "../../tag/services/tags-service";

import TagArea from "../../tag/components/tag-area";

import { Tag } from "../../../types/Tag";

import { AppState } from "../../../stores/app-reducers";

const TagsSearchResultPanel = (props: any) => {
  // ------------------ Project cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Task create ------------------
  const taskCreateState = useSelector((state: AppState) => state.TaskCreate);

  // ------------------ Tags search result panel ------------------
  const [ tags, setTags ] = React.useState<Array<Tag>>([]);

  const [ page, setPage ] = React.useState(1);
  const [ totalPage, setTotalPage ] = React.useState(1); 

  const fetchTags = (projectId: string, page: number) => {
    const timeout = setTimeout(() => {  
      searchTagsByProjectIdAndPrefix(projectId, 
        taskCreateState._tagsEditAreaSearchStr, page).then(res => {
          setTags(res.tags);

          setPage(res.page + 1);
          setTotalPage(res.totalPage === 0? 1 : res.totalPage);
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }

  useEffect(() => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      fetchTags(activeProject.id, 0);
    }
  }, [ taskCreateState._tagsEditAreaSearchStr]);

  const handleOnPageChange = (e: any, val: number) => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject && taskCreateState._lastFocusedArea === 'tagsEditArea') {
      fetchTags(activeProject.id, val - 1);
    }
  }

  // ------------------ Html template ------------------
  return (
    <section style={{ height: "100%" }}>
      <Stack 
        direction="column" 
        justifyContent="space-between"         
        style={{
          height: "100%",
          padding: "4px 0px 4px 4px"
          }}>
        <Stack                          
          direction="row"
          spacing={ 0.5 }
          style={{  
            flexWrap: "wrap",
            overflowY: "auto"}}>
          {
            tags.map(tag =>  (<TagArea tag={ tag.name } showDelete={ false } />))
          }
        </Stack>

        <Pagination 
          color="primary"
          count={ totalPage } 
          page={ page } 
          onChange={ handleOnPageChange }
          style={{ paddingTop: "4px" }} />
      </Stack>
    </section>
  )
}

export default TagsSearchResultPanel;