import React, { useEffect, useRef, useState } from 'react';

const VideoCall = ({ roomId, isInitiator, onEndCall }) => {
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnectionRef = useRef();
  const websocketRef = useRef();
  const [iceCandidates, setIceCandidates] = useState([]);

  useEffect(() => {
    const initCall = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideoRef.current.srcObject = stream;

        const peerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        peerConnectionRef.current = peerConnection;

        stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

        peerConnection.ontrack = (event) => {
          remoteVideoRef.current.srcObject = event.streams[0];
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal({ type: 'ice-candidate', candidate: event.candidate });
          }
        };

        const ws = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/ws/video/${roomId}/`);
        websocketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected for video call");
            if (isInitiator) {
              console.log("Initiating call as initiator");
              createAndSendOffer();
            } else {
              console.log("Joining call as receiver");
            }
          };

        ws.onmessage = async (event) => {
            console.log(event.data, "recieved video call messge");
            
          const message = JSON.parse(event.data);
          handleSignalingMessage(message);
        };
        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
          };
          ws.onclose = () => {
            console.log("WebSocket closed for video call");
          };
      } catch (error) {
        console.error("Error setting up call:", error);
        
      }
    };

    initCall();

    return () => {
      if (localVideoRef.current?.srcObject) {
        localVideoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [roomId, isInitiator]);

  const createAndSendOffer = async () => {
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    sendSignal({ type: 'offer', offer: offer });
  };

  const handleSignalingMessage = async (message) => {
    switch (message.type) {
      case 'offer':
        await handleOffer(message.offer);
        break;
      case 'answer':
        await handleAnswer(message.answer);
        break;
      case 'ice-candidate':
        handleIceCandidate(message.candidate);
        break;
    }
  };

  const handleOffer = async (offer) => {
    if (peerConnectionRef.current.signalingState !== "stable") {
      console.warn("Ignoring offer in non-stable state");
      return;
    }
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnectionRef.current.createAnswer();
    await peerConnectionRef.current.setLocalDescription(answer);
    sendSignal({ type: 'answer', answer: answer });
  };

  const handleAnswer = async (answer) => {
    if (peerConnectionRef.current.signalingState === "stable") {
      console.warn("Received answer in stable state, ignoring");
      return;
    }
    await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
    processPendingIceCandidates();
  };

  const handleIceCandidate = (candidate) => {
    if (peerConnectionRef.current.remoteDescription) {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    } else {
      setIceCandidates(prev => [...prev, candidate]);
    }
  };

  const processPendingIceCandidates = () => {
    iceCandidates.forEach(candidate => {
      peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
    });
    setIceCandidates([]);
  };

  const sendSignal = (signal) => {
    if (websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(signal));
    }
  };

  return (
    <div className="video-call-container">
      <video ref={localVideoRef} autoPlay muted playsInline className="local-video" />
      <video ref={remoteVideoRef} autoPlay playsInline className="remote-video" />
      <button onClick={onEndCall}>End Call</button>
    </div>
  );
};

export default VideoCall;