import React, { useState, useRef, useEffect } from 'react';
import ACTIONS from '../Actions';
import Client from '../components/Client';
import Ide from '../components/Ide';
import Whiteboard from '../components/Whiteboard';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorPage = () => {

  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const whiteboardRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  // console.log(roomID);
  const reactNavigator = useNavigate();
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', (err) => handleError(err));
      socketRef.current.on('connect_failed', (err) => handleError(err));

      function handleError(e) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
      });
      //Listening for joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room.`);
          console.log(`${username} joined`);
        }
        setClients(clients);
        // console.log("sync-code:",codeRef.current);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
        // console.log("sync_image", whiteboardRef.current);
        socketRef.current.emit(ACTIONS.SYNC_IMAGE, {
          image: whiteboardRef.current,
          socketId,
        });
      });

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room.`);
        setClients((prev) => {
          return prev.filter(
            (client) => client.socketId !== socketId
          );
        });
      });


    };
    init();
    return () => {
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
      socketRef.current.disconnect();
    };
  }, [location.state?.username, reactNavigator, roomId]);


  async function copyRoomID() {
    try {
      console.log({ roomId });
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied');
    } catch (err) {
      toast.error('Could Not copy Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    reactNavigator('/');
  }

  if (!location.state) {
    return <Navigate to="/" />;
  }
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <img className='logo' src='/InavIDE-logo.png' alt='InavIDE logo' />
          <h3>Connected</h3>
          <div className='clientList'>
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
              />
            ))}
          </div>
        </div>
        <button className='btn copybtn' onClick={copyRoomID}>Copy Room Id</button>
        <button className='btn leavebtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='content'>
        <div className='ideWrap'>
          <h2>Code-Editor</h2>
          <Ide
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
        <div className='whiteboardWrap'>
          <Whiteboard
            socketRef={socketRef}
            roomId={roomId}
            onImageChange={(canvasimg) => {
              whiteboardRef.current = canvasimg;
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default EditorPage
