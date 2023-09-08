import React, { useEffect, useRef } from 'react';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/paraiso-light.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Actions';

const Ide = ({ socketRef, roomId, onCodeChange }) => {
  const socketRefCurrent = socketRef.current;
  const editorRef = useRef(null);
  // console.log("IdeSocketRef:",socketRef);
  // console.log("IdeRoomID:",roomId);
  useEffect(() => {
    async function init() {
      editorRef.current = CodeMirror.fromTextArea(document.getElementById('realtimeIde'), {
        mode: { name: 'clike', json: true },
        theme: 'paraiso-light',
        autoCloseTags: true,
        autoCloseBrackets: true,
        lineNumbers: true,
        lineWrapping: true,
      });

      editorRef.current.on('change', (instance, changes) => {
        // console.log('changes',changes);
        const { origin } = changes;
        const code = instance.getValue();
        // console.log(origin);
        onCodeChange(code);
        if (origin !== 'setValue') {
          socketRefCurrent.emit(ACTIONS.CODE_CHANGE, {
            roomId,
            code,
          });
        }
      });

      // socketRefCurrent.on(ACTIONS.CODE_CHANGE, ({ code }) => {
      //   if (code !== null) {
      //     editorRef.current.setValue(code);
      //   }
      // })
      editorRef.current.setValue(`//your code goes here...`);
    }
    init();
  }, [socketRef, roomId, onCodeChange, socketRefCurrent]);

  useEffect(() => {
    if (socketRefCurrent) {
      socketRefCurrent.on(ACTIONS.CODE_CHANGE, ({ code }) => {
        if (code !== null) {
          editorRef.current.setValue(code);
        }
      });
    }

    return () => {
      socketRefCurrent.off(ACTIONS.CODE_CHANGE);
    };
  }, [socketRefCurrent]);

  return (
    <textarea id="realtimeIde"></textarea>
  );
}

export default Ide;
