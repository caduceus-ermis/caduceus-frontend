import React from 'react';
import { Box, Stack, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { DotsThreeVertical, SignOut, Trash } from 'phosphor-react';
import MemberAvatar from './MemberAvatar';
import { formatString } from '../utils/commons';

const user_id = window.localStorage.getItem('user_id');

const StyledChatBox = styled(Box)(({ theme }) => ({
  '&:hover': {
    cursor: 'pointer',
  },
}));

const StyledMenu = styled(props => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
  },
}));

const MemberElement = ({ data, onRemoveMember }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const name = data.name ? data.name : data.id;
  const userId = data.id;
  const myUserId = user_id;

  const onOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const onCloseMenu = () => {
    setAnchorEl(null);
  };

  const onRemove = data => {
    onRemoveMember(data);
    onCloseMenu();
  };

  return (
    <StyledChatBox
      sx={{
        width: '100%',

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack direction="row" alignItems={'center'} justifyContent="space-between">
        <Stack direction="row" alignItems={'center'} spacing={2}>
          <MemberAvatar member={data} width={40} height={40} />
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{formatString(name)}</Typography>
          </Stack>
        </Stack>
        <Stack direction={'row'} spacing={2} alignItems={'center'}>
          <IconButton onClick={onOpenMenu}>
            <DotsThreeVertical size={22} />
          </IconButton>

          <StyledMenu anchorEl={anchorEl} open={open} onClose={onCloseMenu}>
            <MenuItem onClick={() => onRemove(data)} sx={{ color: theme.palette.error.main }}>
              {userId !== myUserId ? (
                <>
                  <Trash size={18} style={{ marginRight: 10 }} />
                  Remove
                </>
              ) : (
                <>
                  <SignOut size={18} style={{ marginRight: 10 }} />
                  Leave
                </>
              )}
            </MenuItem>
          </StyledMenu>
        </Stack>
      </Stack>
    </StyledChatBox>
  );
};

export { MemberElement };
