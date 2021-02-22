import React, { useEffect, useRef, useState } from 'react';

function Camera(props) {
    const videoRef=useRef(null);
    const canvasRef=useRef(null);
    const [isFrontCamera,setCamera]=useState(true);
    useEffect(()=>{
      const values={
            audio:false,
            video:{
                facingMode:{
                    exact:isFrontCamera?"user":"environment"
                }
            },
        }
        window.navigator.mediaDevices.getUserMedia(values)
        .then((stream)=> {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        })
        .catch((err)=> {
            console.log("An error occurred: " + err);
        });
    },[isFrontCamera])
    useEffect(()=>{
      if(videoRef&&videoRef.current&&canvasRef&&canvasRef.current){
          let streaming=false;
          let width=320;
        //   let height=0;
          videoRef.current.addEventListener("canplay",(evt)=>{
           if(!streaming){
               console.log(videoRef.current.videoWidth,videoRef.current.videoHeight)
               if(window.screen.width<videoRef.current.videoWidth){
                   width=window.screen.width;
               }
               else{
                 width=videoRef.current.videoWidth;
               }
            //    height=undefined;
            videoRef.current.setAttribute("width",width);
            // videoRef.current.setAttribute("height",height);
            canvasRef.current.setAttribute("width",width);
            // canvasRef.current.setAttribute("height",height);

           }
          })
      }
    },[videoRef,canvasRef])
    return (
        <div>
            <div id="camera">
            <video ref={videoRef}>Video stream not available.</video>
            </div>
            <div>snap</div>
            <canvas ref={canvasRef}></canvas>
       </div>
    )
}

export default Camera;

