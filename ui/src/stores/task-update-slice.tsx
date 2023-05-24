import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskUpdateState {
    _task: Task | undefined,
}

const { reducer, actions } = createSlice({
    name: 'TaskUpdate',

    initialState: {
        _task: undefined,
    } as TaskUpdateState,
  
    reducers: {

    }
});

export { reducer, actions }