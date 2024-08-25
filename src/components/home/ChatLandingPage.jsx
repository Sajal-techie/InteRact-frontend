import React from 'react'
import chatbg from '../../assets/chat.png'
const ChatLandingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <img src={chatbg} alt="Message Icon" className="w-32 h-32 mb-4 mt-10" />
      <h2 className="text-2xl font-semibold mb-2">Welcome to InteRact</h2>
      <p className="text-gray-600 text-center">Select a user to start messaging and Interact</p>
    </div>
  )
}

export default ChatLandingPage
