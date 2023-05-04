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
    focusTagsEditArea: (state) => {
      state._tagsEditAreaFocused = true;
    },

    blurTagsEditArea: (state) => {
      state._tagsEditAreaFocused = false;
    },

    updateTagsEditAreaSearchStr: (state, action) => {
      state._tagsEditAreaSearchStr = action.payload;
    },

    updateActiveTags: (state, action) => {
      state._activeTags = action.payload;
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