import React, { useState, useRef } from "react";
import axios from "axios";
import { FolderOpen, Video, RotateCcw, Send, Palette, Pencil } from "lucide-react";
import { showToast } from "../../../components/Toast/index.jsx";

const PostVideo = () => {
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef(null);
  const [colorTop, setColorTop] = useState("#000000");
  const [colorBottom, setColorBottom] = useState("#000000");
  const [colorText, setColorText] = useState("#FFFFFF");

  const handleTriggerUploadFile = () => fileRef.current?.click();

  const handleSelectFile = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    // Kiểm tra nếu là video
    if (!selectedFile.type.startsWith("video/")) {
      showToast("error", "Vui lòng chọn một tệp video!");
      return;
    }

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleUploadFile = async () => {
    if (!file) {
      showToast("error", "Vui lòng chọn video!");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("video", file);
    formData.append("caption", caption);

    try {
      const response = await axios.post("https://your-api.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        showToast("success", "Video đã được tải lên và chuyển đổi thành MP4!");
      } else {
        showToast("error", "Tải lên thất bại!");
      }
    } catch (error) {
      showToast("error", "Lỗi khi tải video lên!");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center flex-col min-h-screen p-6 bg-base-200">
      <div className="h-16"></div>
      <div className="p-6 rounded-lg shadow-md w-full max-w-md bg-base-100">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Upload Video</h2>
          <div
            className="border-2 border-base-content border-dashed rounded-md p-4 cursor-pointer input-ghost flex items-center justify-center gap-2"
            onClick={handleTriggerUploadFile}
          >
            <FolderOpen size={20} />
            <p>Click để chọn video</p>
            <input
              type="file"
              ref={fileRef}
              onChange={handleSelectFile}
              className="hidden"
              accept="video/*"
            />
          </div>
        </div>

        {/* Xem trước video */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Video Preview</h2>
          <div className="relative w-full max-w-[400px] aspect-video border border-base-content rounded-lg overflow-hidden flex items-center justify-center">
            {previewUrl ? (
              <video src={previewUrl} controls className="w-full h-full" />
            ) : (
              <div className="flex flex-col items-center">
                <Video size={80} />
                <p className="mt-2 text-sm">Chưa có video</p>
              </div>
            )}
          </div>
        </div>

        {/* Chỉnh caption */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold mb-4">Customize Caption</h2>
          <div className="p-4 rounded-md shadow-md w-full max-w-md border">
            <h3 className="text-lg font-semibold mb-3 text-left flex flex-row items-center">
              <Pencil size={20} className="mr-2" /> Caption
            </h3>
            <input
              type="text"
              className="w-full text-gray-500 dark:text-gray-400 p-2 border border-base-content shadow-md rounded-md mb-4"
              placeholder="Thêm một tin nhắn"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />

            <h3 className="text-lg font-semibold mb-3 text-left flex flex-row items-center">
              <Palette size={20} className="mr-1" /> Chọn màu
            </h3>
            <div className="flex justify-center items-center gap-4">
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu trên</label>
                <input
                  type="color"
                  value={colorTop}
                  onChange={(e) => setColorTop(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu dưới</label>
                <input
                  type="color"
                  value={colorBottom}
                  onChange={(e) => setColorBottom(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
              <div className="flex flex-col items-center">
                <label className="mb-1">Màu chữ</label>
                <input
                  type="color"
                  value={colorText}
                  onChange={(e) => setColorText(e.target.value)}
                  className="w-10 h-10 rounded-md border border-base-content p-1"
                />
              </div>
            </div>

            {/* Reset màu */}
            <div className="flex justify-center mt-4">
              <button
                onClick={() => {
                  setColorTop("#000000");
                  setColorBottom("#000000");
                  setColorText("#FFFFFF");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-md shadow-md btn"
              >
                <RotateCcw size={20} /> Reset màu
              </button>
            </div>
          </div>
        </div>

        {/* Nút gửi */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleUploadFile}
            className="flex items-center gap-2 btn btn-primary px-4 py-2 rounded-md shadow-md disabled:bg-gray-400"
            disabled={isUploading}
          >
            {isUploading ? "Đang tải lên..." : "Gửi bài"}
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostVideo;
