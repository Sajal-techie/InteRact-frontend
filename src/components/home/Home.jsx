import React, { useState } from 'react'
import useFetchUsers from '../../hooks/useFetchUsers'
import ChatList from './ChatList';
import ChatItems from './ChatItems';

const Home = () => {
    const {userList, error, loading} = useFetchUsers()
    const [selectedUser, setSelectedUser] = useState(null);

    console.log(userList,loading,error);
    if (loading){
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Loading...</div>   
    }
    if (error){
        return <div className="flex justify-center items-center h-screen bg-gray-900 text-white">Error: {error.message}</div>
    }
  return (
    <div className="flex h-screen bg-gray-900 text-white">
        <ChatList userList={userList} onSelectUser={setSelectedUser} />
        <ChatItems selectedUser={selectedUser} />
    </div>
  )
}

export default Home
