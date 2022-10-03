import React from "react";
import { Stack, TextareaAutosize } from "@mui/material";

import theme from "../../theme";

const KanbanAutosizeTextarea = (props: any) => {
  const [ value, setValue ] = React.useState(props.value? props.value: '');
  const [ focused, setFocused ] = React.useState(false);

  const focusedStyle = {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  }

  const handleOnTextareaChange = (e) => {
    if(props.handleOnTextareaChange) {
      props.handleOnTextareaChange(e)
    }

    setValue(e.target.value);
  }

  const handleOnTextareaFocus = (e) => {
    setFocused(true);
  }

  const handleOnTextareaBlur = (e) => {
    setFocused(false);
  }

  return (
    <section>
      <Stack direction="column" spacing={0.5}>
        <div style={ focused? focusedStyle : {} } >{ props.label }</div>

        <TextareaAutosize
          value={ value }
          aria-label="autosize-textarea"
          minRows={5}
          placeholder={props.placeholder}
          style={
            { 
              ... focused? focusedStyle: {},
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