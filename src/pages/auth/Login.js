import { Stack, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAccount, useDisconnect, useSignTypedData } from 'wagmi';
import { useCallback, useEffect, useState } from 'react';
import axiosWalletInstance from '../../utils/axiosWallet';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUserByGoogle, LoginUserByWallet } from '../../redux/slices/auth';
import { showSnackbar } from '../../redux/slices/app';
import { GoogleLogin } from '@react-oauth/google';

// ----------------------------------------------------------------------

export default function LoginPage() {
  const dispatch = useDispatch();
  const { severity } = useSelector(state => state.app.snackbar);
  const { connector, address } = useAccount();
  const { disconnect } = useDisconnect();

  const { open } = useWeb3Modal();
  const { signTypedDataAsync } = useSignTypedData();

  const [isLoading, setIsLoading] = useState(false);
  const isResetWallet = window.localStorage.getItem('isResetWallet');

  const createNonce = length => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const onLoginWallet = useCallback(async () => {
    try {
      if (address && connector) {
        if ((severity && severity === 'error') || isResetWallet === 'true') {
          //  fix issue reconecting wallet
          disconnect();
        } else {
          setIsLoading(true);
          const response = await axiosWalletInstance.post('/auth/start', {
            address,
          });

          if (response.status === 200) {
            const challenge = JSON.parse(response.data.challenge);
            const { types, domain, primaryType, message } = challenge;
            const nonce = createNonce(20);
            let signature = '';

            await signTypedDataAsync(
              {
                types,
                domain,
                connector,
                primaryType,
                message,
              },
              {
                onSuccess: s => {
                  signature = s;
                },
              },
            );

            if (signature) {
              const data = {
                address,
                signature,
                nonce,
              };

              dispatch(LoginUserByWallet(data));
              setIsLoading(false);

              // const responseToken = await axiosWalletInstance.post('/auth', data);
              // if (responseToken.status === 200) {
              //   dispatch(LoginUserByWallet(address, responseToken.data.token));
              //   setIsLoading(false);
              // }
            }
          }
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      dispatch(showSnackbar({ severity: 'error', message: error.toString() }));
      disconnect();
      setIsLoading(false);
    }
  }, [dispatch, address, connector, severity, isResetWallet]);

  useEffect(() => {
    onLoginWallet();
  }, [onLoginWallet]);

  return (
    <>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Login to Caduceus</Typography>
      </Stack>
      <GoogleLogin
        onSuccess={credentialResponse => {
          dispatch(LoginUserByGoogle(credentialResponse.credential));
        }}
        onError={error => {
          dispatch(showSnackbar({ severity: 'error', message: error.message || 'Something went wrong' }));
        }}
      />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        variant="outlined"
        sx={{ textTransform: 'none' }}
        loading={isLoading}
        onClick={() => {
          window.localStorage.setItem('isResetWallet', 'false');
          open();
        }}
      >
        Connect wallet
      </LoadingButton>
    </>
  );
}
