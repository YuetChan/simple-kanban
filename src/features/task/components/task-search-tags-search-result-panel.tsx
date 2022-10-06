import React, { useEffect } from "react";

import { Pagination, Stack } from "@mui/material";

import { useProjectsCacheContext } from "../../../providers/projects-cache";
import { useTagsSearchResultPanelContext } from "../../../providers/tags-search-result-panel";
import { useTasksSearchContext } from "../../../providers/tasks-search";

import TagArea from "../../tag/components/tag-area";

import { searchTagsByProjectIdAndPrefix } from "../../tag/services/tags-service";

import { Tag } from "../../Tag";

const KanbanTagsResultPanel = (props: any) => {
  const projectsContextState = useProjectsCacheContext().state;

  const tagsSearchResultPanelDispatch = useTagsSearchResultPanelContext().Dispatch;

  const drawerContextState = useTasksSearchContext().state;
  const drawerContextDispatch = useTasksSearchContext().Dispatch;

  const [ tags, setTags ] = React.useState<Array<Tag>>([]);

  const [ page, setPage ] = React.useState(1);
  const [ totalPage, setTotalPage ] = React.useState(1);

  const fetchTags = (page: number) => {
    const timeout = setTimeout(() => {  
      searchTagsByProjectIdAndPrefix(projectsContextState?._activeProject?.id, 
        drawerContextState._tagsEditAreaSearchStr, page).then(res => {
          setTags(res.tags);

          setPage(res.page + 1);
          setTotalPage(res.totalPage === 0? 1 : res.totalPage);
        });
    }, 1000);

    return () => clearTimeout(timeout);  
  }

  const handlePageChange = (e: any, val: number) => {
    if(projectsContextState._activeProject) {
      fetchTags(val - 1); 
    }
  } 

  useEffect(() => {
    if(projectsContextState._activeProject) {
      fetchTags(0); 
    }
  }, [ drawerContextState._tagsEditAreaSearchStr ]);

  useEffect(() => {
    if(projectsContextState._activeProject) {
      fetchTags(0); 
    }
  }, [ projectsContextState._activeProject ]);

  const handleOnMouseEnter = () => {
    tagsSearchResultPanelDispatch({
      type: 'mouse_enter'
    });
  }

  const handleOnMouseLeave = () => {
    tagsSearchResultPanelDispatch({
      type: 'mouse_leave'
    });

    drawerContextDispatch({
      type: 'tagsEditArea_setFocus'
    });
  }

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
          spacing={0.5}
          style={{  
            flexWrap: "wrap",
            overflowY: "auto",
            }}>
          { 
            tags.length > 0
            ? (
              tags.map(tag => {
                return (<TagArea tag={ tag.name } showDelete={ false } />)
              })
            )
            : null
          }
        </Stack>

        <Pagination 
          color="primary"
          count={ totalPage } 
          page={ page } 
          onChange={ handlePageChange }
          style={{ paddingTop: "4px" }}/>
      </Stack>
    </section>
  )
}

export default KanbanTagsResultPanel;