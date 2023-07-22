import { Button, Menu, Stack } from "@mui/material";
import { useState } from "react";

import TagsArea from "../../tag/components/tags-area";
import TaskPriorityCheckbox from "./task-priority-checkbox";

interface TaskSearchFilterMenuProps {
    anchorEl: any,
    shallowOpen: boolean,

    projectId: string,

    handleOnPrioritiesCheck?: Function,
    handleOnTagsChange?: Function,
    handleOnClose?: Function,

    handleOnClear?: Function
}

const TaskSearchFilterMenu = (props: TaskSearchFilterMenuProps) => {
    const [ checkedValues, setCheckedValues ] = useState<Array<string>>([]);
    const [ tags, setTags ] = useState<Array<string>>([]);

    const handleOnClose = (e: any) => {
        if(props.handleOnClose) {
            props.handleOnClose(e)
        }
    }

    const handleOnPrioritiesCheck = (priorities: Array<string>) => {
        if(props.handleOnPrioritiesCheck) {
            props.handleOnPrioritiesCheck(priorities)
        }
    }

    const handleOnTagsChange = (tags: Array<string>) => {
        if(props.handleOnTagsChange) {
            props.handleOnTagsChange(tags)
        }
    }

    const handleOnClear = (e: any) => {
        setCheckedValues([]);
        setTags([]);

        if(props.handleOnClear) {
            props.handleOnClear()
        }
    }

    return (
        <Menu 
            open={ Boolean(props.anchorEl) }
            anchorEl={ props.anchorEl }
            
            onClose={ (e: any) => handleOnClose(e) }
            
            sx={{
                padding: "8px 0px 8px 0px",
                display: props.shallowOpen? "block": "none"
            }}
            
            MenuListProps={{
                onKeyDown: (event) => {
                    if (event.key === 'Tab') {
                        event.preventDefault(); // Prevent the default action of the Tab key
                    }
                },
            }}>
                <Stack 
                    direction="row" 
                    justifyContent="space-between" 
                    paddingRight="8px">
                    <TaskPriorityCheckbox 
                        checkedValues={checkedValues}
                        
                        handleOnPrioritiesCheck = { (priorities: Array<string>) => 
                            handleOnPrioritiesCheck(priorities) }
                        />

                        <Button 
                            color="warning"

                            onClick={ handleOnClear }

                            sx={{ 
                                height: "50px", 
                                width: "150px"
                            }}>
                            Clear
                        </Button>
                </Stack>
            <TagsArea 
                projectId={ props.projectId } 
                tags={ tags }

                handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) }
                />
        </Menu>
    )
}

export default TaskSearchFilterMenu;