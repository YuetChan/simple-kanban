import { Snackbar } from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../stores/app-reducers";

interface KanbanEventNotifierProps { }

const KanbanEventNotifier = (props: KanbanEventNotifierProps) => {
    const [ open, setOpen ] = useState(true);

    const handleOnClose = (e: any) => {
        setOpen(false)
    }

    const crudEventCacheState = useSelector((state: AppState) => state.CrudEventCache);

    return (
        <div>
            <Snackbar
                open={ open }
                autoHideDuration={ 6000 }
                onClose={ handleOnClose }
                message="Note archived"
                />
        </div>
    )
}

export default KanbanEventNotifier;