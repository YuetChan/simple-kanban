import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialState, UserReducer } from '../stores/kanban-users-reducer';

interface UserContext {
  state: {
    _loginedUserSecret: string,
    _loginedUserEmail: string,
  },
  Dispatch: any
}

const KanbanUsersContext = createContext<UserContext>();

export function KanbanUsersProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(UserReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <KanbanUsersContext.Provider value={ contextValue }>
      { children }
    </KanbanUsersContext.Provider>
  );
}

export function useKanbanUsersContext() {
  return useContext(KanbanUsersContext);
}
