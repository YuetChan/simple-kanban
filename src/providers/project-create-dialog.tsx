import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, ProjectCreateDialogReducer } from '../stores/project-create-dialog-reducer';

interface ProjectCreateDialogContext {
  state: {
    show: boolean
  },
  Dispatch: any
}

const ProjectCreateDialogContext = createContext<ProjectCreateDialogContext>();

export function ProjectCreateDialogProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(ProjectCreateDialogReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <ProjectCreateDialogContext.Provider value={ contextValue }>
      { children }
    </ProjectCreateDialogContext.Provider>
  );
}

export function useProjectCreateDialogContext() {
  return useContext(ProjectCreateDialogContext);
}