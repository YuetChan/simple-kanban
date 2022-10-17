import { createSlice } from '@reduxjs/toolkit';
import { Project } from '../types/Project';

interface ProjectsCacheState {
  _activeProject: Project | undefined,
  _allProjects: Array<Project>
}

const { reducer, actions } = createSlice({
  name: 'ProjectsCache',

  initialState: {
    _activeProject: undefined,
    _allProjects: []
  } as ProjectsCacheState,
  
  reducers: {
    selectActiveProject: (state, action) => {
      state._activeProject = action.payload;
    },
    
    updateActiveProject: (state, action) => {
      state._activeProject = action.payload;
    },

    updateAllProjects: (state, action) => {
      state._allProjects = action.payload;
      state._activeProject = action.payload.length > 0 ? action.payload[0] : undefined;
    }
  }
});

export { reducer, actions };