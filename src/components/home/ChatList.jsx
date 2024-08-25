import React from "react";
import useFetchUsers from "../../hooks/useFetchUsers";

const ChatList = ({ userList, onSelectUser }) => {
  return (
    <div className="w-1/4 bg-black text-white border-r border-gray-700">
      <header className="p-4 border-b border-gray-700 flex justify-between items-center bg-black">
        <h1 className="text-2xl font-semibold text-white">InteRact</h1>
      </header>

      <div className="overflow-y-auto h- p-3 mb-9 pb-20 bg-gray-900">
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
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-white">
                {user.username}
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;
