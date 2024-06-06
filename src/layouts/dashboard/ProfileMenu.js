import React from 'react';
import { Avatar, Box, Fade, Menu, MenuItem, Stack } from '@mui/material';

import { Profile_Menu } from '../../data';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutUser } from '../../redux/slices/auth';
import { useDisconnect } from 'wagmi';
import { OpenDialogProfile } from '../../redux/slices/dialog';

const ProfileMenu = () => {
  const { disconnect } = useDisconnect();
  const { isLoginWallet } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onLogout = () => {
    if (isLoginWallet) {
      disconnect();
    } else {
      dispatch(LogoutUser());
    }
  };

  return (
    <>
      <Avatar
        id="profile-positioned-button"
        aria-controls={openMenu ? 'profile-positioned-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        alt=""
        onClick={handleClick}
      />
      <Menu
        MenuListProps={{
          'aria-labelledby': 'fade-button',
        }}
        TransitionComponent={Fade}
        id="profile-positioned-menu"
        aria-labelledby="profile-positioned-button"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <Box p={1}>
          <Stack spacing={1}>
            {Profile_Menu.map((el, idx) => (
              <MenuItem onClick={handleClose} key={idx}>
                <Stack
                  onClick={() => {
                    if (idx === 0) {
                      dispatch(OpenDialogProfile());
                    } else {
                      onLogout();
                    }
                  }}
                  sx={{ width: 100 }}
                  direction="row"
                  alignItems={'center'}
                  justifyContent="space-between"
                >
                  <span>{el.title}</span>
                  {el.icon}
                </Stack>{' '}
              </MenuItem>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export default ProfileMenu;
