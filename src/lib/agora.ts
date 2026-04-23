import { RtcTokenBuilder, RtcRole } from 'agora-token';
import { AGORA_APP_ID } from '@/constants';

// TODO: Replace with your own backend - Video Calling Service
// Replace this entire file with your own video calling solution
// This file handles video call token generation using Agora
// You'll need to:
// 1. Choose a video calling service (Agora, Twilio Video, Daily.co, etc.)
// 2. Replace token generation with your chosen service's API
// 3. Update client-side video components to use your service
// 4. Handle video call lifecycle (join, leave, mute, etc.)

// TODO: replace with your Agora App ID
const appId = AGORA_APP_ID;
// TODO: replace with your Agora App Certificate
const appCertificate = process.env.AGORA_APP_CERTIFICATE || '';

// TODO: Replace with your own backend - Video Call Token Generation
// Replace this function with your video service's token/room creation logic
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