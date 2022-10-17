import { createSlice } from '@reduxjs/toolkit';

interface TagsSearchResultPanelState {
  _mouseOver: boolean
}

const { reducer, actions } = createSlice({
  name: 'TagsSearchResultPanel',

  initialState: {
    _mouseOver: false,
  } as TagsSearchResultPanelState,
  
  reducers: {
    mouseEnter: (state) => {
      state._mouseOver = true;
    },
    
    mouseLeave: (state) => {
      state._mouseOver = false;
    },
  }
});

export { reducer, actions }