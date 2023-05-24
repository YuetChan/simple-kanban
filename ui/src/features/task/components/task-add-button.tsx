import { Fab } from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

interface TaskAddButtonProps {
    handleOnClick?: Function,

    style?: any
}

const TaskAddButton = (props: TaskAddButtonProps) => {
    const handleOnClick = () => {
        if(props.handleOnClick) {
            props.handleOnClick();
        }
    }

    // ------------------ Html template ------------------
    return (
        <div style={{
            ...props.style
            }}>
            <Fab
                onClick={ handleOnClick }

                sx={{
                    color: "white",
                    background: "rgb(47, 47, 47)",

                    "&:hover": {
                        backgroundColor: "white", 
                        color:"rgb(47, 47, 47)"
                    }}}>
                { <AddIcon /> }
            </Fab>
        </div>  
    )
}

export default TaskAddButton;