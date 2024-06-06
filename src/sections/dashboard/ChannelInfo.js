import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  Slide,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { CaretRight, X, Users, SignOut, Trash } from 'phosphor-react';
import useResponsive from '../../hooks/useResponsive';
import { useDispatch, useSelector } from 'react-redux';
import { ToggleSidebar, UpdateSidebarType } from '../../redux/slices/app';
import ChannelAvatar from '../../components/ChannelAvatar';
import { getChannelName } from '../../utils/commons';
import { ChatType } from '../../constants/commons-const';
import ClipboardCopy from '../../components/ClipboardCopy';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const LeaveDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Leave this channel</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to leave this Channel?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteChatDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this chat</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this chat?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const ChannelInfo = () => {
  const dispatch = useDispatch();

  const { currentChannel } = useSelector(state => state.channel);
  const { user_id } = useSelector(state => state.auth);
  const { all_members } = useSelector(state => state.member);

  const isDirect = currentChannel?.data.type === ChatType.MESSAGING;
  const membersCount = Object.keys(currentChannel?.state.members).length || '';

  const theme = useTheme();

  const isDesktop = useResponsive('up', 'md');

  const [openLeave, setOpenLeave] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [otherMemberId, setOtherMemberId] = useState('');

  useEffect(() => {
    if (currentChannel) {
      const members = Object.keys(currentChannel.state.members);
      const otherMemberId = members.find(member => member !== user_id);
      setOtherMemberId(otherMemberId);
    }
  }, [currentChannel, user_id]);

  const handleCloseLeave = () => {
    setOpenLeave(false);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  return (
    <Box
      sx={{
        width: !isDesktop ? '100vw' : 320,
        maxHeight: '100vh',
      }}
    >
      <Stack sx={{ height: '100%' }}>
        <Box
          sx={{
            boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
            width: '100%',
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: '100%', p: 2 }}
            direction="row"
            alignItems={'center'}
            justifyContent="space-between"
            spacing={3}
          >
            <Typography variant="subtitle2">{isDirect ? 'User Info' : 'Channel Info'}</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSidebar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            height: '100%',
            position: 'relative',
            flexGrow: 1,
            overflow: 'scroll',
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems="center" direction="column" spacing={2}>
            <ChannelAvatar channel={currentChannel} width={80} height={80} />
            <Stack direction="column" alignItems="center">
              <Typography variant="article" fontWeight={600}>
                {getChannelName(currentChannel, all_members)}
              </Typography>
              {isDirect ? (
                <Typography style={{ fontSize: '12px', color: '#666' }} title={otherMemberId}>
                  <ClipboardCopy text={otherMemberId} />
                </Typography>
              ) : (
                <Typography style={{ fontSize: '12px', color: '#666' }}>{`${membersCount} members`}</Typography>
              )}
            </Stack>
          </Stack>
          <Divider />
          {/* ------------Media, Links & Docs--------------- */}
          {/* <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link size={21} />

              <Typography variant="subtitle2">Media, Links & Docs</Typography>
            </Stack>
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType('SHARED'));
              }}
            >
              <CaretRight />
            </IconButton>
          </Stack>
          <Stack direction={'row'} alignItems="center" spacing={2}>
            {[1, 2, 3].map(el => (
              <Box>
                <img src={faker.image.city()} alt={faker.internet.userName()} />
              </Box>
            ))}
          </Stack>
          <Divider /> */}

          {/* ------------Members--------------- */}
          {!isDirect && (
            <>
              <Stack direction="row" alignItems="center" justifyContent={'space-between'}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Users size={21} />

                  <Typography variant="subtitle2">Members</Typography>
                </Stack>

                <IconButton
                  onClick={() => {
                    dispatch(UpdateSidebarType('MEMBERS'));
                  }}
                >
                  <CaretRight />
                </IconButton>
              </Stack>
              <Divider />
            </>
          )}

          {/* ------------Actions--------------- */}
          <Stack direction="row" alignItems={'center'} spacing={2}>
            {isDirect ? (
              <Button
                onClick={() => {
                  setOpenDelete(true);
                }}
                fullWidth
                startIcon={<Trash />}
                variant="outlined"
                color="error"
              >
                Delete contact
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setOpenLeave(true);
                }}
                fullWidth
                startIcon={<SignOut />}
                variant="outlined"
                color="error"
              >
                Leave
              </Button>
            )}
          </Stack>
        </Stack>
      </Stack>
      {openLeave && <LeaveDialog open={openLeave} handleClose={handleCloseLeave} />}
      {openDelete && <DeleteChatDialog open={openDelete} handleClose={handleCloseDelete} />}
    </Box>
  );
};

export default ChannelInfo;
