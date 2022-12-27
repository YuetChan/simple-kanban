import { createSlice } from '@reduxjs/toolkit';
import { Task } from '../types/Task';

interface TaskCacheState {
  _allTasks: {
    'backlog': Array<Task>,
    'todo': Array<Task>,
    'inProgress': Array<Task>,
    'done': Array<Task>
  }
}

const { reducer, actions } = createSlice({
  name: 'TasksCache',

  initialState: {
    _allTasks: {
      'backlog': [],
      'todo': [],
      'inProgress': [],
      'done': []
    }
  } as TaskCacheState,
  
  reducers: {
    allTasksUpdate: (state, action) => {
      state._allTasks = action.payload;
    }
  }
});

export { reducer, actions }