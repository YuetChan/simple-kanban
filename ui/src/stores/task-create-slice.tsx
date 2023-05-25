import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskCreateState {
  _activeTags: Array<string>,

  _task: Task | undefined,
}

const { reducer, actions } = createSlice({
  name: "TaskCreate",

  initialState: {
    _activeTags: [],
  
    _task: undefined,
  } as TaskCreateState,
  
  reducers: {
    updateActiveTags: (state, action) => {
      state._activeTags = action.payload;
    },
  }
});

export { reducer, actions }