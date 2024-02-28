import { Button, Center, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import { px } from 'framer-motion'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios'
import * as mod from "./../../url";
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] =useState();
    const [confirmPassword, setConfirmPassword]  = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate();


    const handleClick = () => setShow(!show)

    const postDetails = (pics) => {
        // setLoading(true);
        if(pic === undefined){
            toast({
                title: 'Uploaded.',
                description: "We've Uploaded your image.",
                status: 'success',
                duration: 4000,
                isClosable: true,
                position:'bottom',
              });
              return;
        }
        if(pic.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append("file", pics);
            data.append('upload_preset', "chating-webapp");
            data.append("cloud_name", "dayml2lav");
            // CLOUDINARY_URL=cloudinary://183819985487954:WUjFqw_0rscn9feN8Zk_aGWPFg4@dayml2lav
            fetch("https://183819985487954:WUjFqw_0rscn9feN8Zk_aGWPFg4@dayml2lav", {
                method:"post", body:data, 
            }).then((res)=> res.json())
            .then(data => {
                setPic(data.url.toString());
                setLoading(false)
            }) 
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
            
        }else{
                toast({
                    title: 'Not Uploaded.',
                    description: "Try again upload your image",
                    status: 'faild',
                    duration: 4000,
                    isClosable: true,
                    position: 'bottom',
                  })
                  setLoading(false)
                  return;
            }
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmPassword){
            toast({
                title: 'Pease fill all the blanks.',
                status: 'success',
                duration: 2000,
                isClosable: true,
                position: 'bottom',
            })
              setLoading(false);
              return;
        }
        if (password !== confirmPassword){
            toast({
                title: 'Confim password Does Not Match.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom',
            });
              setLoading(false);
              return;
        }
        try{
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(`${mod.api_url}/api/user`, { name, email, password, pic }, config);
            console.log("Response Data:", data);
             toast({
                title: 'Sign-up Sucessful.',
                status: 'success',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
              localStorage.setItem('userInfo', JSON.stringify(data));
              setLoading(false);
              navigate('/chats');
             console.log(data,'data')

        }
        catch (error) {
            console.error("Registration Error:", error);
            toast({
                title: 'Error.',
                description: error.response?.data.message || 'An error occurred during registration.',
                status: 'error',
                duration: 4000,
                isClosable: true,
                position: 'bottom',
            });
            setLoading(false);
        }
    };

    return (
        <VStack spacing='5px' color='black' >
        <FormControl  id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
            <Input
                placeholder='Enter Your Name'
                onChange={(e)=>setName(e.target.value)}
            />
        </FormControl>
        <FormControl  id='email' isRequired>
            <FormLabel>Email</FormLabel>
            <Input
                placeholder='Enter Your email'
                onChange={(e)=>setEmail(e.target.value)}
            />
        </FormControl>
        <FormControl  id='password' isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input
                type={show? 'text' :'password'}
                placeholder='Enter  Your Password'
                onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show? "Hide" : "Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl  id='confirm password' isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
            <Input
                type={show? 'text' :'password'}
                placeholder='Confirm Your Password'
                onChange={(e)=>setConfirmPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
            <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show? "Hide" : "Show"}
            </Button>
            </InputRightElement>
            </InputGroup>
        </FormControl>
        <FormControl  id='pic' isRequired>
            <FormLabel>Upload Your Picture</FormLabel>
            <Input
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=>postDetails(e.target.files[0])}
            />
        </FormControl>
        <Button 
        colorScheme='blue'
        width='100%'
        style={{marginTop:15}}
        onClick={submitHandler}
        // isLoading={loading}
        >
            Register
        </Button>


        </VStack>
    )
}

export default Register
