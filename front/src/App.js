import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import ChatPage from './Pages/ChatPage';
import ChatProvider from './context/ChatProvider';


function App() {
  return (
    <>
    <div className='App'>
    <Router>
    <ChatProvider>
      <Routes>
        <Route path='/' element={<Home />} exact/>
        <Route path='/chats' element={<ChatPage />} />
      </Routes>
      </ChatProvider>
    </Router>
    </div>
    </>
  );
}

export default App;
