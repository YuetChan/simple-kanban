import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskCreateState {
  _tagsEditAreaFocused: boolean,
  _tagsEditAreaSearchStr: string,
  _tagsEditAreaRef: any,

  _activeTags: Array<string>,

  _task: Task | undefined,

  _searchResultPanelMouseOver: boolean,
  
  _lastFocusedArea: string
}

const { reducer, actions } = createSlice({
  name: "TaskCreate",

  initialState: {
    _tagsEditAreaFocused: false,
    _tagsEditAreaSearchStr: "",
    _tagsEditAreaRef: undefined,

    _activeTags: [],
  
    _task: undefined,
  
    _searchResultPanelMouseOver: false,

    _lastFocusedArea: ""
  } as TaskCreateState,
  
  reducers: {
    updateActiveTags: (state, action) => {
      state._activeTags = action.payload;
    },

    setTagsEditAreaRef: (state, action) => {
      state = {
        ... state,
        _tagsEditAreaRef: action.payload
      }
    },
  }
});

export { reducer, actions }