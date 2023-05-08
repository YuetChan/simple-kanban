import { Menu, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface KanbanInfiniteDropdownProps {
    fetchByPageFunc?: Function,

    handleOnInputFocus?: Function,
    handleOnDropdownClose?: Function,
}

const KanbanInfiniteDropdown = (props: KanbanInfiniteDropdownProps) => {
    const [ anchorEl, setAnchorEl ] = useState<null | HTMLElement>(null);
    const [ open, setOpen ] = useState<boolean>(false)

    const [options, setOptions ] = useState<Array<any>>([]);

    const [ page, setPage ] = useState<number>(0);
    const [loading, setLoading ] = useState<boolean>(false);
  
    const handleOnScroll = (e: any) => {
        const target = e.target
        
        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            setLoading(true);

            // props.fetchByPageFunc(page)

            setTimeout(() => {
                setLoading(false);
                e.target.scrollTop = target.scrollHeight - target.clientHeight - 100
            }, 1000);
        }   
    };

    const handleOnFocus = (e: any) => {
        if(props.handleOnInputFocus){
            props.handleOnInputFocus(e)
        }

        setAnchorEl(e.currentTarget)
        setOpen(true)
    }

    const handleOnClose = (e: any) => {
        if(props.handleOnDropdownClose) {
            props.handleOnDropdownClose(e)
        }

        setAnchorEl(null);
        setOpen(false)
    }
  
    useEffect(() => {
      setOptions(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    }, []);
  
    return (
        <div>
            <TextField 
                variant="outlined"
                label="Filter card on board"
                onFocus={ (e) => handleOnFocus(e) }
                />

            <Menu        
                anchorEl={ anchorEl }
                open={ open }
                onClose={ (e) => handleOnClose(e) }
                PaperProps={{
                    onScroll: (e) => handleOnScroll(e)
                }}
                sx={{
                    maxHeight: "200px"
                    }}>
                {
                    options.map(option => (
                        <MenuItem 
                            key={ option } 
                            value={ option } 
                            sx={{ 
                                minWidth: "100px" 
                                }}>
                            { option }
                        </MenuItem>
                    ))
                }
                
                { loading && <MenuItem disabled>Loading...</MenuItem> }
            </Menu>
        </div>
    );
}

export default KanbanInfiniteDropdown;