import React from 'react';
import { IconButton, Stack } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import toMaterialStyle from 'material-color-hash';

const KanbanTagArea = (props: any) => {
  const { tag, showDelete, handleOnDeleteClick } = props;

  const style = {
    ... toMaterialStyle(tag),
    fontSize: "14px",
    padding: "0px 2px"
  };

  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      sx={ style }>
      <div>{ tag }</div>
      &nbsp;

      {
        showDelete
        ? (
          <IconButton 
            aria-label="delete"
            sx={{ padding: "0px" }}
            onClick={ (e) => handleOnDeleteClick(e, tag) }>
            <CloseIcon fontSize='small' />
          </ IconButton>
          )
        : null
      }
    </Stack>
  )
}

export default KanbanTagArea;