import { Fab } from "@mui/material";

import AddIcon from '@mui/icons-material/Add';

const KanbanTaskAddButton = (props: any) => {
  return (
    <Fab
      color="primary"
      onClick={ props.handleOnClick }
      >
      { <AddIcon /> }
    </Fab>
  )
}

export default KanbanTaskAddButton;