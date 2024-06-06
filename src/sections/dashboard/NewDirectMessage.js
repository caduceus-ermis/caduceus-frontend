import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Button, Dialog, DialogContent, DialogTitle, Slide, Stack } from '@mui/material';

import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormProvider from '../../components/hook-form/FormProvider';
import { useDispatch, useSelector } from 'react-redux';
import { client } from '../../client';
import { ChatType } from '../../constants/commons-const';
import { LoadingButton } from '@mui/lab';
import { showSnackbar } from '../../redux/slices/app';
import { AddChannel } from '../../redux/slices/channel';
import { CloseDialogNewDirectMessage } from '../../redux/slices/dialog';
import RHFAutocompleteMember from '../../components/hook-form/RHFAutocompleteMember';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewDirectMessageForm = ({ onCloseDialogNewDirectMessage }) => {
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channel);
  const { user_id } = useSelector(state => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const [friendIds, setFriendIds] = useState([]);

  useEffect(() => {
    const channelsDirect = channels.filter(channel => channel.data.type === ChatType.MESSAGING);
    if (channelsDirect.length > 0) {
      const friendIds = channelsDirect.map(channel => {
        const dataUser = Object.values(channel.data.members).find(member => member.user.id !== user_id);
        return dataUser ? dataUser.user.id : '';
      });

      setFriendIds(friendIds);
    }
  }, [channels, user_id]);

  const NewGroupSchema = Yup.object().shape({
    member: Yup.object().nullable().required('Member is required'),
  });

  const defaultValues = {
    member: null,
  };

  const methods = useForm({
    resolver: yupResolver(NewGroupSchema),
    defaultValues,
  });

  const { reset, handleSubmit } = methods;

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const channel = await client.channel(ChatType.MESSAGING, {
        members: [data.member.id, user_id],
      });
      const response = await channel.create();

      if (response) {
        dispatch(showSnackbar({ severity: 'success', message: 'Add new chat successfully!' }));
        dispatch(AddChannel(channel));
        setIsLoading(false);
        reset();
        onCloseDialogNewDirectMessage();
      }
    } catch (error) {
      reset();
      setIsLoading(false);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFAutocompleteMember
          name="member"
          label="Member"
          ChipProps={{ size: 'medium' }}
          getOptionDisabled={option => option.id === user_id || friendIds.includes(option.id)}
        />
        <Stack spacing={2} direction={'row'} alignItems="center" justifyContent={'end'}>
          <Button
            onClick={() => {
              reset();
              onCloseDialogNewDirectMessage();
            }}
          >
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isLoading}>
            Start chatting
          </LoadingButton>
        </Stack>
      </Stack>
    </FormProvider>
  );
};

const NewDirectMessage = () => {
  const dispatch = useDispatch();
  const { openDialogNewDirectMessage } = useSelector(state => state.dialog);

  const onCloseDialogNewDirectMessage = () => {
    dispatch(CloseDialogNewDirectMessage());
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={openDialogNewDirectMessage}
      TransitionComponent={Transition}
      keepMounted
      onClose={onCloseDialogNewDirectMessage}
      aria-describedby="alert-dialog-slide-description"
      sx={{ p: 4 }}
    >
      <DialogTitle>{'Start new chat'}</DialogTitle>

      <DialogContent sx={{ mt: 4 }}>
        <NewDirectMessageForm onCloseDialogNewDirectMessage={onCloseDialogNewDirectMessage} />
      </DialogContent>
    </Dialog>
  );
};

export default NewDirectMessage;
