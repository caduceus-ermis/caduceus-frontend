import { ErmisChat } from 'ermis-js-sdk';
import { API_KEY, BASE_URL } from './config';
import { showSnackbar } from './redux/slices/app';

let client;
const connectUser = async (user_id, token, dispatch) => {
  client = ErmisChat.getInstance(API_KEY, {
    enableInsights: true,
    enableWSFallback: true,
    allowServerSideConnect: true,
    baseURL: BASE_URL,
  });

  try {
    await client.connectUser(
      {
        api_key: API_KEY,
        id: user_id,
        name: user_id,
        image: '',
      },
      `Bearer ${token}`,
      // `${token}`,
    );
  } catch (error) {
    dispatch(showSnackbar({ severity: 'error', message: error.message }));
  }
};

export { client, connectUser };
