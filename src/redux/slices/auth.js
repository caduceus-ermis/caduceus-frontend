import { createSlice } from '@reduxjs/toolkit';

import axios from '../../utils/axios';
import { UpdateIsLoading, showSnackbar } from './app';
import { client } from '../../client';
import axiosWalletInstance from '../../utils/axiosWallet';
import { OpenDialogProfile } from './dialog';
import { jwtDecode } from 'jwt-decode';

// ----------------------------------------------------------------------

const initialState = {
  isLoggedIn: false,
  token: '',
  user_id: null,
  isLoginWallet: false,
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logIn(state, action) {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.token = action.payload.token;
      state.user_id = action.payload.user_id;
      state.isLoginWallet = action.payload.isLoginWallet;
    },
    signOut(state, action) {
      state.isLoggedIn = false;
      state.token = '';
      state.user_id = null;
      state.isLoginWallet = false;
    },
  },
});

// Reducer
export default slice.reducer;

export function LoginUser(formValues) {
  return async (dispatch, getState) => {
    // Make API call here
    dispatch(UpdateIsLoading({ isLoading: true }));

    await axios
      .post(
        '/login',
        {
          ...formValues,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(async function (response) {
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: response.data.token,
            user_id: formValues.user_id,
            isLoginWallet: false,
          }),
        );
        window.localStorage.setItem('user_id', formValues.user_id);
        dispatch(showSnackbar({ severity: 'success', message: 'Login successfully!' }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      });
  };
}

export function LoginUserByGoogle(token) {
  return async (dispatch, getState) => {
    // Make API call here
    dispatch(UpdateIsLoading({ isLoading: true }));

    await axiosWalletInstance
      .post('/auth/google', { token })
      .then(async function (response) {
        const token = response.data.token;
        const decoded = jwtDecode(token);
        const userId = decoded && decoded.user_id ? decoded.user_id.toLowerCase() : '';

        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: token,
            user_id: userId,
            isLoginWallet: false,
          }),
        );
        window.localStorage.setItem('user_id', userId);
        dispatch(UpdateIsLoading({ isLoading: false }));

        const userInfo = await fetchUserFirst(userId, token);
        if (userInfo.name === userId) {
          // show dialog update user
          setTimeout(() => {
            dispatch(OpenDialogProfile());
          }, 500);
        }
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message || 'Something went wrong' }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      });
  };
}

export function LoginUserByWallet(data) {
  return async (dispatch, getState) => {
    // Make API call here
    dispatch(UpdateIsLoading({ isLoading: true }));

    await axiosWalletInstance
      .post('/auth', data)
      .then(async function (response) {
        const userId = data.address.toLowerCase();
        const token = response.data.token;
        dispatch(
          slice.actions.logIn({
            isLoggedIn: true,
            token: token,
            user_id: userId,
            isLoginWallet: true,
          }),
        );
        window.localStorage.setItem('user_id', userId);
        dispatch(UpdateIsLoading({ isLoading: false }));

        const userInfo = await fetchUserFirst(userId, token);
        if (userInfo.name === userId) {
          // show dialog update user
          setTimeout(() => {
            dispatch(OpenDialogProfile());
          }, 500);
        }
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message || 'Something went wrong' }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      });
  };
}

export function LogoutUser() {
  return async (dispatch, getState) => {
    await client.disconnectUser();

    window.localStorage.removeItem('user_id');
    window.localStorage.clear();
    dispatch(slice.actions.signOut());
    window.localStorage.setItem('isResetWallet', 'true');
    window.location.reload();
  };
}

export function RegisterUser(formValues) {
  return async (dispatch, getState) => {
    dispatch(UpdateIsLoading({ isLoading: true }));

    await axios
      .post(
        '/register',
        {
          ...formValues,
          user_id: formValues.user_name.trim(),
          user_name: formValues.user_name.trim(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      .then(function (response) {
        dispatch(showSnackbar({ severity: 'success', message: 'Register successfully!' }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message }));
        dispatch(UpdateIsLoading({ isLoading: false }));
      })
      .finally(() => {
        if (!getState().auth.error) {
          // window.location.href = "/auth/verify";
        }
      });
  };
}

export async function fetchUserFirst(userId, token) {
  let result;
  await axios
    .get(`/uss/v1/users/${userId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
    .then(function (response) {
      result = response.data;
    });

  return result;
}
