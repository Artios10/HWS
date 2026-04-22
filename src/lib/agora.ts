import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { AGORA_APP_ID } from '@/constants';

// TODO: replace with your Agora App ID
const appId = AGORA_APP_ID;
// TODO: replace with your Agora App Certificate
const appCertificate = process.env.AGORA_APP_CERTIFICATE || '';

// Generate Agora token for channel
export const generateAgoraToken = (channelName: string, uid: number = 0, role: RtcRole = RtcRole.PUBLISHER, expirationTimeInSeconds: number = 3600) => {
  if (!appId || !appCertificate) {
    throw new Error('Agora App ID and Certificate are required');
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

  const token = RtcTokenBuilder.buildTokenWithUid(
    appId,
    appCertificate,
    channelName,
    uid,
    role,
    privilegeExpiredTs
  );

  return {
    token,
    channel: channelName,
    uid,
    expirationTime: privilegeExpiredTs,
  };
};

// For client-side usage
export const agoraConfig = {
  appId,
  token: '', // Will be set when joining channel
  channel: '',
  uid: 0,
};