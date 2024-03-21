import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  FormControl,
  IconButton,
  Image,
  Input,
  Spinner,
  Text,
  Toast,
  effect,
  useToast,
} from "@chakra-ui/react";
import { FaArrowCircleLeft } from "react-icons/fa";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModel from "../misslenus/ProfileModel";
import UpdateGroupModal from "../misslenus/UpdateGroupModal";
import { ThreeDots } from "react-loader-spinner";
import axios from "axios";
import * as mod from "../../url";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../../animations/typing.json";
import { FcVideoCall } from "react-icons/fc";
import { FcCallback } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

const ENDPOINT = "http://localhost:8080";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const toast = useToast();
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);
  const navigate = useNavigate();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(false);

      const { data } = await axios.get(
        `${mod.api_url}/api/message/${selectedChat._id}`,
        config
      );

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
      // setSocketConnected(true);
      // socket.emit("new Message", data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "faild to  the recive messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };



  const sendMessage = async () => {
    // Your existing code for sending a message
    if (newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post(
          `${mod.api_url}/api/message`,
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        console.log("send message", data);


        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error Occurred",
          description: "Failed to send the message",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };

  useEffect(() => {
    fetchMessages();

    // const intervalId = setInterval(() => {
    //   fetchMessages();
    // }, 500);
    selectedChatCompare = selectedChat;

    return () => {
      // clearInterval(intervalId);
    };
  }, [selectedChat]);

  
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    socket.on("new message", (newMessageRecived) => {
      console.log("new Message Received:", newMessageRecived);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecived.chat._id
      ) {
        if (!notification.includes(newMessageRecived)) {
          setNotification([newMessageRecived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        // Here, we update the messages state with the new message
        // setMessages((prevMessages) => [...prevMessages, newMessageRecived]);
        setMessages([...messages, newMessageRecived]);
      }
    });
    return () => {
      socket.off("message received");
    };
  }, [notification, fetchAgain, selectedChatCompare]);




  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  const handleVideoCall = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(
        `${mod.api_url}/api/videocall/initiate`,
        { chatId: selectedChat._id },
        config
      );
      console.log("Video call initiated successfully:", response.data);
      navigate("/videocall");
      // Handle success response, if needed
    } catch (error) {
      console.error("Error initiating video call:", error);
      // Handle error, if needed
    }
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <Avatar
              size="sm"
              cursor="pointer"
              name={user.name}
              src={user.pic}
               alt="User Pic"
              
            />
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<FaArrowCircleLeft />}
              onClick={() => setSelectedChat("")}
            />

            {message &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModel
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              ))}
            <Box display="flex">
              <IconButton
                icon={<FcVideoCall />}
                aria-label="Video Call"
                onClick={handleVideoCall}
                style={{ marginRight: "10px" }}
              />
              <IconButton icon={<FcCallback />} aria-label="Voice Call" />
            </Box>
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="new Message">
                <ScrollableChat messages={messages} />
              </div>
            )}

            {istyping ? (
                <div>
                  <ThreeDots
                    visible={true}
                    height="20"
                    width="40"
                    marginLeft="30px"
                    color="#4fa94d"
                    radius="9"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    wrapperClass=""
                  />
                </div>
              ) : (
                <></>
              )}
            <FormControl
              id="first-name"
              isRequired
              display="flex"
              marginTop="4px"
            >
              <Input
                variant="filled"
                bg="#E0E0E0"
                width="100%"
                display="flex"
                placeholder="Enter Your Messages..."
                onChange={typingHandler}
                value={newMessage}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <Button
                onClick={sendMessage}
                colorScheme="teal"
                marginLeft="10px"
              >
                Send
              </Button>
              <Box></Box>
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="work sans">
            Click On user Start Chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
