import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import userApi from "../../services/axios";
import { endpoints } from "../../services/endpoints";

const ChatList = ({ userList, onSelectUser,handleLogout }) => {
  const [onlineUsers, setOnlineUsers] = useState({});
  const userID = useSelector((state) => state.auth.userId);

  useEffect(() => {
    fetchOnlineUsers();
  
    if (userID) {
      const ws = new WebSocket(
        `wss://${import.meta.env.VITE_BACKEND_URL}/ws/presence/${userID}/`
      );

      ws.onopen = () => {
        console.log("WebSocket connection established presence");
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log(event.data, "ebent data in on meesage");
        console.log(onlineUsers,'onlineeeeeee');
        if (data.type === "user_online") {
          
          setOnlineUsers((prev) => ({ ...prev, [data.user_id]: true }));
        } else if (data.type === "user_offline") {
          setOnlineUsers((prev) => ({ ...prev, [data.user_id]: false }));
        }
        console.log(onlineUsers,'online uers in message');
        
      }; 
      ws.onerror = (error) => {
        console.log(error, "eeror conection");
      };
      ws.onclose = () => {
        console.log("connected closed", onlineUsers);
      };

      return () => {
        ws.close();
      };
    }
  }, []);

  const fetchOnlineUsers = async () => {
    try {
      console.log('Fetching online users');
      const res = await userApi.get(endpoints.online_users);
      const onlineUsersData = res.data.reduce((acc, user) => {
        acc[user.id] = user.is_online;
        return acc;
      }, {});
      setOnlineUsers(onlineUsersData);
      console.log('Online users fetched:', onlineUsersData);
    } catch (error) {
      console.error("Error fetching online users:", error);
    }
  };
  useEffect(() => {
    console.log('Online users updated:', onlineUsers);
  }, [onlineUsers]);
  return (
    <div className="w-1/4 sm:w-64 bg-black text-white border-r border-gray-700 ">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center bg-black">
        <h1 className="text-2xl font-semibold text-white">InteRact</h1>
        <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>

        </button>
      </header>

      <div className=" overflow-y-auto p-3 mb-9 pb-20 bg-gray-900">
        {userList.map((user, index) => (
          <div
            key={index}
            className="flex items-center mb-4 cursor-pointer hover:bg-gray-800 p-2 rounded-md transition duration-300"
            onClick={() => onSelectUser(user)}
          >
            <div className="w-12 h-12 bg-gray-700 rounded-full mr-3 hidden sm:block">
              <img
                src="https://placehold.co/200x/fffff/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                alt="User Avatar"
                className="w-12 h-12 rounded-full"
              />
            </div>
            <div key={user.id} className="flex items-center space-x-2">
              <span>{user.username}</span>
              <div
                className={`w-2 h-2 rounded-full ${
                  onlineUsers[user.id] ? "bg-green-500" : "bg-gray-500"
                }`}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
