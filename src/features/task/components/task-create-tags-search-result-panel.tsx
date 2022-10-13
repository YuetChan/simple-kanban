import React, { useEffect } from "react";

import { Pagination, Stack } from "@mui/material";

import { useTaskCreateContext } from "../../../providers/task-create";
import { useProjectsCacheContext } from "../../../providers/projects-cache";

import { searchTagsByProjectIdAndPrefix } from "../../tag/services/tags-service";

import TagArea from "../../tag/components/tag-area";

import { Tag } from "../../../types/Tag";

const TagsSearchResultPanel = (props: any) => {
  // ------------------ Project cache ------------------
  const projectsCacheContextState = useProjectsCacheContext().state;

  // ------------------ Task create ------------------
  const taskCreateContextState = useTaskCreateContext().state;

  // ------------------ Tags search result panel ------------------
  const [ tags, setTags ] = React.useState<Array<Tag>>([]);

  const [ page, setPage ] = React.useState(1);
  const [ totalPage, setTotalPage ] = React.useState(1); 

  const fetchTags = (projectId: string, page: number) => {
    const timeout = setTimeout(() => {  
      searchTagsByProjectIdAndPrefix(projectId, 
        taskCreateContextState._tagsEditAreaSearchStr, page).then(res => {
          setTags(res.tags);

          setPage(res.page + 1);
          setTotalPage(res.totalPage === 0? 1 : res.totalPage);
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }

  useEffect(() => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject) {
      fetchTags(activeProject.id, 0);
    }
  }, [ taskCreateContextState._tagsEditAreaSearchStr]);

  const handleOnPageChange = (e: any, val: number) => {
    const activeProject = projectsCacheContextState._activeProject;
    if(activeProject && taskCreateContextState._lastFocusedArea === 'tagsEditArea') {
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