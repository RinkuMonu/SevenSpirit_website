import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { errMsg } from '../api/axios.js';

const call = (path) => async (body, { rejectWithValue }) => {
  try { return (await api.post(path, body)).data; } catch (e) { return rejectWithValue(errMsg(e)); }
};

export const login = createAsyncThunk('auth/login', call('/auth/login'));
export const register = createAsyncThunk('auth/register', call('/auth/register'));
export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try { return (await api.get('/auth/me')).data; } catch (e) { return rejectWithValue(errMsg(e)); }
});

const token = localStorage.getItem('token');
const initialState = { user: null, token, loading: false, initialized: !token };

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem('token');
      state.user = null; state.token = null; state.initialized = true;
    },
  },
  extraReducers: (b) => {
    const signedIn = (state, { payload }) => {
      localStorage.setItem('token', payload.token);
      state.token = payload.token; state.user = payload.user; state.loading = false; state.initialized = true;
    };
    b.addCase(login.pending, (s) => { s.loading = true; })
      .addCase(login.fulfilled, signedIn)
      .addCase(login.rejected, (s) => { s.loading = false; })
      .addCase(register.pending, (s) => { s.loading = true; })
      .addCase(register.fulfilled, signedIn)
      .addCase(register.rejected, (s) => { s.loading = false; })
      .addCase(fetchMe.fulfilled, (s, { payload }) => { s.user = payload.user; s.initialized = true; })
      .addCase(fetchMe.rejected, (s) => {
        localStorage.removeItem('token');
        s.user = null; s.token = null; s.initialized = true;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
