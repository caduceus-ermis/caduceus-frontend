import React, { useEffect, useState } from 'react';
import { Box, Stack, Typography, IconButton, Divider, Menu, MenuItem } from '@mui/material';
import { MagnifyingGlass, Plus, User, UsersThree } from 'phosphor-react';
import { useTheme } from '@mui/material/styles';
import { SimpleBarStyle } from '../../components/Scrollbar';
import ChatElement from '../../components/ChatElement';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { useDispatch, useSelector } from 'react-redux';
import useResponsive from '../../hooks/useResponsive';
import CreateChannel from '../../sections/dashboard/CreateChannel';
import { client } from '../../client';
import { FetchChannels } from '../../redux/slices/channel';
import { OpenDialogCreateChannel, OpenDialogNewDirectMessage } from '../../redux/slices/dialog';
import NewDirectMessage from '../../sections/dashboard/NewDirectMessage';

const Channels = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { channels } = useSelector(state => state.channel);
  const { isLoginWallet } = useSelector(state => state.auth);
  const { openDialogNewDirectMessage, openDialogCreateChannel } = useSelector(state => state.dialog);

  const isDesktop = useResponsive('up', 'md');
  const [listChannel, setListChannel] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const onCloseMenu = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (channels) {
      setListChannel(channels);
    }
  }, [channels]);

  useEffect(() => {
    const handleChannels = () => {
      dispatch(FetchChannels());
    };
    client.on('notification.added_to_channel', handleChannels);

    return () => {
      client.off('notification.added_to_channel', handleChannels);
    };
  }, [dispatch]);

  return (
    <>
      <Box
        sx={{
          // overflowY: 'scroll',
          position: 'relative',
          height: '100%',
          width: isDesktop ? 320 : '100vw',
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,

          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
        }}
      >
        {isLoginWallet && (
          <Stack direction="row" px={1}>
            <w3m-account-button balance="hide" />
          </Stack>
        )}

        <Stack px={3} py={2} spacing={2} sx={{ maxHeight: '100vh' }}>
          <Stack sx={{ width: '100%' }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
          </Stack>
          <Divider />
          <Stack spacing={2} direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle2" sx={{ color: '#676667' }}>
              All Chats
            </Typography>
            <div>
              <IconButton onClick={onOpenMenu}>
                <Plus style={{ color: theme.palette.primary.main }} />
              </IconButton>
              <Menu
                // id="basic-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onCloseMenu}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem
                  onClick={() => {
                    dispatch(OpenDialogCreateChannel());
                    onCloseMenu();
                  }}
                >
                  <span style={{ width: '26px' }}>
                    <UsersThree size={22} />
                  </span>
                  <span style={{ fontSize: 14, marginLeft: 10 }}>New channel</span>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(OpenDialogNewDirectMessage());
                    onCloseMenu();
                  }}
                >
                  <span style={{ width: '26px' }}>
                    <User size={18} />
                  </span>
                  <span style={{ fontSize: 14, marginLeft: 10 }}>New direct message</span>
                </MenuItem>
              </Menu>
            </div>
          </Stack>
          <Stack sx={{ flexGrow: 1, overflow: 'scroll', paddingBottom: '40px' }}>
            <SimpleBarStyle timeout={500} clickOnTrack={false}>
              <Stack spacing={2}>
                {/* Chat List */}
                {listChannel &&
                  listChannel.map(item => {
                    return <ChatElement key={item.id} channel={item} />;
                  })}
              </Stack>
            </SimpleBarStyle>
          </Stack>
        </Stack>
      </Box>
      {openDialogCreateChannel && <CreateChannel />}
      {openDialogNewDirectMessage && <NewDirectMessage />}
    </>
  );
};

export default Channels;
