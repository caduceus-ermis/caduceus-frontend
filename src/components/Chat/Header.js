import React from 'react';
import { Box, Button, IconButton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { MagnifyingGlass, Phone, VideoCamera } from 'phosphor-react';
import useResponsive from '../../hooks/useResponsive';
import { ToggleSidebar } from '../../redux/slices/app';
import { useDispatch, useSelector } from 'react-redux';
import ChannelAvatar from '../ChannelAvatar';
import { getChannelName } from '../../utils/commons';

const ChatHeader = ({ currentChannel }) => {
  const dispatch = useDispatch();
  const isMobile = useResponsive('between', 'md', 'xs', 'sm');
  const theme = useTheme();
  const { all_members } = useSelector(state => state.member);

  return (
    <>
      <Box
        p={2}
        width={'100%'}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Stack
          alignItems={'center'}
          direction={'row'}
          sx={{ width: '100%', height: '100%' }}
          justifyContent="space-between"
        >
          <Stack spacing={1} direction="row" alignItems="center">
            <Box>
              <ChannelAvatar channel={currentChannel} width={40} height={40} />
            </Box>

            <Stack spacing={0.2}>
              <Button
                onClick={() => {
                  dispatch(ToggleSidebar());
                }}
                sx={{ textTransform: 'none' }}
              >
                <Typography variant="h6" sx={{ color: theme.palette.text.primary }}>
                  {getChannelName(currentChannel, all_members)}
                </Typography>
                {/* <Typography variant="caption">Online</Typography> */}
              </Button>
            </Stack>
          </Stack>
          <Stack direction={'row'} alignItems="center" spacing={isMobile ? 1 : 3}>
            <IconButton>
              <VideoCamera />
            </IconButton>
            <IconButton>
              <Phone />
            </IconButton>
            {!isMobile && (
              <IconButton>
                <MagnifyingGlass />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default ChatHeader;
