import React, { useEffect, useRef, useState } from "react";
import ChatLandingPage from "./ChatLandingPage";
import {useSelector} from 'react-redux'
import { fetchChatMessages } from "../../services/chatServices";
import VideoCall from "../videoCall/videoCall";

const ChatItems = ({ selectedUser,onStartVideoCall }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null)
  const currentUserId = useSelector(state=>state.auth.userId)
  const messageEndRef = useRef(null)
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [videoRoomId, setVideoRoomId] = useState(null);

  // chat 
  useEffect(()=>{
    if (selectedUser && currentUserId){
      fetchChatList()
    }
  },[selectedUser, currentUserId])

  const fetchChatList = async ()=>{
    try{
      const res =  await fetchChatMessages(currentUserId,selectedUser.id)
      setMessages(res)
    }catch(error){
      console.log(error, "error fetching chat data");
      
    }
  }
  useEffect(()=>{
    messageEndRef.current?.scrollIntoView({ behavior: "instant" });
  },[messages])

  useEffect(()=>{
    if (selectedUser && currentUserId){
      const threadName = [currentUserId, selectedUser.id].sort().join('_')
      let websocket = new WebSocket(`ws://${import.meta.env.VITE_BACKEND_URL}/ws/chat/${threadName}/`)
      
      websocket.onopen = ()=>{
        console.log("web socket connectd");
        setSocket(websocket)
        
      }
      websocket.onmessage = (event) =>{
        const data = JSON.parse(event.data);
        console.log(data,'data');
        
        setMessages((prevMessages) => [...prevMessages, data]);
      }

      websocket.onclose = ()=>{
        console.log("websocket connection closed");
        
      }
      return ()=>{
        websocket.close()
      }
    }
  },[selectedUser])

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && selectedUser) {
      const newMessage = {
        message: inputMessage,
        sender: currentUserId,
        receiver:selectedUser.id,
      }
      socket.send(JSON.stringify(newMessage))
      setInputMessage("");
    }
  };

  // videocall
  const initiateVideoCall = () => {
    const roomId = `${currentUserId}_${selectedUser.id}_${Date.now()}`;
    onStartVideoCall(roomId)
    // Send a message to the other user inviting them to the video call
    socket.send(JSON.stringify({
      type: 'video-call-invite',
      roomId: roomId,
      sender: currentUserId,
      receiver: selectedUser.id,
      message: 'video call invite',
    }));
  };
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'video-call-invite') {
          if (data.sender !== currentUserId && window.confirm('You have a video call invite. Join?')) {
            onStartVideoCall(data.roomId);
          }
        } else {
          setMessages((prevMessages) => [...prevMessages, data]);
        }
      };
    }
  }, [socket, currentUserId, onStartVideoCall]);
  

  if (!selectedUser) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <ChatLandingPage/>
      </div>
    );
  }
  if (isVideoCallActive) {
    return (
      <div className="w-80">
      <VideoCall
        roomId={videoRoomId}
        isInitiator={videoRoomId.startsWith(currentUserId)}
        onEndCall={() => setIsVideoCallActive(false)}
        />
        </div>
    )
  }
  return (
    <div className="flex-1 bg-gray-900 text-white flex flex-col">
      <header className="bg-black p-4 border-b border-gray-700 flex justify-between">
        <h1 className="text-2xl font-semibold">{selectedUser.username}</h1>
        <button 
          onClick={initiateVideoCall}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>

        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex mb-4 ${
              message.sender === `${currentUserId}` ? "justify-end" : ""
            }`}
          >
            {message.sender !== `${currentUserId}` && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center mr-2">
                <img
                  src="https://placehold.co/200x/fffff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
            <div
              className={`max-w-96 rounded-lg p-3 ${
                message.sender === `${currentUserId}` ? "bg-indigo-600" : "bg-gray-800"
              }`}
            >
              <p>{message.message}</p>
            </div>
            {message.sender === `${currentUserId}` && (
              <div className="w-9 h-9 rounded-full flex items-center justify-center ml-2">
                <img
                  src="https://placehold.co/200x/b7a8ff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                  alt="My Avatar"
                  className="w-8 h-8 rounded-full"
                />
              </div>
            )}
          </div>
        ))}
        <div ref={messageEndRef}></div>
      </div>
      <footer className="bg-black border-t border-gray-700 p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-2 rounded-md border border-gray-600 bg-gray-800 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md ml-2 hover:bg-indigo-700 transition duration-300"
          >
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatItems;
