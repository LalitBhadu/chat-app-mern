import {
    Button,
    Center,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    VStack,
  } from "@chakra-ui/react";
  import { px } from "framer-motion";
  import React, { useState } from "react";
  import { useToast } from "@chakra-ui/react";
  import axios from "axios";
  import * as mod from "./../../url";
  import { useNavigate } from "react-router-dom";
  const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState(null);
    const [show, setShow] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();
  
    const handleClick = () => setShow(!show);
  
    const submitHandler = async () => {
      setLoading(true);
  
      // Validate user input
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "Please fill all the blanks.",
          status: "warning",
          duration: 2000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      // Check if passwords match
      if (password !== confirmPassword) {
        toast({
          title: "Confirm password does not match.",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
        return;
      }
  
      try {
        // Set up headers and create FormData object
        const config = {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        };
        const formData = new FormData();
        formData.append("pic", pic);
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
  
        // Send a POST request to your API endpoint
        const { data } = await axios.post(
          `${mod.api_url}/api/user`,
          formData,
          config
        );
  
        // Handle success
        toast({
          title: "Sign-up Successful.",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
  
        localStorage.setItem("userInfo", JSON.stringify(data));
        setLoading(false);
        navigate("/chats");
        console.log("Response Data:", data);
      } catch (error) {
        // Handle errors
        console.error("Registration Error:", error);
        toast({
          title: "Error.",
          description:
            error.response?.data.message ||
            "An error occurred during registration.",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "bottom",
        });
        setLoading(false);
      }
    };
  
    return (
      <VStack spacing="5px" color="black">
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter Your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter  Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="confirm password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Confirm Your Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic" >
          <FormLabel>Upload Your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) => setPic(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          // isLoading={loading}
        >
          Register
        </Button>
      </VStack>
    );
  };
  
  export default Register;