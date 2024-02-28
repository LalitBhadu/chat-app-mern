import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatProvider'
import { Box, Button, Image, Stack, Text, useToast} from '@chakra-ui/react';
import axios from 'axios';
import * as mod from '../../url';
import { IoIosAddCircle } from "react-icons/io";
import ChatLoading from '../userAvtar/ChatLoading';
import { getSender } from '../../config/ChatLogic'
import GroupChatModal from '../misslenus/GroupChatModal';




const MyChats = ({ fetchAgain }) => {
    const { user, setUser,  selectedChat, setSelectedChat, chats, setChats } =  ChatState();
    const toast = useToast();
    const [loggedUser, setLoggedUser] = useState();



    const fetchChats = async () =>{
        // const userId = user._id
        // console.log(user._id,'oiujeqoioq');
        try{
            const config = {
                headers:{
                    "Content-type": "application/json",
                    Authorization:`Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`${mod.api_url}/api/userchat`, config);
            // console.log(data,'i9ij9ij');
            setChats(data);
        }catch(error){
            toast({
                title: 'Error Occured',
                description:"faild to load the Search data",
                status: 'error',
                duration: 2000,
                isClosable: true,
                position:"bottom"
              });
        }
    }

    useEffect(()=>{
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    },[fetchAgain])


    return (
        <>
        <Box
        display={{ base: selectedChat ? "none" : "flex", md:"flex" }}
        flexDir='column'
        alignItems='center'
        p={3}
        bg='white'
        w={{ base: "100%", md:"31%" }}
        borderRadius='lg'
        borderWidth='1px'
        >
        <Box
        pb={3}
        px={3}
        fontSize={{ base:"10px", md:"20px"}}
        fontFamily="Work sans"
        display='flex'
        w='100%'
        justifyContent='space-between'
        alignItems='center'
        >
        Chats
        <GroupChatModal>
        <Button
        display='flex'
        fontSize={{ base:'10px', md:"10px", lg:'12px'}}
        rightIcon={<IoIosAddCircle />}
        >
        New Group Chat
        </Button>
        </GroupChatModal>
        
        </Box>
        <Box
        display='flex'
        flexDir='column'
        p={3}
        bg='#F8F8F8'
        w='100%'
        h='100%'
        borderRadius='lg'
        overflowY='hidden'
        >
        {chats ? (
            <Stack  overflowY='auto' style={{
                scrollbarColor:"black",
                display:"flex"
            }}>
            {chats.map((chat) => (
                <Box
                onClick={() => setSelectedChat(chat)}
                cursor='pointer'
                bg={selectedChat === chat ? '#38B2AC' : '#E8E8E8'}
                color={selectedChat === chat ? 'white' : 'black'}
                px={3}
                py={2}
                display='flex'
                borderRadius='lg'
                key={chat._id} 
                >
                <Image
                    borderRadius='full'
                    boxSize='40px'
                    display='flex'
                    src={user.pic}
                    alt='Dan Abramov'
                  />
                <Text
                 display='flex'
                 alignItems='center'
                 marginLeft="20px"

                >
                    {
                 !chat.isGroupChat ? getSender(loggedUser, chat.users)
                     : 
                     (chat.chatName)
                     }
                </Text>
                </Box>
            ))}
            </Stack>
        ) : (
            <ChatLoading/>
        )}

        </Box>
        </Box>
        </>
    )
}

export default MyChats;
