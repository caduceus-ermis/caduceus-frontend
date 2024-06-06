import { Box, IconButton, InputAdornment, Stack, TextField, Popover, Paper, Typography, Alert } from '@mui/material';
import {
  File,
  FileAudio,
  FilePdf,
  FileVideo,
  FileZip,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  X,
} from 'phosphor-react';
import { useTheme, styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react';
import useResponsive from '../../hooks/useResponsive';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { useDispatch, useSelector } from 'react-redux';
import uuidv4 from '../../utils/uuidv4';
import { LoadingSpinner } from '../animate';
import { getSizeInMb } from '../../utils/commons';
import { showSnackbar } from '../../redux/slices/app';

const StyledInput = styled(TextField)(({ theme }) => ({
  '& .MuiFilledInput-root': {
    padding: '12px',
    flexWrap: 'wrap',
  },
}));

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const ChatInput = ({
  setValue,
  value,
  inputRef,
  sendMessage,
  setAnchorElPicker,
  onChangeUpload,
  files,
  onRemoveFile,
}) => {
  const renderMedia = data => {
    const stylePaper = {
      borderRadius: '12px',
      height: '80px',
      padding: '12px',
      width: '150px',
    };

    const styleText = {
      display: '-webkit-box',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      WebkitLineClamp: 2,
      lineClamp: 2,
      WebkitBoxOrient: 'vertical',
      wordBreak: 'break-word',
      lineHeight: '1.2',
      fontSize: '14px',
    };

    const fileType = data.type.split('/')[0];

    const sizeInMB = getSizeInMb(data.size);

    switch (fileType) {
      case 'image':
        return (
          <img
            src={data.url}
            alt={data.name}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }}
          />
        );
      case 'video':
        return (
          <Paper elevation={3} sx={stylePaper}>
            <Stack direction="row">
              <FileVideo size={26} style={{ marginRight: 10 }} />
              <div style={{ flex: 1 }}>
                <Typography variant="body2" sx={styleText} title={data.name}>
                  {data.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, color: '#666' }}>
                  {sizeInMB}
                </Typography>
              </div>
            </Stack>
          </Paper>
        );
      case 'audio':
        return (
          <Paper elevation={3} sx={stylePaper}>
            <Stack direction="row">
              <FileAudio size={26} style={{ marginRight: 10 }} />
              <div style={{ flex: 1 }}>
                <Typography variant="body2" sx={styleText} title={data.name}>
                  {data.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, color: '#666' }}>
                  {sizeInMB}
                </Typography>
              </div>
            </Stack>
          </Paper>
        );
      case 'application':
        return (
          <Paper elevation={3} sx={stylePaper}>
            <Stack direction="row">
              {data.type === 'application/pdf' ? (
                <FilePdf size={26} style={{ marginRight: 10 }} />
              ) : data.type === 'application/zip' ? (
                <FileZip size={26} style={{ marginRight: 10 }} />
              ) : (
                <File size={26} style={{ marginRight: 10 }} />
              )}
              <div style={{ flex: 1 }}>
                <Typography variant="body2" sx={styleText} title={data.name}>
                  {data.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, color: '#666' }}>
                  {sizeInMB}
                </Typography>
              </div>
            </Stack>
          </Paper>
        );

      default:
        return (
          <Paper elevation={3} sx={stylePaper}>
            <Stack direction="row">
              <File size={26} style={{ marginRight: 10 }} />
              <div style={{ flex: 1 }}>
                <Typography variant="body2" sx={styleText} title={data.name}>
                  {data.name}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: 12, color: '#666' }}>
                  {sizeInMB}
                </Typography>
              </div>
            </Stack>
          </Paper>
        );
    }
  };

  return (
    <StyledInput
      inputRef={inputRef}
      value={value}
      onChange={async event => {
        setValue(event.target.value);
      }}
      fullWidth
      placeholder="Write a message..."
      variant="filled"
      multiline
      maxRows={3}
      InputProps={{
        disableUnderline: true,
        startAdornment: (
          <div style={{ padding: '10px 0', overflowX: 'auto', display: 'flex' }}>
            {files.map((item, index) => {
              return (
                <div style={{ position: 'relative', marginRight: 10, flex: 'none' }} key={index}>
                  {item.loading ? (
                    <Box
                      sx={{
                        backgroundColor: '#d6d6d6',
                        borderRadius: '12px',
                        width: '80px',
                        height: '80px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <LoadingSpinner />
                    </Box>
                  ) : item.error ? (
                    <Alert severity="error" sx={{ height: '80px', alignItems: 'center' }}>
                      Error
                    </Alert>
                  ) : (
                    renderMedia(item)
                  )}

                  <IconButton
                    edge="end"
                    aria-label="remove"
                    onClick={() => onRemoveFile(index)}
                    sx={{ position: 'absolute', top: '-10px', right: '5px', backgroundColor: '#fff', padding: '2px' }}
                  >
                    <X size={20} />
                  </IconButton>
                </div>
              );
            })}
          </div>
        ),
        endAdornment: (
          <Stack sx={{ position: 'absolute', bottom: '22px', right: '10px' }}>
            <InputAdornment position="end">
              <IconButton
                onClick={event => {
                  setAnchorElPicker(inputRef.current);
                }}
              >
                <Smiley />
              </IconButton>
              <IconButton component="label">
                <LinkSimple />
                <VisuallyHiddenInput type="file" multiple onChange={onChangeUpload} />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
      onKeyPress={ev => {
        if (ev.key === 'Enter') {
          if (value) sendMessage();
          ev.preventDefault();
        }
      }}
    />
  );
};

const ChatFooter = ({ currentChannel }) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useResponsive('between', 'md', 'xs', 'sm');
  const { user_id } = useSelector(state => state.auth);

  const [anchorElPicker, setAnchorElPicker] = useState(null);
  const [files, setFiles] = useState([]);

  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    const onTyping = async () => {
      try {
        if (value) {
          await currentChannel.keystroke();
        }
      } catch (error) {
        dispatch(showSnackbar({ severity: 'error', message: error.message }));
      }
    };
    onTyping();
  }, [value, currentChannel, dispatch]);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(value.substring(0, selectionStart) + emoji + value.substring(selectionEnd));

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  const onChangeUpload = async event => {
    const filesArr = Array.from(event.target.files).map(file => {
      return {
        loading: true,
        type: file.type,
        name: file.name,
        size: file.size,
        error: false,
        url: '',
      };
    });

    setFiles(filesArr);

    Array.from(event.target.files).forEach(async file => {
      try {
        const response = await currentChannel.sendFile(file);
        setFiles(prev => {
          return prev.map(item => {
            if (item.name === file.name) {
              return {
                ...item,
                loading: false,
                url: response.file,
              };
            }
            return item;
          });
        });
      } catch (error) {
        setFiles(prev => {
          return prev.map(item => {
            if (item.name === file.name) {
              return {
                ...item,
                loading: false,
                error: true,
              };
            }
            return item;
          });
        });
      }
    });
  };

  const onRemoveFile = index => {
    setFiles(prev => {
      return prev.filter((_, i) => i !== index);
    });
  };

  const getAttachments = () => {
    if (files.length === 0) return [];

    const attachments = files
      .filter(item => !item.error)
      .map(file => {
        const type = file.type.split('/')[0];
        switch (type) {
          case 'image':
            return {
              fallback: file.name,
              type: 'image',
              image_url: file.url,
            };
          case 'video':
            return {
              type: 'video',
              asset_url: file.url,
              file_size: file.size,
              mime_type: file.type,
              title: file.name,
            };
          case 'application':
            return {
              type: 'file',
              asset_url: file.url,
              file_size: file.size,
              mime_type: file.type,
              title: file.name,
            };
          default:
            return {
              type: 'file',
              asset_url: file.url,
              mime_type: '',
              title: file.name,
            };
        }
      });
    return attachments || [];
  };

  const sendMessage = async () => {
    try {
      const uuid = uuidv4();
      const messageId = `${user_id}-${uuid}`;
      const attachments = getAttachments();

      const result = await currentChannel?.sendMessage({
        id: messageId,
        text: value.trim(),
        attachments: attachments,
        mentioned_users: [],
      });

      if (result) {
        setValue('');
        setFiles([]);
      }
    } catch (error) {
      setValue('');
      setFiles([]);
      dispatch(showSnackbar({ severity: 'error', message: error.message }));
    }
  };

  const checkDisabledButton = () => {
    if (
      (value.trim() === '' && files.length === 0) ||
      (files.length > 0 && files.some(item => item.loading || item.error))
    ) {
      return true;
    }
    return false;
  };

  return (
    <Box
      sx={{
        position: 'relative',
        backgroundColor: 'transparent !important',
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={'100%'}
        sx={{
          backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
          boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.25)',
        }}
      >
        <Stack direction="row" alignItems={'center'} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: 'calc(100% - 68px)' }}>
            {/* --------------------emoji picker-------------------- */}
            <Popover
              // id={id}
              open={Boolean(anchorElPicker)}
              anchorEl={anchorElPicker}
              onClose={() => {
                setAnchorElPicker(null);
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={emoji => {
                  handleEmojiClick(emoji.native);
                }}
              />
            </Popover>

            {/* ------------Chat Input------------ */}
            <ChatInput
              inputRef={inputRef}
              value={value}
              setValue={setValue}
              sendMessage={sendMessage}
              setAnchorElPicker={setAnchorElPicker}
              onChangeUpload={onChangeUpload}
              files={files}
              onRemoveFile={onRemoveFile}
            />
          </Stack>

          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
              pointerEvents: checkDisabledButton() ? 'none' : 'auto',
              opacity: checkDisabledButton() ? 0.3 : 1,
            }}
          >
            <Stack sx={{ height: '100%' }} alignItems={'center'} justifyContent="center">
              <IconButton onClick={sendMessage}>
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ChatFooter;
