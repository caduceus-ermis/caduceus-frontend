import { useState } from 'react';
import * as Yup from 'yup';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, Alert, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import FormProvider, { RHFTextField } from '../../components/hook-form';
import { Eye, EyeSlash } from 'phosphor-react';
import { useDispatch, useSelector } from 'react-redux';
import { RegisterUser } from '../../redux/slices/auth';

// ----------------------------------------------------------------------
const userNameRegex = /^[a-z0-9_-]+$/;

export default function AuthRegisterForm() {
  const dispatch = useDispatch();
  const { isLoading } = useSelector(state => state.app);
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    user_name: Yup.string()
      .required('User name is required')
      .matches(userNameRegex, 'User name must be letters, numbers, underscores, or hyphens'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    user_name: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = async data => {
    try {
      // submit data to backend
      dispatch(RegisterUser(data));
    } catch (error) {
      reset();
      setError('afterSubmit', {
        ...error,
        message: error.message,
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} mb={4}>
        {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

        <RHFTextField name="user_name" label="User name" />

        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
        sx={{
          bgcolor: 'text.primary',
          color: theme => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          '&:hover': {
            bgcolor: 'text.primary',
            color: theme => (theme.palette.mode === 'light' ? 'common.white' : 'grey.800'),
          },
        }}
      >
        Create Account
      </LoadingButton>
    </FormProvider>
  );
}
