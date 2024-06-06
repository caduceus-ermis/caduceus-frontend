import React, { useEffect, useState } from 'react';
import { Badge, Box, Stack, Typography } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ConnectCurrentChannel, FetchAllUnreadCount, SetMarkReadChannel } from '../redux/slices/channel';
import ChannelAvatar from './ChannelAvatar';
import { getChannelName } from '../utils/commons';

const truncateText = (string, n) => {
  return string?.length > n ? `${string?.slice(0, n)}...` : string;
};

const StyledChatBox = styled(Box)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
    '& .optionsMore': {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    '& .optionsNoti': {
      display: 'none',
    },
  },
}));

const ChatElement = ({ channel }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { currentChannel, allUnreadCount } = useSelector(state => state.channel);
  const { all_members } = useSelector(state => state.member);
  const { user_id } = useSelector(state => state.auth);

  const channelIdSelected = currentChannel?.data.id;
  const [lastMessage, setLastMessage] = useState('');
  const [count, setCount] = useState(0);

  useEffect(() => {
    // get unread count
    const listChannel = allUnreadCount?.channels || [];
    const unreadChannel = listChannel.find(item2 => item2.channel_id === channel?.data.id);
    setCount(unreadChannel ? unreadChannel.unread_count : 0);
  }, [channel, allUnreadCount]);

  useEffect(() => {
    if (channel) {
      // get last message
      const listMessage = channel?.state.messages;
      const lastMessage = listMessage.length > 0 ? listMessage[listMessage.length - 1] : '';
      setLastMessage(lastMessage);

      const handleWatchChannel = event => {
        setLastMessage(event.message); // listen last message

        if (event.channel_id === channel?.data.id) {
          setCount(event.unread_count);

          if (channelIdSelected && channelIdSelected === event.channel_id && event.user.id !== user_id) {
            setTimeout(function () {
              dispatch(SetMarkReadChannel(channel));
              setCount(0);
            }, 500);
          }
        }
      };

      channel.on('message.new', handleWatchChannel);

      return () => {
        channel.off('message.new', handleWatchChannel);
      };
    }
  }, [channel, user_id, channelIdSelected]);

  const selectedChatId = channelIdSelected?.toString();
  let isSelected = selectedChatId === channel?.data.id;

  if (!selectedChatId) {
    isSelected = false;
  }

  return (
    <StyledChatBox
      onClick={() => {
        const chanelId = channel.data.id;
        const channelType = channel.data.type;

        dispatch(ConnectCurrentChannel(chanelId, channelType));

        setTimeout(function () {
          dispatch(FetchAllUnreadCount());
        }, 500);
      }}
      sx={{
        width: '100%',

        borderRadius: 1,

        backgroundColor: isSelected
          ? theme.palette.mode === 'light'
            ? alpha(theme.palette.primary.main, 0.5)
            : theme.palette.primary.main
          : theme.palette.mode === 'light'
            ? '#fff'
            : theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={'center'} justifyContent="space-between">
        <Stack direction="row" spacing={2} sx={{ width: 'calc(100% - 55px)' }}>
          <ChannelAvatar channel={channel} width={40} height={40} />
          <Stack spacing={0.3} sx={{ width: 'calc(100% - 48px)' }}>
            <Typography
              variant="subtitle2"
              sx={{ width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
              {getChannelName(channel, all_members)}
            </Typography>
            <Typography variant="caption">{truncateText(lastMessage.text, 20)}</Typography>
          </Stack>
        </Stack>
        <Stack spacing={2} alignItems={'center'} sx={{ width: 55 }}>
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {dayjs(lastMessage?.created_at).format('hh:mm A')}
          </Typography>
          <Badge className="unread-count" color="primary" badgeContent={count} />
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export default ChatElement;
