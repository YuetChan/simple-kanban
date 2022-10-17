import { createSlice } from '@reduxjs/toolkit';

interface TableState { 
  tick: boolean
}

const { reducer, actions } = createSlice({
  name: 'KanbanTable',

  initialState: {
    tick: false
  } as TableState,
  
  reducers: {
    refreshTable: (state) => {
      state.tick = !state.tick;
    },
  }
});

export { reducer, actions }