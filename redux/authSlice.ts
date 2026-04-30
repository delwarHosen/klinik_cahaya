import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    access_token: null as string | null,
    refresh_token: null as string | null,
    role: null as string | null,
    user: null as any,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { access_token, refresh_token, role, user } = action.payload;
      state.access_token  = access_token;
      state.refresh_token = refresh_token;
      state.role          = role;
      state.user          = user;
      
      AsyncStorage.setItem('access_token', access_token);
      AsyncStorage.setItem('refresh_token', refresh_token);
      AsyncStorage.setItem('role', role);
    },
    logout: (state) => {
      state.access_token  = null;
      state.refresh_token = null;
      state.role          = null;
      state.user          = null;
      AsyncStorage.multiRemove(['access_token', 'refresh_token', 'role']);
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;