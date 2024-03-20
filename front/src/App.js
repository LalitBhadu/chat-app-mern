import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './context/ChatProvider';
import WebCamera from './Comonents/misslenus/WebCamera';


function App() {
  return (
    <>
    <div className='App'>
    <Router>
    <ChatProvider>
      <Routes>
        <Route path='/' element={<Home />} exact/>
        <Route path='/chats' element={<ChatPage />} />
        <Route path='/videocall' element={<WebCamera />} />
      </Routes>
      </ChatProvider>
    </Router>
    </div>
    </>
  );
}

export default App;
