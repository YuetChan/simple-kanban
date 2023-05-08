import { MenuItem, MenuList, Paper, TextField } from "@mui/material";
import { useEffect, useState } from "react";

interface KanbanInfiniteDropdownProps {
    fetchByPageFunc?: Function,

    handleOnInputFocus?: Function,
    handleOnDropdownClose?: Function,
}

const KanbanInfiniteDropdown = (props: KanbanInfiniteDropdownProps) => {
    const [ open, setOpen ] = useState<boolean>(false)

    const [ value, setValue ] = useState<string>("")

    const [options, setOptions ] = useState<Array<any>>([]);

    const [ page, setPage ] = useState<number>(0);
    const [loading, setLoading ] = useState<boolean>(false);
  
    const handleOnScroll = (e: any) => {
        const target = e.target
        
        if (Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1) {
            setLoading(true);

            setTimeout(() => {
                setLoading(false);

                let scrollTop = target.scrollHeight - target.clientHeight - 10; 
                scrollTop = scrollTop < 0 ? 0 : scrollTop

                e.target.scrollTop = scrollTop
            }, 1000);
        }   
    };

    const handleOnChange = (e: any) => {
        setValue(e.target.value)
    }

    const handleOnFocus = (e: any) => {
        if(props.handleOnInputFocus){
            props.handleOnInputFocus(e)
        }

        setOpen(true)
    }

    const handleOnBlur = (e: any) => {
        if(props.handleOnDropdownClose) {
            props.handleOnDropdownClose(e)
        }

        setOpen(false)
    }
  
    useEffect(() => {
      setOptions(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
    }, []);
  
    return (
        <div>
            <TextField 
                variant="standard"
                label="Filter card on board"
                value={ value }

                onChange={ (e) => handleOnChange(e)}
                onFocus={ (e) => handleOnFocus(e) }
                onBlur={ (e) => handleOnBlur(e) }

                sx={{
                    width: "100px"
                }}
                />

            {
                open
                ? (
                    <Paper 
                        sx={{
                            maxHeight: "200px",
                            overflow: "scroll",
                            position: "fixed",
                            zIndex: "999"
                            }}
                        onScroll={ (e: any) => handleOnScroll(e) } 
                        >
                        <MenuList variant="menu">
                            {
                                options.map(option => (
                                    <MenuItem 
                                        key={ option } 
                                        value={ option } 
                                        sx={{ 
                                            width: "100px" 
                                            }}>
                                        { option }
                                    </MenuItem>
                                ))
                            }
                    
                            { <MenuItem disabled>{loading?  "Loading..." : "No more"}</MenuItem> }
                        </MenuList>
                    </Paper>
                ): null
            }
        </div>
    );
}

export default KanbanInfiniteDropdown;