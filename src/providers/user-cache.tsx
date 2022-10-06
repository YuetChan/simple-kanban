import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialState, UserCacheReducer } from '../stores/user-cache-reducer';

interface UserCacheContext {
  state: {
    _loginedUserSecret: string,
    _loginedUserEmail: string,
  },
  Dispatch: any
}

const UserCacheContext = createContext<UserCacheContext>();

export function UserCacheProvider ({ children }) {
  const [ state, Dispatch ] = useReducer(UserCacheReducer, initialState);

  const contextValue = useMemo(() => {
    return { state, Dispatch };
  }, [ state, Dispatch ]);

  return (
    <UserCacheContext.Provider value={ contextValue }>
      { children }
    </UserCacheContext.Provider>
  );
}

export function useUserCacheContext() {
  return useContext(UserCacheContext);
}
