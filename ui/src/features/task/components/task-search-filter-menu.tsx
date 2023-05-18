import { Menu } from "@mui/material";

import TagsArea from "../../tag/components/tags-area";
import TaskPriorityCheckbox from "./task-priority-checkbox";

interface TaskSearchFilterMenuProps {
    anchorEl: any,
    shallowOpen: boolean,

    projectId: string

    handleOnPrioritiesCheck?: Function,
    handleOnTagsChange?: Function,
    handleOnClose?: Function,
}

const TaskSearchFilterMenu = (props: TaskSearchFilterMenuProps) => {
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

    return (
        <Menu 
            open={ Boolean(props.anchorEl) }
            anchorEl={ props.anchorEl }
            
            onClose={ (e: any) => handleOnClose(e) }
            
            sx={{
                padding: "8px 0px 8px 0px",
                display: props.shallowOpen? "block": "none"
            }}>
            <TaskPriorityCheckbox handleOnPrioritiesCheck = { (priorities: Array<string>) => 
                handleOnPrioritiesCheck(priorities) }
                />
            
            <TagsArea 
                projectId={ props.projectId } 
                handleOnTagsChange={ (tags: Array<string>) => handleOnTagsChange(tags) }
                />
        </Menu>
    )
}

export default TaskSearchFilterMenu;