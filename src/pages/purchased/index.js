import { useTheme } from '@emotion/react';
import { Box, IconButton, Stack } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { abi, contractAddress } from '../../contractConfig';
import Web3 from 'web3';
import { useDispatch } from 'react-redux';
import { UpdateIsLoading, showSnackbar } from '../../redux/slices/app';
import { LoadingButton } from '@mui/lab';
import { CaretLeft } from 'phosphor-react';
import { useNavigate } from 'react-router-dom';

const PagePurchased = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [apiKeyPrice, setApiKeyPrice] = useState('');
  const [purchasedApiKey, setPurchasedApiKey] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        await window.ethereum.enable();

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        const contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
        setContract(contractInstance);
        const price = await contractInstance.methods.apiKeyPrice().call();
        setApiKeyPrice(web3Instance.utils.fromWei(price, 'ether'));
      } else {
        console.error('MetaMask not detected');
      }
    };

    loadBlockchainData();
  }, []);

  const onBuy = async () => {
    try {
      if (contract) {
        dispatch(UpdateIsLoading({ isLoading: true }));
        const priceInWei = await contract.methods.apiKeyPrice().call();
        await contract.methods.purchaseApiKey(account).send({ from: account, value: priceInWei });

        const purchasedKey = await contract.methods.getApiKey(account).call();
        if (purchasedKey) {
          dispatch(UpdateIsLoading({ isLoading: false }));
          dispatch(showSnackbar({ severity: 'success', message: `API Key purchased: ${purchasedKey}` }));
        }
        setPurchasedApiKey(purchasedKey);
      }
    } catch (error) {
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
      dispatch(UpdateIsLoading({ isLoading: false }));
    }
  };

  return (
    <Stack direction="row" justifyContent="center" sx={{ padding: '40px', width: '100%' }}>
      <Box
        sx={{
          padding: '15px',
          borderRadius: '12px',
          width: '100%',
          position: 'relative',
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
        }}
      >
        <IconButton onClick={() => navigate('/channels')}>
          <CaretLeft size={22} />
        </IconButton>
        <div style={{ padding: 15 }}>
          <h2 style={{ marginBottom: 15 }}>Buy API key for use Ermis SDK</h2>
          <p style={{ marginBottom: 15 }}>
            API Key Price: <strong>{apiKeyPrice} CFX</strong>
          </p>
          <LoadingButton color="primary" variant="contained" onClick={onBuy}>
            Buy
          </LoadingButton>

          {purchasedApiKey && (
            <p style={{ marginTop: 15 }}>
              Your Purchased API Key: <strong>{purchasedApiKey}</strong>
            </p>
          )}
        </div>
      </Box>
    </Stack>
  );
};

export default PagePurchased;
