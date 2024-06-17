import React from 'react';
import { useTheme } from '@mui/material/styles';

import { Box, IconButton, Stack } from '@mui/material';
import AntSwitch from '../../components/AntSwitch';

import Logo from '../../assets/Images/ermis.svg';

import useSettings from '../../hooks/useSettings';
import { Nav_Buttons } from '../../data';

import ProfileMenu from './ProfileMenu';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UpdateTab } from '../../redux/slices/app';
import { CurrencyBtc } from 'phosphor-react';

const getPath = index => {
  switch (index) {
    case 0:
      return '/channels';

    default:
      break;
  }
};

const SideBar = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { tab } = useSelector(state => state.app);

  const navigate = useNavigate();

  const { onToggleMode } = useSettings();

  const selectedTab = tab;

  const handleChangeTab = index => {
    dispatch(UpdateTab({ tab: index }));
    navigate(getPath(index));
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: 100,

        backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.paper,
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
      }}
    >
      <Stack py={3} alignItems={'center'} justifyContent="space-between" sx={{ height: '100%' }}>
        <Stack alignItems={'center'} spacing={4}>
          <Box
            sx={{
              height: 64,
              width: 64,
              borderRadius: 1.5,
              backgroundColor: 'whitesmoke',
            }}
            p={1}
          >
            <img src={Logo} alt="Tawk" />
          </Box>
          <Stack sx={{ width: 'max-content' }} direction="column" alignItems={'center'} spacing={3}>
            {Nav_Buttons.map(el => {
              return el.index === selectedTab ? (
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                  p={1}
                  key={el.index}
                >
                  <IconButton
                    onClick={() => {
                      handleChangeTab(el.index);
                    }}
                    sx={{ width: 'max-content', color: '#ffffff' }}
                  >
                    {el.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => {
                    handleChangeTab(el.index);
                  }}
                  sx={{
                    width: 'max-content',
                    color: theme.palette.mode === 'light' ? '#080707' : theme.palette.text.primary,
                  }}
                  key={el.index}
                >
                  {el.icon}
                </IconButton>
              );
            })}
          </Stack>
        </Stack>
        <Stack spacing={4}>
          <IconButton onClick={() => navigate('/purchased')}>
            <CurrencyBtc size={24} color={theme.palette.primary.main} />
          </IconButton>
          <AntSwitch defaultChecked={theme.palette.mode === 'dark'} onChange={onToggleMode} />
          <ProfileMenu />
        </Stack>
      </Stack>
    </Box>
  );
};

export default SideBar;
