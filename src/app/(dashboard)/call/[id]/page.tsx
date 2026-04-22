'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { db } from '@/lib/appwrite';
import { CallSession, Host } from '@/types';
import { formatCoins } from '@/utils';
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

// TODO: Import Agora Web SDK and use your Agora App ID
// import AgoraRTC from 'agora-rtc-sdk-ng';
// const rtc = {
//   localAudioTrack: null,
//   localVideoTrack: null,
//   client: null,
// };

export default function CallPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const sessionId = params.id as string;

  const [callSession, setCallSession] = useState<CallSession | null>(null);
  const [host, setHost] = useState<Host | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [coinsRemaining, setCoinsRemaining] = useState(0);
  const [lowBalanceWarning, setLowBalanceWarning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout>();
  const coinDeductionRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (sessionId && user) {
      loadCallData();
    }
  }, [sessionId, user]);

  const loadCallData = async () => {
    try {
      const session = await db.callSessions.get(sessionId);
      setCallSession(session);

      // Load host info
      const hostData = await db.hosts.get(session.hostId);
      setHost(hostData);

      // Load wallet to check coins
      const wallet = await db.wallets.get(user!.userId);
      setCoinsRemaining(wallet.coinBalance);

      setIsLoading(false);
    } catch (error) {
      console.error('Error loading call data:', error);
      toast.error('Failed to load call');
      router.push('/discover');
    }
  };

  const startCall = async () => {
    try {
      setCallStarted(true);

      // TODO: Join Agora channel here
      // const token = await getAgoraToken(sessionId, user!.userId);
      // await rtc.client.join(process.env.NEXT_PUBLIC_AGORA_APP_ID, sessionId, token, user!.userId);
      // rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
      // await rtc.client.publish([rtc.localAudioTrack, rtc.localVideoTrack]);

      toast.success('Call started!');

      // Start timer for call duration
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      // Start coin deduction (every 10 seconds = 1/6 minute)
      coinDeductionRef.current = setInterval(async () => {
        if (host && coinsRemaining > 0) {
          const coinsToDeduct = host.ratePerMinute / 6; // Deduct every 10 seconds
          setCoinsRemaining((prev) => {
            const newBalance = Math.max(0, prev - coinsToDeduct);

            // Check for low balance warning
            if (newBalance < host.ratePerMinute && !lowBalanceWarning) {
              setLowBalanceWarning(true);
              toast.error('Low balance! Add coins to continue.');
            }

            // Auto end call if no coins left
            if (newBalance <= 0) {
              endCall();
            }

            return newBalance;
          });
        }
      }, 10000); // Every 10 seconds
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error('Failed to start call');
      setCallStarted(false);
    }
  };

  const endCall = async () => {
    try {
      // TODO: Leave Agora channel
      // if (rtc.localAudioTrack) rtc.localAudioTrack.close();
      // if (rtc.localVideoTrack) rtc.localVideoTrack.close();
      // if (rtc.client) await rtc.client.leave();

      if (timerRef.current) clearInterval(timerRef.current);
      if (coinDeductionRef.current) clearInterval(coinDeductionRef.current);

      const durationMinutes = Math.ceil(callDuration / 60);
      const coinsSpent = host ? host.ratePerMinute * durationMinutes : 0;

      // Update call session
      await db.callSessions.update(sessionId, {
        status: 'completed',
        endTime: new Date().toISOString(),
        durationMinutes,
        coinsSpent,
      });

      // Update wallet
      await db.wallets.update(user!.userId, {
        coinBalance: coinsRemaining,
      });

      // Create transaction record
      await db.coinTransactions.create({
        userId: user!.userId,
        type: 'spend',
        amount: coinsSpent,
        description: `Video call with ${host?.intro}`,
        status: 'completed',
        createdAt: new Date().toISOString(),
      });

      toast.success('Call ended successfully');
      router.push('/dashboard');
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error('Error ending call');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mb-4"></div>
          <p>Loading video call...</p>
        </div>
      </div>
    );
  }

  const minutes = Math.floor(callDuration / 60);
  const seconds = callDuration % 60;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black flex flex-col">
        {/* Video Container */}
        <div className="flex-1 relative bg-gray-900">
          {/* Main Video - Remote Host */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center">
              {host && (
                <div className="text-center">
                  {host.hostPhoto ? (
                    <img
                      src={host.hostPhoto}
                      alt={host.intro}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center mx-auto mb-4 border-4 border-blue-500">
                      <span className="text-white text-5xl font-bold">
                        {host.intro.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <p className="text-white text-2xl font-bold">{host.intro}</p>
                  {callStarted && (
                    <p className="text-gray-300 text-sm mt-2">
                      {formatCoins(host.ratePerMinute)} per minute
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Timer Overlay */}
          {callStarted && (
            <div className="absolute top-4 right-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-400" />
              <span className="font-mono text-lg">
                {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
              </span>
            </div>
          )}

          {/* Balance Indicator */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg">
            <p className="text-sm text-gray-300">Coins remaining</p>
            <p className="text-xl font-bold">{formatCoins(Math.max(0, coinsRemaining))}</p>
          </div>

          {/* Low Balance Warning */}
          {lowBalanceWarning && (
            <div className="absolute top-24 left-4 bg-red-500 bg-opacity-90 text-white px-4 py-3 rounded-lg animate-pulse">
              <p className="font-bold">⚠️ Low Balance Warning</p>
              <p className="text-sm">Add coins to continue the call</p>
            </div>
          )}

          {/* Local Video - Placeholder */}
          <div className="absolute bottom-24 right-4 w-32 h-32 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
            {isVideoOn ? (
              <div className="text-gray-400 text-center">
                <Video className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">Your video</p>
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                <VideoOff className="h-8 w-8 mx-auto mb-2" />
                <p className="text-xs">Video off</p>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 border-t border-gray-800 px-4 py-6">
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full transition-colors ${
                isMuted
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`flex-shrink-0 inline-flex items-center justify-center h-12 w-12 rounded-full transition-colors ${
                !isVideoOn
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
              }`}
              title={isVideoOn ? 'Stop Video' : 'Start Video'}
            >
              {isVideoOn ? (
                <Video className="h-6 w-6" />
              ) : (
                <VideoOff className="h-6 w-6" />
              )}
            </button>

            {!callStarted ? (
              <button
                onClick={startCall}
                className="flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors"
                title="Accept Call"
              >
                <Phone className="h-7 w-7" />
              </button>
            ) : (
              <button
                onClick={endCall}
                className="flex-shrink-0 inline-flex items-center justify-center h-14 w-14 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
                title="End Call"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
            )}
          </div>

          <p className="text-center text-gray-400 text-xs mt-4">
            {!callStarted
              ? 'Click the green button to start the video call'
              : 'Click the red button to end the call'}
          </p>
        </div>
      </div>
    </ProtectedRoute>
  );
}