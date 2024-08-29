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
        const constraints = {
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            aspectRatio: 16/9
          },
          audio: true
        };
        const stream = await navigator.mediaDevices.getUserMedia({ video: {aspectRatio: 4/3}, audio: true });
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

        const ws = new WebSocket(`wss://${import.meta.env.VITE_BACKEND_URL}/ws/video/${roomId}/`);
        websocketRef.current = ws;

        ws.onopen = () => {
            console.log("WebSocket connected for video call");
            
            if (isInitiator) {
              console.log("Initiating call as initiator");
              createAndSendOffer();
            } else { 
              console.log("Joining call as receiver");
              sendSignal({type:'ready'}) 
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
    console.log(('snding pffer'));
    
    const offer = await peerConnectionRef.current.createOffer();
    await peerConnectionRef.current.setLocalDescription(offer);
    sendSignal({ type: 'offer', offer: offer });
  };

  const handleSignalingMessage = async (message) => {
    console.log(peerConnectionRef.current.signalingState, 'current state',message.type);
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
      case 'ready':
        if (isInitiator) {
            createAndSendOffer();
        }
        break;
      case 'end-call':
        onEndCall()
    }
  };

  const handleOffer = async (offer) => {
    try {
      if (peerConnectionRef.current.signalingState !== "stable") {
        console.warn("Ignoring offer in non-stable state");
        return;
      }
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);
      sendSignal({ type: 'answer', answer });
    } catch (error) {
      console.error("Error handling offer:", error);
    }
  }
  const handleAnswer = async (answer) => {
    try {
      if (peerConnectionRef.current.signalingState !== "have-local-offer") {
        console.warn("Received answer in unexpected state, ignoring");
        return;
      }
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
      processPendingIceCandidates();
    } catch (error) {
      console.error("Error handling answer:", error);
    }
  };


  const handleIceCandidate = (candidate) => {
    try {
      if (peerConnectionRef.current.remoteDescription && peerConnectionRef.current?.signalingState !== "closed") {
        peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      } else {
        setIceCandidates(prev => [...prev, candidate]);
      }
    } catch (error) {
      console.error("Error handling ICE candidate:", error);
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
  const handleEndCall = ()=>{
    sendSignal({type: 'end-call'})
    onEndCall()
  }
  return (
    <div className="video-call-container h-full bg-gray-900 flex flex-col items-center justify-center object-contain">
      <div className="video-grid grid grid-cols-2 gap-4 mb-4 ">
        <video ref={localVideoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-auto rounded-lg" />
      </div>
      <button
        onClick={handleEndCall} 
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300"
      >
        End Call
      </button>
    </div>
  );
}; 

export default VideoCall;