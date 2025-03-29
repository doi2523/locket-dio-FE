import React, { useRef, useState, useEffect } from "react";
import { RefreshCcw, Send, Sparkles, ImageUp, X } from "lucide-react";
import HoldButton from "../../../components/UI/Button";
import AutoResizeTextarea from "./AutoResizeTextarea";

const CameraCapture = ({ onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedMedia, setCapturedMedia] = useState(null);
  const [cameraMode, setCameraMode] = useState("front");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [cameraActive, setCameraActive] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isHolding, setIsHolding] = useState(false);
  const [holdTime, setHoldTime] = useState(0);
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          const size = Math.min(img.width, img.height);
          canvas.width = size;
          canvas.height = size;
          const xOffset = (img.width - size) / 2;
          const yOffset = (img.height - size) / 2;
          ctx.drawImage(img, xOffset, yOffset, size, size, 0, 0, size, size);
          setSelectedFile({
            type: "image",
            data: canvas.toDataURL("image/png"),
          });
          setCameraActive(false);
        };
      };
      reader.readAsDataURL(file);
    } else if (file.type.startsWith("video/")) {
      const videoUrl = URL.createObjectURL(file);
      setSelectedFile({ type: "video", data: videoUrl });
      setCameraActive(false);
    }
  };

  const handleDelete = () => {
    setCapturedMedia(null);
    setSelectedFile(null);
    setCaption("");
    setCameraActive(true);
  };

  const handleSubmit = () => {
    console.log("File: ", selectedFile || capturedMedia);
    console.log("Caption: ", caption);
  };
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const [countdown, setCountdown] = useState(0);
  const streamRef = useRef(null);
  const MAX_RECORD_TIME = 10; // Giới hạn quay 10s
  
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        streamRef.current = stream;
        videoRef.current.srcObject = stream;
        setHasPermission(true);
      })
      .catch(() => setHasPermission(false));
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  // ---- Quay video khi giữ nút ----
  const startHold = async () => {
    setIsHolding(true);
    setHoldTime(0);
  
    intervalRef.current = setInterval(() => {
      setHoldTime((prev) => prev + 0.1);
    }, 100);
  
    holdTimeout.current = setTimeout(() => {
      // Khi giữ > 1s thì quay video
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject;
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);
        setRecordedChunks([]);
  
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            setRecordedChunks((prev) => [...prev, e.data]);
          }
        };
  
        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: "video/webm" });
          const videoUrl = URL.createObjectURL(blob);
          setSelectedFile({ type: "video", data: videoUrl });
          setCameraActive(false);
        };
  
        recorder.start();
        setIsRecording(true);
        console.log("Recording started");
      }
    }, 1000); // sau 1s mới quay video
  };
  
  // ---- Kết thúc giữ nút ----
  const endHold = () => {
    setIsHolding(false);
    clearTimeout(holdTimeout.current);
    clearInterval(intervalRef.current);
  
    if (holdTime < 1) {
      // Chụp ảnh nếu giữ < 1s
      if (videoRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const size = Math.min(video.videoWidth, video.videoHeight);
        canvas.width = size;
        canvas.height = size;
        const xOffset = (video.videoWidth - size) / 2;
        const yOffset = (video.videoHeight - size) / 2;
        ctx.drawImage(video, xOffset, yOffset, size, size, 0, 0, size, size);
        setSelectedFile({
          type: "image",
          data: canvas.toDataURL("image/png"),
        });
        setCameraActive(false);
        console.log("Captured Image");
      }
    } else {
      // Nếu đang quay video, thì dừng và lưu
      if (mediaRecorder) {
        mediaRecorder.stop();
        setIsRecording(false);
        console.log("Recording stopped");
      }
    }
  };
  
  return (
    <div className="flex select-none flex-col items-center justify-center h-screen min-h-screen bg-locket -z-50">
      <h1 className="text-3xl mb-6 font-semibold">Locket Upload</h1>
      <div className="relative w-full max-w-md aspect-square bg-gray-800 rounded-[60px] overflow-hidden">
        {!selectedFile && cameraActive && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${
              cameraMode === "front" ? "scale-x-[-1]" : ""
            }`}
          />
        )}
        {selectedFile && selectedFile.type === "video" && (
          <video
            src={selectedFile.data}
            autoPlay
            loop
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}
        {selectedFile && selectedFile.type === "image" && (
          <img
            src={selectedFile.data}
            alt="Selected File"
            className="w-full h-full object-cover select-none"
          />
        )}

        {(capturedMedia || selectedFile) && (
          <AutoResizeTextarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nhập tin nhắn..."
          />
        )}
      </div>

      <div className="flex gap-4 w-full h-40 max-w-md justify-evenly items-center">
        {capturedMedia || selectedFile ? (
          <>
            <button className="cursor-pointer" onClick={handleDelete}>
              <X size={35} />
            </button>
            <button
              onClick={handleSubmit}
              className="rounded-full w-22 h-22 duration-300 outline-base-300 bg-white/10 backdrop-blur-4xl mx-4 text-center flex items-center justify-center"
            >
              <Send size={40} className="mr-1 mt-1" />
            </button>
            <button>
              <Sparkles size={35} />
            </button>
          </>
        ) : (
          <>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <ImageUp size={35} />
            </label>
            <button
              onMouseDown={startHold}
              onMouseUp={endHold}
              onMouseLeave={endHold}
              onTouchStart={startHold}
              onTouchEnd={endHold}
              className={`rounded-full w-18 h-18 mx-4 outline-5 outline-offset-3 outline-accent ${
                isHolding ? "bg-white animate-pulseBeat" : "bg-white"
              }`}
            ></button>
            <button className="cursor-pointer">
              <RefreshCcw
                size={35}
                className="transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </button>
          </>
        )}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default CameraCapture;
