import React, { useEffect } from "react";

import { Pagination, Stack } from "@mui/material";

import { useTaskUpdateContext } from "../../../providers/task-update";
import { useProjectsCacheContext } from "../../../providers/projects-cache";

import TagArea from "../../tag/components/tag-area";

import { searchTagsByProjectIdAndPrefix } from "../../tag/services/tags-service";

import { Tag } from "../../Tag";

const TagsSearchResultPanel = (props: any) => {
  // ------------------ project ------------------
  const projectsContextState = useProjectsCacheContext().state;

  // ------------------ Html template ------------------
  const cardUpdateContextState = useTaskUpdateContext().state;

  const [ tags, setTags ] = React.useState<Array<Tag>>([]);

  const [ page, setPage ] = React.useState(1);
  const [ totalPage, setTotalPage ] = React.useState(1); 

  const fetchTags = (page: number) => {
    const timeout = setTimeout(() => {  
      searchTagsByProjectIdAndPrefix(projectsContextState?._activeProject?.id, 
        cardUpdateContextState._tagsEditAreaSearchStr, page).then(res => {
          setTags(res.tags);

          setPage(res.page + 1);
          setTotalPage(res.totalPage === 0? 1 : res.totalPage);
        });
    }, 1000);

    return () => clearTimeout(timeout);
  }

  useEffect(() => {
    fetchTags(0);
  }, [ cardUpdateContextState._tagsEditAreaSearchStr]);

  const handleOnPageChange = (e: any, val: number) => {
    if(cardUpdateContextState._lastFocusedArea === 'tagsEditArea') {
      fetchTags(val - 1);
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
            tags.map(tag => {
            return (<TagArea tag={ tag.name } showDelete={ false } />)
            })
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