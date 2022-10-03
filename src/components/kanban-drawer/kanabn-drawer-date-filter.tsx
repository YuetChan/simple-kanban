import { Stack } from "@mui/material";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useKanbanDatesContext } from "../../providers/kanban-dates";

const KanbanDrawerDateFilter = (props: any) => {
  // 
  const datesContextState = useKanbanDatesContext().state;
  const datesContextDispatch = useKanbanDatesContext().Dispatch;

  const handleOnFromDateChange = (date) => {
    datesContextDispatch({
      type: 'fromDate_update',
      value: date
    });
  }

  const handleOnToDateChange = (date) => {
    datesContextDispatch({
      type: 'toDate_update',
      value: date
    })
  }

  return (
    <Stack 
      direction="column" 
      spacing={ 1 }
      style={{ margin: "0px 0px 4px 0px" }}>
      <div>Created from: </div>
      <DatePicker 
        selected={ datesContextState?._fromDate } 
        onChange={(date) => handleOnFromDateChange(date)} />

      <div>To: </div>
      <DatePicker 
        selected={ datesContextState?._toDate } 
        onChange={(date) => handleOnToDateChange(date)} />
    </Stack>
  )
}

export default KanbanDrawerDateFilter;