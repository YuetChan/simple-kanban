import React, { useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Pagination, Stack } from "@mui/material";

import TagArea from "../../tag/components/tag-area";

import { searchTagsByProjectIdAndPrefix } from "../../tag/services/tags-service";

import { Tag } from "../../../types/Tag";

import { actions as tagsSearchResultPanelActions } from "../../../stores/tags-search-result-panel-slice";
import { actions as tasksSearchActions } from "../../../stores/tasks-search-slice";

import { AppState } from "../../../stores/app-reducers";

const TagsSearchResultPanel = (props: any) => {
  // ------------------ Dispatch ------------------
  const dispatch = useDispatch()

  // ------------------ Projects cache ------------------
  const projectsCacheState = useSelector((state: AppState) => state.ProjectsCache);

  // ------------------ Task search cache ------------------
  const tasksSearchState = useSelector((state: AppState) => state.TasksSearch);
  const { setTagsEditAreaFocused } = tasksSearchActions;

  // ------------------ Tags search result panel ------------------
  const { mouseEnter, mouseLeave } = tagsSearchResultPanelActions;

  const [ tags, setTags ] = React.useState<Array<Tag>>([]);

  const [ page, setPage ] = React.useState(1);
  const [ totalPage, setTotalPage ] = React.useState(1);

  const fetchTags = (projectId: string, page: number) => {
    const timeout = setTimeout(() => {  
      searchTagsByProjectIdAndPrefix(projectId, 
        tasksSearchState._tagsEditAreaSearchStr, page).then(res => {
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
  }, [ tasksSearchState._tagsEditAreaSearchStr ]);

  useEffect(() => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      fetchTags(activeProject.id, 0); 
    }
  }, [ projectsCacheState._activeProject ]);

  const handleOnPageChange = (e: any, val: number) => {
    const activeProject = projectsCacheState._activeProject;
    if(activeProject) {
      fetchTags(activeProject.id, val - 1); 
    }
  } 

  const handleOnMouseEnter = () => {
    dispatch(mouseEnter());
  }

  const handleOnMouseLeave = () => {
    dispatch(mouseLeave());
    dispatch(setTagsEditAreaFocused());
  }

  // ------------------ Html template ------------------
  return (
    <section style={{
      width: "360px",
      height: "210px",

      position: "fixed",
      bottom: "0px",
      right: "4px",
      zIndex: "99999",
      
      backgroundColor: "white",
      borderRadius: "4px",
      padding: "4px 4px 0px 4px"
      }}
      onMouseEnter={ handleOnMouseEnter }
      onMouseLeave={ handleOnMouseLeave }>
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
            overflowY: "auto",
            }}>
          { 
            tags.length > 0
            ? tags.map(tag =>  (<TagArea tag={ tag.name } showDelete={ false } />))
            : null
          }
        </Stack>

        <Pagination 
          color="primary"
          count={ totalPage } 
          page={ page } 
          onChange={ handleOnPageChange }
          style={{ paddingTop: "4px" }}/>
      </Stack>
    </section>
  )
}

export default TagsSearchResultPanel;