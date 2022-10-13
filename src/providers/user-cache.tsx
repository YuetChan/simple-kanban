import { createContext, useContext, useMemo, useReducer } from 'react';
import { initialState, UserCacheReducer } from '../stores/user-cache-reducer';

interface UserCacheContext {
  state: {
    _loginedUserSecret: string,
    _loginedUserEmail: string,
  },
  Dispatch: any
}

const UserCacheContext = createContext<UserCacheContext>({
  state: {
    _loginedUserSecret: '',
    _loginedUserEmail: '',
  },
  Dispatch: undefined
});

export function UserCacheProvider ({ children }: { children: any }) {
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
