import React from 'react';
import { Stack, Box, Typography, IconButton, Tooltip, Paper } from '@mui/material';
import { useTheme, alpha } from '@mui/material/styles';
import { ArrowBendUpLeft, DotsThree, DownloadSimple, Files, Smiley } from 'phosphor-react';
import linkifyHtml from 'linkify-html';
import { getSizeInMb } from '../../utils/commons';

const MessageOption = ({ isMyMessage }) => {
  return (
    <Stack
      className="messageActions"
      direction="row"
      sx={{
        position: 'absolute',
        top: '50%',
        left: isMyMessage ? 'auto' : '100%',
        right: isMyMessage ? '100%' : 'auto',
        transform: 'translateY(-50%)',
        visibility: 'hidden',
      }}
    >
      <Tooltip title="Emotion">
        <IconButton>
          <Smiley size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Reply">
        <IconButton>
          <ArrowBendUpLeft size={18} />
        </IconButton>
      </Tooltip>
      <Tooltip title="More">
        <IconButton>
          <DotsThree size={18} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

const TextMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.isMyMessage ? 'end' : 'start'} alignItems="center">
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.isMyMessage ? theme.palette.primary.main : alpha(theme.palette.background.default, 1),
          borderRadius: 1.5,
          width: 'max-content',
          position: 'relative',
        }}
      >
        <Typography
          variant="body2"
          color={el.isMyMessage ? '#fff' : theme.palette.text}
          dangerouslySetInnerHTML={{
            __html: linkifyHtml(el.text, { target: '_blank', className: 'linkUrl', rel: 'noreferrer' }),
          }}
        />
        <MessageOption isMyMessage={el.isMyMessage} />
      </Box>
    </Stack>
  );
};
const AttachmentMsg = ({ el, menu }) => {
  const theme = useTheme();
  const attachments = el.attachments;
  let widthBox;
  if (attachments.length === 1) {
    if (attachments[0].type === 'video') {
      widthBox = '50%';
    } else {
      widthBox = '33.333%';
    }
  } else if (attachments.length === 2) {
    widthBox = '50%';
  } else {
    widthBox = '100%';
  }

  return (
    <Stack direction="row" justifyContent={el.isMyMessage ? 'end' : 'start'} sx={{ width: '100%' }}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.isMyMessage ? theme.palette.primary.main : alpha(theme.palette.background.default, 1),
          borderRadius: 1.5,
          width: widthBox,
          position: 'relative',
        }}
      >
        <Stack spacing={1}>
          <div style={{ display: 'flex', flexWrap: 'wrap', margin: '-3px' }}>
            {attachments.map((attachment, index) => {
              const type = attachment.type;
              let widthItem;
              if (attachments.length === 1) {
                widthItem = '100%';
              } else if (attachments.length === 2) {
                if (attachments.some(attachment => attachment.type === 'video')) {
                  widthItem = '100%';
                } else {
                  widthItem = '50%';
                }
              } else {
                if (type === 'video') {
                  widthItem = '66.666%';
                } else {
                  widthItem = '33.333%';
                }
              }

              const heightItem = attachments.length === 1 ? '216px' : attachments.length === 2 ? '166px' : '227px';
              return (
                <div
                  key={index}
                  style={{
                    padding: '3px',
                    width: widthItem,
                    height: heightItem,
                  }}
                >
                  <Paper elevation={3} sx={{ borderRadius: '12px', width: '100%', height: '100%', overflow: 'hidden' }}>
                    {type === 'image' ? (
                      <img
                        src={attachment.image_url}
                        alt={attachment.fallback}
                        loading="lazy"
                        style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                      />
                    ) : type === 'video' ? (
                      <>
                        <video
                          controls
                          src={attachment.asset_url}
                          style={{ width: '100%', height: '100%', borderRadius: '12px', objectFit: 'cover' }}
                        />
                        {/* <Player
                          aspectRatio="auto"
                          src={attachment.asset_url}
                          fluid={false}
                          width={'100%'}
                          height={'100%'}
                        >
                          <BigPlayButton position="center" />
                        </Player> */}
                      </>
                    ) : (
                      <Stack
                        p={2}
                        direction="column"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          width: '100%',
                          height: '100%',
                          textAlign: 'center',
                        }}
                      >
                        <Files size={48} />
                        <div>
                          <Typography variant="body1" sx={{ margin: '10px 0' }}>
                            {attachment.title}
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: 12, color: '#666', margin: '10px 0' }}>
                            {getSizeInMb(attachment.file_size)}
                          </Typography>
                        </div>

                        <IconButton>
                          <DownloadSimple />
                        </IconButton>
                      </Stack>
                    )}
                  </Paper>
                </div>
              );
            })}
          </div>

          {el.text && (
            <Typography
              variant="body2"
              color={el.isMyMessage ? '#fff' : theme.palette.text}
              dangerouslySetInnerHTML={{
                __html: linkifyHtml(el.text, { target: '_blank', className: 'linkUrl', rel: 'noreferrer' }),
              }}
            />
          )}
        </Stack>
        <MessageOption isMyMessage={el.isMyMessage} />
      </Box>
    </Stack>
  );
};

export { TextMsg, AttachmentMsg };
