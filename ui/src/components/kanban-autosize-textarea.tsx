import React from "react";
import { Stack, TextareaAutosize } from "@mui/material";

interface AutosizeTextareaProps {
  value?: string,
  label?: string,
  placeholder?: string,

  handleOnTextareaChange?: Function,
}

const KanbanAutosizeTextarea = (props: AutosizeTextareaProps) => {
    const [ value, setValue ] = React.useState(props.value? props.value: "");

    const [ focused, setFocused ] = React.useState(false);

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
        <Stack direction="column" spacing={ 0.5 }>
            <div>{ props.label? props.label : "" }</div>

            <TextareaAutosize
                value={ value }
                minRows={ 5 }
                placeholder={ props.placeholder? props.placeholder : "" }

                onFocus={ handleOnTextareaFocus }
                onBlur={ handleOnTextareaBlur }
                onChange={ handleOnTextareaChange }

                style={{ 
                    width: "100%", 
                    marginBottom: "12px",
                }} />
        </Stack>
    )
}

export default KanbanAutosizeTextarea;