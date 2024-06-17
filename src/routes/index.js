import { Suspense, lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

// layouts
import DashboardLayout from '../layouts/dashboard';
import AuthLayout from '../layouts/auth';

// config
import { DEFAULT_PATH } from '../config';
import LoadingScreen from '../components/LoadingScreen';

const Loadable = Component => props => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  return useRoutes([
    {
      path: '/auth',
      element: <AuthLayout />,
      children: [
        { path: 'login', element: <LoginPage /> },
        { path: 'register', element: <RegisterPage /> },
      ],
    },
    {
      path: '/',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={DEFAULT_PATH} replace />, index: true },
        { path: 'channels', element: <GeneralApp /> },
        { path: 'purchased', element: <PagePurchased /> },

        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },

    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

const GeneralApp = Loadable(lazy(() => import('../pages/dashboard/GeneralApp')));
const PagePurchased = Loadable(lazy(() => import('../pages/purchased')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));

const LoginPage = Loadable(lazy(() => import('../pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('../pages/auth/Register')));
