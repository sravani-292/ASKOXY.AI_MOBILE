// Frontend (React Native)
// File: RealtimeAssistant.js
import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Platform, Text, Alert } from 'react-native';
import {
  RTCPeerConnection,
  mediaDevices,
  RTCView,
} from 'react-native-webrtc';
import { BASE_URL } from '../../../Config';

const BACKEND_EPHEMERAL_URL = 'https://your-backend/api/realtime/session'; // backend endpoint added above
const OPENAI_REALTIME_BASE = 'https://api.openai.com/v1/realtime';

export default function RealtimeAssistant() {
  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const [remoteStreamUrl, setRemoteStreamUrl] = useState(null);
  const [isRunning, setRunning] = useState(false);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  const cleanup = async () => {
    try {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(t => t.stop());
        localStreamRef.current = null;
      }
      setRemoteStreamUrl(null);
      setRunning(false);
    } catch (e) {
      console.warn('cleanup error', e);
    }
  };
  let assistantId = "";

  const startSession = async () => {
    setRunning(true);
    console.log('Starting session...');
    try {
      // 1) Ask backend for ephemeral session (server will call /v1/realtime/sessions and return result)
      const sessionResp = await fetch( `${BASE_URL}/student-service/user/token?assistnatId=${assistantId}`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI4ZjI5MjJkMS0yNmZjLTRlY2ItYWE4ZC00OWM1YjQ4ZDk3NDQiLCJpYXQiOjE3NTM1MjU0MzUsImV4cCI6MTc1NDM4OTQzNX0.TsIcuOPETQVFavDWoqK8Mo_fxbzOHSu_0AM_KfR79RtA0O3bCJ0E2jLpeT0jjTbEvQ4Ub4hapU3-EdxZycNgig` },
        body: JSON.stringify({ model: 'gpt-4o-realtime-preview-2024-12-17' }),
      });
      console.log('sessionResp', sessionResp);
      
      if (!sessionResp.ok) {
        const txt = await sessionResp.text();
        throw new Error('Failed to get ephemeral session: ' + txt);
      }
      const sessionJson = await sessionResp.json();
      // sessionJson should include ephemeral key and maybe sessionId
      // Example fields: { "client_secret": { "value":"ephemeral_key_here", ...}, "id": "..." }
      const ephemeralKey = sessionJson?.client_secret?.value || sessionJson?.ephemeral_key || sessionJson?.token;
      if (!ephemeralKey) {
        throw new Error('Ephemeral key not found in session response');
      }

      // 2) Create local media stream (audio and optional video)
      const constraints = {
        audio: true,
        video: { facingMode: 'user', width: 640, height: 480, frameRate: 15 }
      };
      const localStream = await mediaDevices.getUserMedia(constraints);
      localStreamRef.current = localStream;

      // 3) Create RTCPeerConnection and add local tracks
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });
      pcRef.current = pc;

      // Attach local tracks
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      // When remote track arrives, set remote stream URL
      const remoteStream = [];
      pc.ontrack = (event) => {
        // gather tracks into a MediaStream
        event.streams && event.streams[0] && setRemoteStreamUrl(event.streams[0].toURL());
      };

      // Optional: datachannel (for receiving transcription/events)
      const dc = pc.createDataChannel('oai-events');
      dc.onmessage = (evt) => {
        try {
          const parsed = JSON.parse(evt.data);
          console.log('datachannel event:', parsed);
        } catch (e) {
          console.log('datamsg', evt.data);
        }
      };

      // 4) Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // 5) Send SDP offer to OpenAI realtime endpoint, using ephemeral key
      // OpenAI expects the offer body as the raw SDP with content-type application/sdp
      const modelParam = 'gpt-4o-realtime-preview-2024-12-17';
      const realtimeEndpoint = `${OPENAI_REALTIME_BASE}?model=${encodeURIComponent(modelParam)}`;

      const sdpResponse = await fetch(realtimeEndpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ephemeralKey}`,
          'Content-Type': 'application/sdp'
        },
        body: offer.sdp
      });

      if (!sdpResponse.ok) {
        const errText = await sdpResponse.text();
        throw new Error('OpenAI realtime SDP failed: ' + errText);
      }

      // 6) OpenAI returns an SDP answer (plain text). Set remote description.
      const answerSdp = await sdpResponse.text();
      await pc.setRemoteDescription({ type: 'answer', sdp: answerSdp });

      // Now audio/video should flow; remote tracks will be handled in ontrack
      // Keep pcRef for further control (mute, stop, etc.)

    } catch (err) {
      console.error('Realtime init error', err.response);
      Alert.alert('Realtime Error', String(err));
      cleanup();
    }
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <Button title={isRunning ? 'Stop Assistant' : 'Start Voice+Video Assistant'} onPress={() => {
        if (isRunning) cleanup();
        else startSession();
      }} />

      <View style={{ marginTop: 12 }}>
        <Text>Remote (Assistant) stream:</Text>
        {remoteStreamUrl ? (
          <RTCView streamURL={remoteStreamUrl} style={{ width: 320, height: 240, backgroundColor: 'black' }} />
        ) : (
          <Text style={{ color: '#888'}}>No remote stream yet</Text>
        )}
      </View>
    </View>
  );
}
