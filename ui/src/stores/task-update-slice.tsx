import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskUpdateState {
  _tagsEditAreaFocused: boolean,
  _tagsEditAreaSearchStr: string,

  _tagsEditAreaRef: any,

  _task: Task | undefined,

  _searchResultPanelMouseOver: boolean,
  
  _lastFocusedArea: string
}

const { reducer, actions } = createSlice({
  name: 'TaskUpdate',

  initialState: {
    _tagsEditAreaFocused: false,
    _tagsEditAreaSearchStr: '',
    _tagsEditAreaRef: undefined,
  
    _task: undefined,
  
    _searchResultPanelMouseOver: false,

    _lastFocusedArea: ''
  } as TaskUpdateState,
  
  reducers: {

  }
});

export { reducer, actions }