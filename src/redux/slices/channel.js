import { createSlice } from '@reduxjs/toolkit';
import { ChatType } from '../../constants/commons-const';
import { client } from '../../client';
import { showSnackbar } from './app';

const initialState = {
  channels: [],
  channel_id: null,
  currentChannel: null,
  allUnreadCount: {},
  markReadChannel: null,
};

const slice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    fetchChannels(state, action) {
      state.channels = action.payload;
    },
    setCurrentChannel(state, action) {
      state.currentChannel = action.payload;
    },
    addChannel(state, action) {
      state.channels.push(action.payload);
    },
    fetchAllUnreadCount(state, action) {
      state.allUnreadCount = action.payload;
    },
    setMarkReadChannel(state, action) {
      state.markReadChannel = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function FetchChannels() {
  return async (dispatch, getState) => {
    if (!client) return;

    const filter = { type: ChatType.ALL };
    const sort = [{ last_message_at: -1 }];
    const options = {
      limit: 10,
      offset: 0,
      message_limit: 25,
      presence: true,
      watch: true,
    };

    await client
      .queryChannels(filter, sort, options)
      .then(response => {
        dispatch(slice.actions.fetchChannels(response));
      })
      .catch(err => {
        dispatch(showSnackbar({ severity: 'error', message: err.message }));
      });
  };
}

export const ConnectCurrentChannel = (channelId, channelType) => {
  return async (dispatch, getState) => {
    try {
      if (!client) return;
      const channel = client.channel(channelType, channelId);
      // await channel.watch();
      const response = await channel.query({
        messages: { limit: 50 },
      });

      if (response) {
        dispatch(slice.actions.setCurrentChannel(channel));
      }
    } catch (error) {
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
    }
  };
};

export const AddChannel = channel => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addChannel(channel));
  };
};

export const SetMarkReadChannel = channel => {
  return async (dispatch, getState) => {
    const responseMarkRead = await channel.markRead();
    dispatch(slice.actions.setMarkReadChannel(responseMarkRead?.event));
  };
};

export function FetchAllUnreadCount() {
  return async (dispatch, getState) => {
    if (!client) return;

    const userId = getState().auth.user_id;
    await client
      .getUnreadCount(userId)
      .then(response => {
        dispatch(slice.actions.fetchAllUnreadCount(response));
      })
      .catch(err => {
        dispatch(showSnackbar({ severity: 'error', message: err.message }));
      });
  };
}
