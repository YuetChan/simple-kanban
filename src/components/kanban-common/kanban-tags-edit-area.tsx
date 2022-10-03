import React from "react";
import { useEffect } from "react";

import { Stack, TextField } from "@mui/material";

import KanbanTagArea from "./kanban-tags-area";

const KanbanTagsEditArea = (props: any) => {
  const [ tags, setTags ] = React.useState([])
  const [ tagInput, setTagInput ] = React.useState('');

  useEffect(() => {
    setTags(props.tags? props.tags : []);
  }, []);

  useEffect(() => {
    if(props.handleTagsChange) {
      props.handleTagsChange(tags);
    } 
  }, [tags]);

  const handleOnDeleteClick = (e, tagToDelete) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  }

  const handleOnTextFieldChange = (e) => {
    if(props.handleOnTextFieldChange) {
      props.handleOnTextFieldChange(e);
    }

    setTagInput(e.target.value);
  }

  const handleOnKeyPress = (e) => {
    const newTag = e.target.value;

    if(e.keyCode === 13) {
      if(tags.filter(tag => tag === newTag).length <= 0) {
        setTags([... tags, newTag]);
        setTagInput('');
      }
    }

    if(props.handleOnKeyPress) {
      props.handleOnKeyPress(e);
    }
  }

  const handleOnFocus = (e) => {
    if(props.handleOnFocus) {
      props.handleOnFocus(e);
    }
  }

  const handleOnBlur = () => {
    if(props.handleOnBlur) {
      props.handleOnBlur();
    }
  }

  return (
    <section>
      <Stack direction="column" alignItems="start" spacing={ 1 }>
        <TextField 
          label={ props.label } 
          disabled={ props.disabled }
          variant="standard" 
          onChange={ (e) => handleOnTextFieldChange(e) }
          onKeyDown={ handleOnKeyPress }
          onFocus= { (e) => handleOnFocus(e) }
          onBlur={ handleOnBlur }
          value={ tagInput } 
          style={{ width: "150px" }}
          inputRef={ props.inputRef }/>
          {
            tags.length > 0 
            ? (
                <Stack 
                  direction="row" 
                  spacing={ 0.5 } 
                  style={{ flexWrap: "wrap" }}>
                  {
                    tags.map(tag => {
                      return (
                        <KanbanTagArea 
                          tag={tag}
                          showDelete={true}
                          handleOnDeleteClick={ handleOnDeleteClick } />
                      )
                    })
                  }
                </Stack>
              )
            : null
          }
      </Stack>
    </section>
  )
}

export default KanbanTagsEditArea;