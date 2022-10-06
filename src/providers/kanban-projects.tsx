import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { Project } from '../features/Project';
import { initialState, ProjectReducer } from '../stores/kanban-projects-reducer';

interface ProjectContext {
  state: {
    _activeProject: Project,
    _allProjects: Array<Project>
  },
  Dispatch: any
}

const KanbanProjectsContext = createContext<ProjectContext>();

export function KanbanProjectsProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(ProjectReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanProjectsContext.Provider value={ contextValue }>
      { children }
    </KanbanProjectsContext.Provider>
  );
}

export function useKanbanProjectsContext() {
  return useContext(KanbanProjectsContext);
}