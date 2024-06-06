export default function capitalizeFirstLetter(string) {
  if (!string) return '';
  return string.charAt(0).toUpperCase();
}

export function getSizeInMb(size) {
  if (!size) return '0 MB';

  const sizeInMB = (size / (1024 * 1024)).toFixed(2) + ' MB';
  return sizeInMB;
}

export function getChannelName(channel, all_members) {
  if (!channel) return '';
  const myUserId = window.localStorage.getItem('user_id');

  if (channel.data.type === 'messaging') {
    const otherMember = Object.values(channel.state.members).find(member => member.user.id !== myUserId);
    let name = '';
    if (otherMember) {
      const userInfo = all_members && all_members.find(user => user.id === otherMember.user.id);
      name = userInfo ? userInfo.name : otherMember.user.id;
    } else {
      name = '';
    }
    return formatString(name);
  }
  return channel.data.name;
}

export function formatString(str) {
  if (!str) {
    return '';
  }
  if (str.length <= 25) {
    return str;
  }

  const start = str.substring(0, 4);

  const end = str.substring(str.length - 6);

  return start + '...' + end;
}

export function getMemberInfo(memberId, all_members) {
  const userInfo = all_members && all_members.find(user => user.id === memberId);

  return userInfo ? userInfo : null;
}
