import { createSlice } from '@reduxjs/toolkit';

interface UserCacheState {
  _loginedUserSecret: string,
  _loginedUserEmail: string,
}

const { reducer, actions } = createSlice({
  name: 'UserCache',

  initialState: {
    _loginedUserSecret: '',
    _loginedUserEmail: '',
  } as UserCacheState,
  
  reducers: {
    updateLoginedUserEmail: (state, action) => {
      state._loginedUserEmail = action.payload;
    },

    updateLoginedUserSecret: (state, action) => {
      state._loginedUserSecret = action.payload;
    },
  }
});

export { reducer, actions }