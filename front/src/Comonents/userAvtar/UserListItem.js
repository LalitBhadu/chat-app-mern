import React from 'react'
// import { ChatState } from '../../context/ChatProvider'
import { Avatar, Box, Text } from '@chakra-ui/react';

const UserListItem = ({user, handleFunction}) => {

    // const {user} = ChatState();


    return (
        <>

            <Box
            onClick={handleFunction}
            bg='#e3e3e3'
            cursor='pointer'
            _hover={{
                background:"#38B2AC",
                color:"white"
            }}
            w='100%'
            display='flex'
            alignItems='center'
            color='black'
            px={3}
            py={2}
            mb={2}
            borderRadius='lg'
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={require(`./../../img/${user?.pic}`)} alt="User Pic" 
                />
           <Box>
            <Text>{user.name}</Text>
            <Text
            fontSize='xs'>
            <b>Email : </b>
            {user.email}
            </Text>
            </Box>
            </Box>
            
        </>
    )
}

export default UserListItem
