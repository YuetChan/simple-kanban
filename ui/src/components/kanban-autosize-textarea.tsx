import React from "react";
import { Stack, TextareaAutosize } from "@mui/material";

import theme from "../theme";

interface AutosizeTextareaProps {
  value?: string,
  label?: string,
  placeholder?: string,

  handleOnTextareaChange?: Function,
}

const KanbanAutosizeTextarea = (props: AutosizeTextareaProps) => {
  const [ value, setValue ] = React.useState(props.value? props.value: '');
  const [ focused, setFocused ] = React.useState(false);

  const focusedStyle = {
    color: theme.palette.primary.main,
    borderColor: "orange",
    border: "0xp solid orange"
  }

  const handleOnTextareaChange = (e: any) => {
    if(props.handleOnTextareaChange) {
      props.handleOnTextareaChange(e);
    }

    setValue(e.target.value);
  }

  const handleOnTextareaFocus = (e: any) => {
    setFocused(true);
  }

  const handleOnTextareaBlur = (e: any) => {
    setFocused(false);
  }

  return (
    <section>
      <Stack direction="column" spacing={ 0.5 }>
        <div >{ props.label? props.label : "" }</div>

        <TextareaAutosize
          value={ value }
          aria-label="autosize-textarea"
          minRows={ 5 }
          placeholder={ props.placeholder? props.placeholder : "" }
          style={
            { 
              // ... focused? focusedStyle: {},
              width: "100%", 
              marginBottom: "12px",
            }}
          onFocus={ handleOnTextareaFocus }
          onBlur={ handleOnTextareaBlur }
          onChange={ handleOnTextareaChange }/>
      </Stack>
    </section>
  )
}

export default KanbanAutosizeTextarea;