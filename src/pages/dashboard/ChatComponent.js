import { Stack, Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { SimpleBarStyle } from '../../components/Scrollbar';
import { ChatHeader, ChatFooter } from '../../components/Chat';
import useResponsive from '../../hooks/useResponsive';
import { AttachmentMsg, TextMsg } from '../../sections/dashboard/Conversation';
import { useDispatch, useSelector } from 'react-redux';
import { formatString, getMemberInfo } from '../../utils/commons';
import dayjs from 'dayjs';
import InfiniteScroll from 'react-infinite-scroll-component';
import { LoadingSpinner } from '../../components/animate';
import MemberAvatar from '../../components/MemberAvatar';
import { showSnackbar } from '../../redux/slices/app';

const StyledMessage = styled(Stack)(({ theme }) => ({
  '&:hover': {
    '& .messageActions': {
      visibility: 'visible',
    },
  },
  '&.myMessage': {
    '& .linkUrl': {
      color: '#fff',
    },
  },
}));

const MessageList = ({ isMobile, messages, typing }) => {
  const theme = useTheme();
  const { user_id } = useSelector(state => state.auth);
  const { all_members } = useSelector(state => state.member);

  return (
    <Box p={isMobile ? 1 : 5}>
      <Stack spacing={3}>
        {messages &&
          messages.map((el, idx) => {
            const isMyMessage = el.user.id === user_id;
            const memberInfo = getMemberInfo(el.user.id, all_members);
            const name = memberInfo ? formatString(memberInfo.name) : formatString(el.user.id);
            return (
              // Text Message
              <StyledMessage
                direction="row"
                justifyContent={isMyMessage ? 'end' : 'start'}
                key={el.id}
                className={isMyMessage ? 'myMessage' : ''}
              >
                <Stack sx={{ margin: isMyMessage ? '0 0 0 15px' : '0 15px 0 0', order: isMyMessage ? 2 : 1 }}>
                  <MemberAvatar member={memberInfo} width={32} height={32} />
                </Stack>

                <Stack sx={{ order: isMyMessage ? 1 : 2, width: '700px' }}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    sx={{ justifyContent: isMyMessage ? 'right' : 'left', margin: '0 -5px' }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: theme.palette.text,
                        fontSize: 14,
                        fontWeight: 700,
                        order: isMyMessage ? 2 : 1,
                        padding: '0 5px',
                      }}
                    >
                      {name}
                    </Typography>
                    <Typography variant="body1" sx={{ fontSize: 12, padding: '0 5px', order: isMyMessage ? 1 : 2 }}>
                      {dayjs(el.created_at).format('hh:mm A')}
                    </Typography>
                  </Stack>
                  {el.attachments && el.attachments.length > 0 ? (
                    <AttachmentMsg el={{ ...el, isMyMessage }} key={el.id} />
                  ) : (
                    <TextMsg el={{ ...el, isMyMessage }} key={el.id} />
                  )}
                </Stack>
              </StyledMessage>
            );
          })}
      </Stack>
      {typing && (
        <Box
          // px={1.5}
          // py={1.5}
          sx={{
            position: 'fixed',
            zIndex: 1,
            bottom: 95,
            color: theme.palette.text.secondary,
          }}
        >
          <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
            {typing}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

const ChatComponent = () => {
  const dispatch = useDispatch();
  const isMobile = useResponsive('between', 'md', 'xs', 'sm');
  const theme = useTheme();
  const messageListRef = useRef(null);
  const { currentChannel } = useSelector(state => state.channel);
  const { user_id } = useSelector(state => state.auth);
  const { all_members } = useSelector(state => state.member);

  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState('');
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (currentChannel) {
      setMessages(currentChannel.state.messages);

      const handleMessages = event => {
        setMessages(currentChannel.state.messages);
        messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
      };

      const handleTypingStart = event => {
        if (user_id !== event.user.id) {
          const memberInfo = getMemberInfo(event.user.id, all_members);
          const name = memberInfo ? formatString(memberInfo.name) : formatString(event.user.id);
          setTyping(`${name} is typing ...`);
        } else {
          setTyping('');
        }
      };

      const handleTypingStop = event => {
        setTyping('');
      };

      currentChannel.on('message.new', handleMessages);
      currentChannel.on('typing.start', handleTypingStart);
      currentChannel.on('typing.stop', handleTypingStop);

      return () => {
        currentChannel.off('message.new', handleMessages);
        currentChannel.off('typing.start', handleTypingStart);
        currentChannel.off('typing.stop', handleTypingStop);
      };
    }
  }, [currentChannel, user_id]);

  const fetchMoreMessages = async () => {
    try {
      setLoadingMore(true);
      const response = await currentChannel.query({
        messages: { limit: 50, id_lt: messages[0]?.id },
      });

      if (response) {
        const allMessages = currentChannel.state.messages;

        setMessages(allMessages);
        setLoadingMore(false);
      }
    } catch (error) {
      setLoadingMore(false);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
    }
  };

  return (
    <Stack height={'100%'} maxHeight={'100vh'} width={isMobile ? '100vw' : 'auto'}>
      {/*  */}
      <ChatHeader currentChannel={currentChannel} />
      <Box
        id="scrollableDiv"
        ref={messageListRef}
        width={'100%'}
        sx={{
          position: 'relative',
          flexGrow: 1,
          overflow: 'scroll',

          backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background,

          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'column-reverse',
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchMoreMessages}
          style={{ display: 'flex', flexDirection: 'column-reverse', position: 'relative' }}
          inverse={true}
          hasMore={true}
          loader={
            loadingMore && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                <LoadingSpinner />
              </div>
            )
          }
          scrollableTarget="scrollableDiv"
        >
          <SimpleBarStyle timeout={500} clickOnTrack={false}>
            <MessageList isMobile={isMobile} messages={messages} typing={typing} />
          </SimpleBarStyle>
        </InfiniteScroll>
      </Box>
      <ChatFooter currentChannel={currentChannel} />
    </Stack>
  );
};

export default ChatComponent;

export { MessageList };
