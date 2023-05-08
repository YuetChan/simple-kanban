import React, { useEffect } from "react";

import { Stack, TextField } from "@mui/material";

import TagArea from "./tag-area";

interface TagsEditsAreaProps {
  label?: string,
  disabled?: boolean,
  inputRef?: any,
  tags?: Array<string>,
  
  handleOnTagsChange?: Function,
  handleOnTextFieldChange?: Function,
  handleOnKeyPress?: Function,
  handleOnFocus?: Function,
  handleOnBlur?: Function
}

const TagsEditArea = (props: TagsEditsAreaProps) => {
  // ------------------ Tag edit areas ------------------ 
  const [ tags, setTags ] = React.useState<Array<string>>([])
  const [ tagInput, setTagInput ] = React.useState('');

  useEffect(() => {
    setTags(props.tags? props.tags : []);
  }, []);

  useEffect(() => {
    if(props.handleOnTagsChange) {
      props.handleOnTagsChange(tags);
    } 
  }, [ tags ]);

  const handleOnDeleteClick = (e: any, tagToDelete: string) => {
    setTags(tags.filter(tag => tag !== tagToDelete));
  }

  const handleOnTextFieldChange = (e: any) => {
    if(props.handleOnTextFieldChange) {
      props.handleOnTextFieldChange(e);
    }

    setTagInput(e.target.value);
  }

  const handleOnKeyPress = (e: any) => {
    if(e.keyCode === 13) {
      const newTag = e.target.value;

      if(tags.filter(tag => tag === newTag).length <= 0) {
        setTags([... tags, newTag]);
        setTagInput("");
      }
    }

    if(props.handleOnKeyPress) {
      props.handleOnKeyPress(e);
    }
  }

  const handleOnFocus = (e: any) => {
    if(props.handleOnFocus) {
      props.handleOnFocus(e);
    }
  }

  const handleOnBlur = () => {
    if(props.handleOnBlur) {
      props.handleOnBlur();
    }
  }

  // ------------------ Html template ------------------  
  return (
    <section>
      <Stack direction="column" alignItems="start" spacing={ 1 }>
        <TextField 
          style={{ width: "150px" }}
          label={ props.label? props.label : ""  } 
          disabled={ props.disabled !== undefined ? props.disabled : true }
          variant="standard" 
          inputRef={ props.inputRef } 
          value={ tagInput } 
          onChange={ (e) => handleOnTextFieldChange(e) }
          onKeyDown={ (e) => handleOnKeyPress(e) }
          onFocus= { (e) => handleOnFocus(e) }
          onBlur={ handleOnBlur } />
          {
            tags.length > 0 
            ? (
                <Stack 
                  direction="row" 
                  spacing={ 0.5 } 
                  style={{ flexWrap: "wrap" }} >
                  {
                    tags.map(tag => {
                      return (
                        <TagArea 
                          tag={ tag }
                          showDelete={ true }
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

export default TagsEditArea;