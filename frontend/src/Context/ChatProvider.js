import React, { createContext, useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();            //creation of the context//

const ChatProvider = ({ children }) => {                 //if all these states have been created in any component,then it would have been accessible 
  const [selectedChat, setSelectedChat] = useState();    //only for that component,but if we are creating it in context API then it is accessible in all parts of the app// 
  const [user, setUser] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);

  const history = useHistory();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) history.push("/");                             //if the user is not logged in then he will be redirected to login page//
    
  }, [history]);          //whenever the history changes,its gonna run again//

  return (
    <ChatContext.Provider
      value={{                 //to allow access of above mention states in all the parts of our app,we write it in this particular format// 
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {           //all the states which are going to be used in every part of the app are under ChatState variable//
  return useContext(ChatContext);
};

export default ChatProvider;