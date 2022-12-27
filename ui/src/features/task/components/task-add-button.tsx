import { Fab } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

interface TaskAddButtonProps {
  handleOnClick?: Function
}

const TaskAddButton = (props: TaskAddButtonProps) => {
  const handleOnClick = () => {
    if(props.handleOnClick) {
      props.handleOnClick();
    }
  }

  // ------------------ Html template ------------------
  return (
    <Fab
      color="primary"
      onClick={ handleOnClick }>
      { <AddIcon /> }
    </Fab>
  )
}

export default TaskAddButton;