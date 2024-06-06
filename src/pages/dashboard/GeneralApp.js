import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ChatComponent from './ChatComponent';
import NoChat from '../../assets/Illustration/NoChat';
import { useDispatch, useSelector } from 'react-redux';
import Channels from './Channels';
import ChannelInfo from '../../sections/dashboard/ChannelInfo';
import Members from '../../sections/dashboard/Members';
import { OpenDialogCreateChannel } from '../../redux/slices/dialog';
import { useAccount } from 'wagmi';
import { LogoutUser } from '../../redux/slices/auth';
import ProfileDialog from '../../sections/dashboard/ProfileDialog';

const GeneralApp = () => {
  const { isConnected } = useAccount();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { currentChannel } = useSelector(state => state.channel);

  const { sideBar } = useSelector(state => state.app);
  const { isLoginWallet } = useSelector(state => state.auth);
  const { openDialogProfile } = useSelector(state => state.dialog);

  useEffect(() => {
    if (!isConnected && isLoginWallet) {
      dispatch(LogoutUser());
    }
  }, [isLoginWallet, isConnected]);

  return (
    <>
      <Stack direction="row" sx={{ width: '100%' }}>
        <Channels />
        <Box
          sx={{
            height: '100%',
            width: sideBar.open ? `calc(100vw - 740px )` : 'calc(100vw - 420px )',
            backgroundColor: theme.palette.mode === 'light' ? '#FFF' : theme.palette.background.paper,
            // borderBottom:
            //   searchParams.get('type') === 'individual-chat' && searchParams.get('id') ? '0px' : '6px solid #0162C4',
          }}
        >
          {currentChannel ? (
            <ChatComponent />
          ) : (
            <Stack spacing={2} sx={{ height: '100%', width: '100%' }} alignItems="center" justifyContent={'center'}>
              <NoChat />
              <Typography variant="subtitle2">
                Select a conversation or start a{' '}
                <Link
                  style={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                  }}
                  // to="/"
                  onClick={() => dispatch(OpenDialogCreateChannel())}
                >
                  new one
                </Link>
              </Typography>
            </Stack>
          )}
        </Box>
        {sideBar.open &&
          (() => {
            switch (sideBar.type) {
              case 'CHANNEL':
                return <ChannelInfo />;

              case 'MEMBERS':
                return <Members />;

              default:
                break;
            }
          })()}
      </Stack>
      {openDialogProfile && <ProfileDialog />}
    </>
  );
};

export default GeneralApp;
