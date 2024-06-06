import { createSlice } from '@reduxjs/toolkit';
// ----------------------------------------------------------------------

const initialState = {
  openDialogCreateChannel: false,
  openDialogNewDirectMessage: false,
  openDialogProfile: false,
};

const slice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    // Open Dialog Create Channel
    openDialogCreateChannel(state) {
      state.openDialogCreateChannel = true;
    },
    // Close Dialog Create Channel
    closeDialogCreateChannel(state) {
      state.openDialogCreateChannel = false;
    },

    // Open Dialog New Direct Message
    openDialogNewDirectMessage(state) {
      state.openDialogNewDirectMessage = true;
    },

    // Close Dialog New Direct Message
    closeDialogNewDirectMessage(state) {
      state.openDialogNewDirectMessage = false;
    },

    // Open Dialog Profile
    openDialogProfile(state) {
      state.openDialogProfile = true;
    },

    // Close Dialog Profile
    closeDialogProfile(state) {
      state.openDialogProfile = false;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const OpenDialogCreateChannel = () => async (dispatch, getState) => {
  dispatch(slice.actions.openDialogCreateChannel());
};

export const CloseDialogCreateChannel = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeDialogCreateChannel());
};

export const OpenDialogNewDirectMessage = () => async (dispatch, getState) => {
  dispatch(slice.actions.openDialogNewDirectMessage());
};

export const CloseDialogNewDirectMessage = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeDialogNewDirectMessage());
};

export const OpenDialogProfile = () => async (dispatch, getState) => {
  dispatch(slice.actions.openDialogProfile());
};

export const CloseDialogProfile = () => async (dispatch, getState) => {
  dispatch(slice.actions.closeDialogProfile());
};
