import React, { useEffect, useRef, useState } from 'react';
import "./camera.css";
import camera from "../../assets/camera.png";
import cameraSwitch from "../../assets/cameraSwitch.jpg";
import tick from "../../assets/tick.png";
import cross from "../../assets/cross.jpg";
function Camera(props) {
    const initialDimension={
        height:0,
        width:0
    }
    const videoRef=useRef(null);
    const canvasRef=useRef(null);
    const [isDualCamera,setDualCamera]=useState(false);
    const [isFrontCamera,setCamera]=useState(true);
    const [image,setImage]=useState("");
    const [dimension,setDimension]=useState(initialDimension)
    useEffect(()=>{
      const values:MediaStreamConstraints={
            audio:false,
            video:{
                facingMode:{
                    exact:isFrontCamera?"user":"environment"
                }
            },
        }
        window.navigator.mediaDevices.getUserMedia(values)
        .then((stream)=> {
            console.log("lol")
            videoRef.current.srcObject = stream;
            videoRef.current.play();
        })
        .catch((err)=> {
            console.log("An error occurred: " + err);
        });
    },[isFrontCamera])
    useEffect(()=>{
      if(videoRef&&videoRef.current&&canvasRef&&canvasRef.current){
          videoRef.current.addEventListener("canplay",(evt)=>{
              if(videoRef.current){
                  setDimension({height:videoRef.current.videoHeight,width:videoRef.current.videoWidth})
              }
          })
      }
    },[videoRef,canvasRef])
    useEffect(()=>{
        navigator.mediaDevices.enumerateDevices()
        .then(devices=>{
           const cameras=devices.filter(item=>item.kind==="videoinput")
           if(cameras.length>1){
               setDualCamera(true);
           }
           else{
            setDualCamera(false);  
           }
        })
    },[])
    const handleCameraSwitch=()=>{
        setCamera(pre=>!pre);
    }
    const takeAShot=()=>{
           
        let context = canvasRef.current.getContext('2d');
        if (dimension.width && dimension.height) {
            canvasRef.current.width = dimension.width;
            canvasRef.current.height = dimension.height;
            context.drawImage(videoRef.current, 0, 0, dimension.width,dimension.height);
            let data = canvasRef.current.toDataURL('image/png');
            if(data){
                videoRef.current.pause();
                videoRef.current.src="";
                const tracks=videoRef.current.srcObject.getTracks()
                tracks.forEach(item=>item.stop())
            }
            setImage(data);
        }
    }
    return (
        <>
            <div className="camera">
                {!image?
                    <video className="video" ref={videoRef}>Video stream not available.</video>
                    :
                    <div className="imageContainer">
                        <img style={{width:`100%`,height:"auto"}} className="image" src={image}/>
                    </div>
                }
            </div>
            <div className="camera_utils">
                {!image?
                    <>
                    <img onClick={takeAShot} className="icon" src={camera}/>
                    {
                    isDualCamera?
                    <img onClick={handleCameraSwitch} className="icon cameraSwitch" src={cameraSwitch}/>
                    :null    
                }
                    </>
                    :
                    <>
                    <img className="icon" src={tick}/>
                    <img className="icon" src={cross}/>
                    </>
                }
            </div>
            <canvas style={{display:"none"}} ref={canvasRef}></canvas>
            <div id="scroll"></div>
       </>
    )
}

export default Camera;

