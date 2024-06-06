import React, { useEffect } from 'react';
import { Stack } from '@mui/material';
import { Navigate, Outlet } from 'react-router-dom';
import useResponsive from '../../hooks/useResponsive';
import SideNav from './SideNav';
import { useDispatch, useSelector } from 'react-redux';
import { client, connectUser } from '../../client';
import { FetchAllUnreadCount, FetchChannels } from '../../redux/slices/channel';
import { FetchAllMembers, FetchUserProfile } from '../../redux/slices/member';

const DashboardLayout = () => {
  const isDesktop = useResponsive('up', 'md');
  const dispatch = useDispatch();
  const { isLoggedIn, user_id, token } = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(FetchChannels());
    dispatch(FetchAllUnreadCount());
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      if (!client) {
        connectUser(user_id, token, dispatch);
      } else {
        dispatch(FetchAllMembers());
        dispatch(FetchUserProfile(user_id));
      }
    }
  }, [isLoggedIn, token, user_id, dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={'/auth/login'} />;
  }

  return (
    <>
      <Stack direction="row">
        {isDesktop && <SideNav />}

        <Outlet />
      </Stack>
    </>
  );
};

export default DashboardLayout;
