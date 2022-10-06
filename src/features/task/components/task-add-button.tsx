import { Fab } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

interface TaskAddButtonProps {
  handleOnClick?: Function
}

const TaskAddButton = (props: TaskAddButtonProps) => {
  // ------------------ Html template ------------------
  return (
    <Fab
      color="primary"
      onClick={ () => {
        if(props.handleOnClick) {
          props.handleOnClick();
        }
      } }>
      { <AddIcon /> }
    </Fab>
  )
}

export default TaskAddButton;