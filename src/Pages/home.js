import React, { useState } from 'react'
import { v4 as uuidV4 } from 'uuid'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { FaTwitter } from 'react-icons/fa'
import { FaFacebook } from 'react-icons/fa'
import { FaGithub } from 'react-icons/fa'
import { FaInstagram } from 'react-icons/fa'



const Home = () => {

  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [username, setUserName] = useState('');

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidV4();
    // console.log(id);
    setRoomId(id);
    toast.success('Created New Room');
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      // console.log(roomID);
      // console.log(username);
      toast.error('Room ID and Username is required');
      return;
    }
    //Redirect
    navigate(`/ide/${roomId}`, { state: { username } })  //To access username in ide route, we have used state
  }

  const InputEnter = (e) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  }
  return (
    <div className='homepageTemplate'>
      <div className='formTemplate'>
        <img className='imgstyle' src='/InavIDE-logo.png' alt='InavIDE logo' />
        <h4 className='mainLabel'>Paste Invitation Room ID</h4>
        <div className='formgrp'>
          <input type="text" className='formbox' placeholder='ROOM ID' onChange={(e) => setRoomId(e.target.value)} value={roomId} onKeyUp={InputEnter} />
          <input type="text" className='formbox' placeholder='USERNAME' onChange={(e) => setUserName(e.target.value)} value={username} onKeyUp={InputEnter} />
          <button className='btn btnJoin' onClick={joinRoom}>JOIN</button>
          <span className='Info'>
            For creating New Room &rarr;&nbsp;
            <a onClick={createNewRoom} href='' className='createNewBtn'>Click Here !</a>
          </span>
        </div>
      </div>
      <footer>
        <h4>
          All Rights Reserved. Made with&nbsp;&#x1f495;&nbsp;in India
          <div className='social-container'>
            <a href='https://twitter.com/PRATEEKRAVI011' target="_blank" className='twitter'><FaTwitter /></a>
            <a href='https://www.facebook.com/prateek.ravi.1' target="_blank" className='facebook'><FaFacebook /></a>
            <a href='https://www.instagram.com/_prateekravi/' target="_blank" className='instagram'><FaInstagram /></a>
            <a href='https://github.com/PrateekRavi301' target="_blank" className='github'><FaGithub /></a>
          </div>
        </h4>
      </footer>
    </div>
  );
}

export default Home