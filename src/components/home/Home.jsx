import React, { useState } from 'react';
import useFetchUsers from '../../hooks/useFetchUsers';
import ChatList from './ChatList';
import ChatItems from './ChatItems';
import VideoCall from '../videoCall/videoCall';
import { useDispatch, useSelector } from 'react-redux';
import { LogoutThunk } from '../../redux/thunks/authThunk';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const { userList, error, loading } = useFetchUsers();
  const [selectedUser, setSelectedUser] = useState(null);
  const [isVideoCallActive, setIsVideoCallActive] = useState(false);
  const [videoRoomId, setVideoRoomId] = useState(null);
  const currentUserId = useSelector(state=>state.auth.userId)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try{

      await dispatch(LogoutThunk()).unwrap()
      navigate('/')
    }catch(error){
      console.log("error logging out");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-xl bg-red-600 p-4 rounded-lg shadow-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const handleStartVideoCall = (roomId) => {
    setVideoRoomId(roomId);
    setIsVideoCallActive(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCallActive(false);
    setVideoRoomId(null);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
    <ChatList userList={userList} onSelectUser={setSelectedUser} handleLogout={handleLogout}/>

      {/* Main Chat Area */}
      <div className="flex-1 relative flex flex-col">

        {/* Chat Area */}
        {isVideoCallActive ? (
          <VideoCall roomId={videoRoomId} isInitiator={videoRoomId.startsWith(currentUserId)} onEndCall={handleEndVideoCall} />
        ) : (
          <ChatItems selectedUser={selectedUser} onStartVideoCall={handleStartVideoCall} />
        )}
      </div>
    </div>
  );
};

export default Home;