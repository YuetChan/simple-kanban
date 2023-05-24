import { createSlice } from '@reduxjs/toolkit';
import { Project } from '../types/Project';

interface ProjectsCacheState {
    _activeProject: Project | undefined,

    _allProjects: Array<Project>,
    _allShareProjects: Array<Project>,
    _allNotProjects: Array<Project>
}

const { reducer, actions } = createSlice({
    name: 'ProjectsCache',

    initialState: {
        _activeProject: undefined,
        
        _allProjects: [],
        _allShareProjects: [],
        _allNotProjects: []
    } as ProjectsCacheState,
  
    reducers: {
        updateActiveProject: (state, action) => {
            state._activeProject = action.payload;
        },

        updateProjects: (state, action) => {
            state._allProjects = action.payload;

            state._allProjects.sort((a, b) => {
                const titleA = a.name.toLowerCase();
                const titleB = b.name.toLowerCase();
                
                if (titleA < titleB) {
                  return -1;
                }
                if (titleA > titleB) {
                  return 1;
                }
                
                return 0;
            });

            state._activeProject = action.payload.length > 0 ? action.payload[0] : undefined;
        },

        updateNotProjects: (state, action) => {
            state._allNotProjects = action.payload;
        },

        updateShareProjects: (state, action) => {
            state._allShareProjects = action.payload;
        },
    }
    });

export { reducer, actions };