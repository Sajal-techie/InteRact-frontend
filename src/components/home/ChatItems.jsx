import React, { useEffect, useRef, useState } from "react";
import ChatLandingPage from "./ChatLandingPage";
import { initializeWebSocket, sendMessage } from "../../services/websocketService";
import {useSelector} from 'react-redux'
import { fetchChatMessages } from "../../services/chatServices";
const ChatItems = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [socket, setSocket] = useState(null)
  const currentUserId = useSelector(state=>state.auth.userId)
  const messageEndRef = useRef(null)

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

  if (!selectedUser) {
    return (
      <div className="flex-1 bg-gray-900 flex items-center justify-center">
        <ChatLandingPage/>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-900 text-white flex flex-col">
      <header className="bg-black p-4 border-b border-gray-700">
        <h1 className="text-2xl font-semibold">{selectedUser.username}</h1>
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
