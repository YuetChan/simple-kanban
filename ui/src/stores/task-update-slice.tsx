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
    focusTagsEditArea: (state) => {
      state._tagsEditAreaFocused = true;
    },

    blurTagsEditArea: (state) => {
      state._tagsEditAreaFocused = false;
    },

    updateTagsEditAreaSearchStr: (state, action) => {
      state._tagsEditAreaSearchStr = action.payload;
    },

    mouseEnterSearchResultPanel: (state, action) => {
      state._searchResultPanelMouseOver = true;
      state._lastFocusedArea = action.payload;
    },

    mouseLeaveSearchResultPanel: (state) => {
      state._searchResultPanelMouseOver = false;
    },

    setTagsEditAreaRef: (state, action) => {
      state = {
        ... state,
        _tagsEditAreaRef: action.payload
      }
    },

    updateLastFocusedArea: (state, action) => {
      state._lastFocusedArea = action.payload;
    }
  }
});

export { reducer, actions }