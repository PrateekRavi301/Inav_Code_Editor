import React, { useEffect, useState, useRef } from 'react'
import ACTIONS from '../Actions';

const Whiteboard = ({ socketRef, roomId , onImageChange }) => {
    const socketRefCurrent = socketRef.current;
    const [isDrawing, setIsDrawing] = useState(false);
    const [color, setColor] = useState("#3B3B3B");
    const [size, setSize] = useState("3");
    const canvasRef = useRef(null);
    const ctx = useRef(null);
    const [cursor, setCursor] = useState("default");

    useEffect(() => {
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext("2d");

        //Resizing
        var parent = document.getElementById("board-container")
        canvas.height = parent.offsetHeight;
        canvas.width = parent.offsetWidth;
        // canvas.height = window.innerHeight;
        // canvas.width = window.innerWidth; 

    }, [ctx]);

    useEffect(() => {
        if (socketRefCurrent) {
            socketRefCurrent.on(ACTIONS.IMAGE_CHANGE, ({ canvasimg }) => {
                // console.log(canvasimg);
                var img = new Image();
                img.onload = function () {
                    ctx.current.drawImage(img, 0, 0);
                };
                img.src = canvasimg;
            });
        }

        return () => {
            // socketRefCurrent.off(ACTIONS.IMAGE_CHANGE);
        };
    }, [socketRefCurrent]);

    const startPosition = ({ nativeEvent }) => {
        setIsDrawing(true);
        draw(nativeEvent);
    };

    const finishedPosition = () => {
        setIsDrawing(false);
        ctx.current.beginPath();
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) {
            return;
        }
        const canvas = canvasRef.current;
        ctx.current = canvas.getContext("2d");
        ctx.current.lineWidth = size;
        ctx.current.lineCap = "round";
        ctx.current.strokeStyle = color;

        var rect = canvas.getBoundingClientRect();
        ctx.current.lineTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);
        ctx.current.stroke();
        ctx.current.beginPath();
        ctx.current.moveTo(nativeEvent.clientX - rect.left, nativeEvent.clientY - rect.top);

        var canvasimg = document.getElementById('board').toDataURL();
        // console.log(canvasimg);
        onImageChange(canvasimg);
        socketRefCurrent.emit(ACTIONS.IMAGE_CHANGE, {
            roomId,
            canvasimg,
        });
        
    };

    const clearCanvas = () => {

        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);
        var canvasimg = document.getElementById('board').toDataURL();
        // console.log(canvasimg);
        socketRefCurrent.emit(ACTIONS.IMAGE_CHANGE, {
            roomId,
            canvasimg,
        });
    };

    const getPen = () => {
        setCursor("crosshair");
        setSize("3");
        setColor("#3B3B3B");
    };

    const eraseCanvas = () => {
        setCursor("grab");
        setSize("20");
        setColor("#FFFFFF");

        if (!isDrawing) {
            return;
        }
    };

    return (
        <div className="container">
            <div className="tools-section">
                <button className='btn btnwhiteboard' onClick={getPen}>Brush</button>
                <div className="color-picker-container">
                    Select Brush Color : &nbsp;
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                </div>

                <div className="brushsize-container">
                    Select Brush Size : &nbsp;
                    <select value={size} onChange={(e) => setSize(e.target.value)}>
                        <option> 5 </option>
                        <option> 10 </option>
                        <option> 15 </option>
                        <option> 20 </option>
                        <option> 25 </option>
                        <option> 30 </option>
                    </select>
                </div>
                <button className='btn btnwhiteboard' onClick={clearCanvas}>Clear</button>
                <button className='btn btnwhiteboard' onClick={eraseCanvas}>Erase</button>
            </div>

            <div className='board-container' id='board-container'>
                <canvas className='board' id='board'
                    style={{ cursor: cursor }}
                    onMouseDown={startPosition}
                    onMouseUp={finishedPosition}
                    onMouseMove={draw}
                    ref={canvasRef}
                />
            </div>

        </div>


    )
}

export default Whiteboard
