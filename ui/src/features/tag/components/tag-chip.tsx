import { IconButton, Stack } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';


interface TagChipProps {
  tag: string,
  showDelete?: boolean,

  handleOnDeleteClick?: Function
}

const TagChip = (props: TagChipProps) => {
  const handleOnDeleteClick = (e: any) => {
    if(props.handleOnDeleteClick) {
      props.handleOnDeleteClick(props.tag)
    }
  }

  // ------------------ Html template ------------------ 
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
        sx={ {
        borderRadius: "4px",
    
        fontSize: "14px",
    
        background: "whitesmoke",
    
        padding: "4px",
        height: "20px",
      }}>
      <div>{ props.tag? props.tag : "" }</div>
      &nbsp;
      {
        (props.showDelete !== undefined? props.showDelete : false)
        ? (
          <IconButton 
            sx={{ padding: "0px" }}
            onClick={ e => handleOnDeleteClick(e) }>
            <CloseIcon fontSize="small" />
          </IconButton>
          )
        : null
      }
    </Stack>
  )
}

export default TagChip;