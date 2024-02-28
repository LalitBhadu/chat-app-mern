import React, { useEffect } from 'react';
import { Container, Box, Text, Tabs, TabList,Tab, TabPanel, TabPanels } from '@chakra-ui/react';
import Register from '../Comonents/Autheication/Register';
import Login from '../Comonents/Autheication/Login';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const Navigate = useNavigate();

  useEffect(()=>{
     const user = JSON.parse(localStorage.getItem("userInfo"));

     if(user)
     Navigate("/")
  },[Navigate]);

    return (
        <Container maxWidth="xl" centerContent >
        <Box d="flex"
         justifyContent='center'
          p={3} background='white'
          w='100%'
          m='40px 0 15px 10px'
          borderRadius='lg'
          borderWidth='1px'
          >
            <Text
            fontSize='3xl'
            fontFamily='Work sans'
            color='black'
            >TALK-WITH-LALIT</Text>
        </Box>
        <Box 
        bg='white'
        w='100%'
        p={4}
        borderRadius='lg'
        color='black'
        borderWidth='1px'
        >
        <Tabs variant='soft-rounded'>
  <TabList mb='1em'>
    <Tab w='50%'>Login</Tab>
    <Tab w='50%'>Sign Up</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
    <Login/>
    </TabPanel>
    <TabPanel>
    <Register/>
    </TabPanel>
  </TabPanels>
</Tabs>
        </Box>
        </Container>
    )
}

export default Home
