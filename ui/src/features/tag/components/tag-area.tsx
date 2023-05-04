import { IconButton, Stack } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import toMaterialStyle from 'material-color-hash';

interface TagAreaProps {
  tag: string,
  showDelete?: boolean,
  handleOnDeleteClick?: Function
}

const TagArea = (props: TagAreaProps) => {
  // ------------------ Tag area ------------------ 
  const { tag } = props;

  const style = {
    ... toMaterialStyle(tag, 100),
    fontSize: "14px",
    padding: "0px 2px"
  };

  const handleOnCloseClick = (e: any) => {
    if(props.handleOnDeleteClick) {
      props.handleOnDeleteClick(e, tag)
    }
  }

  // ------------------ Html template ------------------ 
  return (
    <Stack 
      direction="row" 
      alignItems="center" 
      sx={ style } >
      <div>{ tag? tag : "" }</div>
      &nbsp;
      {
        (props.showDelete !== undefined? props.showDelete : false)
        ? (
          <IconButton 
            sx={{ padding: "0px" }}
            onClick={ e => handleOnCloseClick(e) }>
            <CloseIcon fontSize="small" />
          </IconButton>
          )
        : null
      }
    </Stack>
  )
}

export default TagArea;