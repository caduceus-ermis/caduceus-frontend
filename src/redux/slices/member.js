import { createSlice } from '@reduxjs/toolkit';
import { UpdateIsLoading, showSnackbar } from './app';
import axiosInstance from '../../utils/axios';
import { CloseDialogProfile } from './dialog';

const initialState = {
  all_members: [],
  user: {},
};

const slice = createSlice({
  name: 'member',
  initialState,
  reducers: {
    fetchAllMembers(state, action) {
      state.all_members = action.payload;
    },
    fetchUser(state, action) {
      state.user = action.payload.user;
    },
    updateUser(state, action) {
      state.user = action.payload.user;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function FetchAllMembers() {
  return async (dispatch, getState) => {
    await axiosInstance
      .get('/uss/v1/users', {
        params: {
          limit: 3000,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then(function (response) {
        dispatch(slice.actions.fetchAllMembers(response.data.results));
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message }));
      });
  };
}

export function FetchUserProfile(userId) {
  return async (dispatch, getState) => {
    await axiosInstance
      .get(`/uss/v1/users/${userId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getState().auth.token}`,
        },
      })
      .then(function (response) {
        dispatch(slice.actions.fetchUser({ user: response.data }));
      })
      .catch(function (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message }));
      });
  };
}

export const UpdateUserProfile = formValues => {
  return async (dispatch, getState) => {
    const file = formValues.avatar;
    const name = formValues.name;
    const about_me = formValues.about_me;

    dispatch(UpdateIsLoading({ isLoading: true }));
    let avatar;
    let isContinute = true;
    if (file) {
      const formData = new FormData();
      formData.append('avatar', file);

      await axiosInstance
        .post('/uss/v1/users/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${getState().auth.token}`,
          },
        })
        .then(response => {
          avatar = response.data.avatar;
          dispatch(showSnackbar({ severity: 'success', message: 'Update profile successfully!' }));
        })
        .catch(error => {
          dispatch(UpdateIsLoading({ isLoading: false }));
          dispatch(showSnackbar({ severity: 'error', message: error.message }));
          isContinute = false;
        });
    } else {
      avatar = '';
    }

    if (isContinute) {
      await axiosInstance
        .patch(
          '/uss/v1/users/update',
          { name, about_me },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getState().auth.token}`,
            },
          },
        )
        .then(response => {
          dispatch(slice.actions.updateUser({ user: response.data }));
          dispatch(FetchAllMembers());
          dispatch(showSnackbar({ severity: 'success', message: 'Update profile successfully!' }));
          dispatch(UpdateIsLoading({ isLoading: false }));
          dispatch(CloseDialogProfile());
        })
        .catch(error => {
          dispatch(UpdateIsLoading({ isLoading: false }));
          dispatch(showSnackbar({ severity: 'error', message: error.message }));
        });
    }
  };
};
