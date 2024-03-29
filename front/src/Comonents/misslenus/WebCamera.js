import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import Webcam from "react-webcam";
import io from "socket.io-client";
import { Button } from "@chakra-ui/react";
import axios from "axios";
import * as mod from "../../url";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";

const WebCamera = () => {
  const webcamRef = useRef(null);
  const peerRef = useRef(null);
  const [peers, setPeers] = useState([]);
  const socketRef = useRef();
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const navigate = useNavigate();

  useEffect(() => {
    // Create a new socket connection
    socketRef.current = io("http://localhost:3001");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        // Display user's video
        webcamRef.current.srcObject = stream;

        // Listen for incoming signals
        socketRef.current.on("receiveSignal", (data) => {
          const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream,
          });

          // Set up the new peer's signal
          peer.signal(data.signal);

          // Add the new peer to the state
          setPeers((prevPeers) => [
            ...prevPeers,
            { peerID: data.callerID, peer },
          ]);
        });

        // Notify the server when the user disconnects
        socketRef.current.on("userDisconnected", (userID) => {
          setPeers((prevPeers) =>
            prevPeers.filter((peer) => peer.peerID !== userID)
          );
        });

        // Initialize the first peer connection
        const initPeer = () => {
          peerRef.current = new Peer({
            initiator: true,
            trickle: false,
            stream: stream,
          });
          peerRef.current.on("signal", (data) => {
            // Check if socketRef.current is defined before emitting
            if (socketRef.current) {
              socketRef.current.emit("sendSignal", {
                signal: data,
                callerID: socketRef.current.id,
              });
            }
          });
        };

        initPeer();

        // Clean up on component unmount
        return () => {
          // Disconnect the socket
          if (socketRef.current) {
            socketRef.current.disconnect();
          }

          // Destroy the peer connection
          if (peerRef.current) {
            peerRef.current.destroy();
          }
        };
      })
      .catch((err) => console.error("Error accessing media devices:", err));
  }, []);

  const handleDisconnect = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const response = await axios.post(
        `${mod.api_url}/api/videocall/end`,
        config
      );
      console.log("cut call", response);
      navigate("/chats");
    } catch (error) {
      console.error("Error ending video call:", error);
    }
  };

  return (
    <div>
      <h1>Video Call</h1>
      <Webcam ref={webcamRef} />

      <div>
        {peers.map((peer) => (
          <video
            key={peer.peerID}
            playsInline
            autoPlay
            ref={(video) => video && peer.peer.addStream(video.srcObject)}
          />
        ))}
      </div>
      <Button onClick={handleDisconnect}>Disconnect</Button>
    </div>
  );
};

export default WebCamera;
