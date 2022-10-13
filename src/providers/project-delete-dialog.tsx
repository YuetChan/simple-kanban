import React, { useMemo, useReducer, createContext, useContext  } from 'react';
import { initialState, ProjectDeleteDialogReducer } from '../stores/project-delete-dialog-reducer';

interface ProjectDeleteDialogContext {
  state: {
    show: boolean
  },
  Dispatch: any
}

const ProjectDeleteDialogContext = createContext<ProjectDeleteDialogContext>({
  state: {
    show: false
  },
  Dispatch: undefined
});

export function ProjectDeleteDialogProvider ({ children }: { children: any }) {
  const [ state, Dispatch ] = useReducer(ProjectDeleteDialogReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <ProjectDeleteDialogContext.Provider value={ contextValue }>
      { children }
    </ProjectDeleteDialogContext.Provider>
  );
}

export function useProjectDeleteDialogContext() {
  return useContext(ProjectDeleteDialogContext);
}