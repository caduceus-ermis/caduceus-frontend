import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Dialog,
  DialogContent,
  DialogTitle,
  Slide,
  Button,
  Paper,
  Divider,
} from '@mui/material';
import { ArrowLeft, MagnifyingGlass, UserCirclePlus } from 'phosphor-react';
import useResponsive from '../../hooks/useResponsive';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateSidebarType, showSnackbar } from '../../redux/slices/app';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MemberElement } from '../../components/MemberElement';
import FormProvider from '../../components/hook-form/FormProvider';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { SimpleBarStyle } from '../../components/Scrollbar';
import MemberAvatar from '../../components/MemberAvatar';
import RHFAutocompleteMember from '../../components/hook-form/RHFAutocompleteMember';
import { formatString } from '../../utils/commons';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const MemberInvitation = ({ openDialog, onCloseDialog, setMembersInChannel, membersInChannel }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { currentChannel } = useSelector(state => state.channel);

  const [isLoading, setIsLoading] = useState(false);

  const NewGroupSchema = Yup.object().shape({
    members: Yup.array().min(1, 'Must have at least 1 members'),
  });

  const defaultValues = {
    members: [],
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const { reset, watch, setValue, handleSubmit } = methods;

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const response = await currentChannel.addMembers(data.members.map(member => member.id));
      if (response) {
        await currentChannel.watch();
        setMembersInChannel(prev => [...prev, ...watch('members')]);
        setIsLoading(false);
        onCloseDialog();
        reset();
        dispatch(showSnackbar({ severity: 'success', message: 'Members added successfully' }));
      }
    } catch (error) {
      setIsLoading(false);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
    }
  };

  const onRemoveMember = member => {
    setValue(
      'members',
      watch('members').filter(item => item.id !== member.id),
    );
  };

  const selectedMembers = watch('members');

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openDialog}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseDialog}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle>{'Invite members to this channel'}</DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <RHFAutocompleteMember
              name="members"
              label="Members"
              multiple
              ChipProps={{ size: 'medium' }}
              getOptionDisabled={option => membersInChannel.some(member => member.id === option.id)}
            />
            <Paper elevation={2} sx={{ height: 350, overflowY: 'auto' }}>
              {selectedMembers.length === 0 && (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.palette.background.paper,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  p={1}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: theme.palette.text.secondary,
                      fontWeight: 400,
                    }}
                  >
                    No members selected
                  </Typography>
                </Box>
              )}

              {selectedMembers.map(member => {
                return (
                  <Box
                    sx={{
                      width: '100%',
                      backgroundColor: theme.palette.background.paper,
                    }}
                    p={1}
                    key={member.id}
                  >
                    <Stack direction="row" alignItems={'center'} justifyContent="space-between">
                      <Stack direction="row" alignItems={'center'} spacing={2}>
                        <MemberAvatar member={member} width={30} height={30} />
                        <Stack spacing={0.3}>
                          <Typography variant="subtitle2">
                            {formatString(member.name ? member.name : member.id)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Stack direction={'row'} spacing={2} alignItems={'center'}>
                        <Button
                          color="error"
                          onClick={() => {
                            onRemoveMember(member);
                          }}
                        >
                          Remove
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
                );
              })}
            </Paper>

            <Stack spacing={2} direction={'row'} alignItems="center" justifyContent={'end'}>
              <LoadingButton
                type="submit"
                variant="contained"
                loading={isLoading}
                sx={{ width: '100%' }}
                disabled={selectedMembers.length === 0}
              >
                Invite member
              </LoadingButton>
            </Stack>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

const Members = () => {
  const dispatch = useDispatch();
  const { currentChannel } = useSelector(state => state.channel);
  const { all_members } = useSelector(state => state.member);

  const theme = useTheme();
  const isDesktop = useResponsive('up', 'md');

  const [openDialog, setOpenDialog] = useState(false);
  const [membersInChannel, setMembersInChannel] = useState([]);

  useEffect(() => {
    if (currentChannel) {
      const membersInChannel =
        all_members &&
        all_members.filter(member =>
          Object.values(currentChannel.state.members)
            .map(it => it.user_id)
            .includes(member.id),
        );
      setMembersInChannel(membersInChannel);
    }
  }, [currentChannel, all_members]);

  const onOpenDialog = () => {
    setOpenDialog(true);
  };

  const onCloseDialog = () => {
    setOpenDialog(false);
  };

  const onRemoveMember = async data => {
    const response = await currentChannel.removeMembers([String(data.user_id)]);
    if (response) {
      setMembersInChannel(response.members);
    }
  };

  return (
    <Box
      sx={{
        width: !isDesktop ? '100vw' : 320,
        maxHeight: '100vh',
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
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
            sx={{ height: '100%' }}
            direction="row"
            alignItems={'center'}
            spacing={2}
            p={2}
            justifyContent="space-between"
          >
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType('CHANNEL'));
              }}
            >
              <ArrowLeft />
            </IconButton>
            <Typography variant="subtitle2" sx={{ flex: 1, textAlign: 'left' }}>
              Members
            </Typography>
            <IconButton onClick={onOpenDialog}>
              <UserCirclePlus />
            </IconButton>
          </Stack>
        </Box>
        <Stack
          sx={{
            height: '100%',
            position: 'relative',
            flexGrow: 1,
            // overflow: 'scroll',
          }}
          spacing={2}
          p={2}
        >
          <Stack sx={{ width: '100%', height: '100%' }} spacing={2}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} />
            </Search>
            <Divider />
            <div style={{ overflowY: 'auto', height: 'calc(100% - 135px)' }}>
              <SimpleBarStyle timeout={500} clickOnTrack={false}>
                <Stack spacing={2}>
                  {membersInChannel.map(member => {
                    return <MemberElement key={member.id} data={member} onRemoveMember={onRemoveMember} />;
                  })}
                </Stack>
              </SimpleBarStyle>
            </div>
          </Stack>
        </Stack>
      </Stack>

      <MemberInvitation
        openDialog={openDialog}
        onCloseDialog={onCloseDialog}
        setMembersInChannel={setMembersInChannel}
        membersInChannel={membersInChannel}
      />
    </Box>
  );
};

export default Members;

export { MemberInvitation };
