import React, { useEffect, useState } from "react";
import axios from "axios";
import * as mod from "../url";
import { ChatState } from "../context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SiderDrawer from "../Comonents/misslenus/SiderDrawer";
import ChatBox from "../Comonents/misslenus/ChatBox";
import MyChats from "../Comonents/misslenus/MyChats";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  //   const fetchChats = async () => {
  //     try {
  //       const response = await axios.get(`${mod.api_url}/api/chats`);

  //       setChats(response.data);
  //     }
  //     catch (error) {
  //       console.error('Error:', error.response);
  //     }
  //   };

  // useEffect(()=>{
  //     fetchChats();
  // },[])

  return (
    <>
      <div style={{ width: "100%" }}>
        {user && <SiderDrawer />}
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px"
        >
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      </div>
    </>
  );
};

export default ChatPage;
