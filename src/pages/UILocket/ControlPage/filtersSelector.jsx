import { Palette, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ThemeSelector from "../../../components/Theme/ThemeSelector";

const FiltersSelector = ({ isOpen, onClose, filters, onSelect }) => {
  const popupRef = useRef(null);
  const [selectedColors, setSelectedColors] = useState(null);

  const dataColors = [
    { top: "#5733FF", bottom: "#FF33B5" },
    { top: "#FF5733", bottom: "#FFC300" },
    { top: "#33FF57", bottom: "#33CFFF" },
    { top: "#FF5733", bottom: "#33FFC3" },
    { top: "#FF9500", bottom: "#FF2D95" },
    { top: "#00B5FF", bottom: "#FFB6C1" },
  ];

  const handleCloseOnClickOutside = (e) => {
    if (popupRef.current && !popupRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleColorSelect = (topColor, bottomColor) => {
    setSelectedColors({ top: topColor, bottom: bottomColor });
    if (onSelect) {
      onSelect({ top: topColor, bottom: bottomColor });
    }
  };
    useEffect(() => {
      if (isOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => {
        document.body.classList.remove("overflow-hidden");
      };
    }, [isOpen]);
  // useEffect(() => {
  //   if (isOpen) {
  //     document.addEventListener("mousedown", handleCloseOnClickOutside);
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.removeEventListener("mousedown", handleCloseOnClickOutside);
  //     document.body.style.overflow = "auto";
  //   }

  //   return () => {
  //     document.removeEventListener("mousedown", handleCloseOnClickOutside);
  //     document.body.style.overflow = "auto";
  //   };
  // }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-90 flex justify-center items-end transition-transform duration-500 ${
        isOpen ? "" : "pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-base-100/10 backdrop-blur-[2px] bg-opacity-50 transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Popup */}
      <div
        ref={popupRef}
        className={`w-full h-1/2 bg-base-100 rounded-t-4xl shadow-lg transition-transform duration-500 flex flex-col ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Header - Ghim cố định */}
        <div className="flex justify-between rounded-t-4xl items-center shadow-md py-2 px-4 bg-base-100 sticky top-0 left-0 right-0 z-50">
          <div className="flex items-center space-x-2">
            <Palette size={22} className="text-primary" />
            <div className="text-2xl font-lovehouse mt-1.5 font-semibold text-primary">
              Customize
            </div>
          </div>
          <button onClick={onClose} className="text-primary">
            <X size={30} />
          </button>
        </div>

        {/* Nội dung - Cuộn được */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="text-2xl font-semibold font-lovehouse text-primary">
            Suggest Customize
          </div>

          {/* Scrollable Container for Colors */}
          <div className="flex overflow-x-auto gap-3 pt-2 pb-5">
            {dataColors.map((color, index) => (
              <div key={index} className="flex flex-col items-center">
                <button
                  className="btn h-11 w-24 rounded-3xl text-white font-semibold"
                  style={{
                    background: `linear-gradient(to top, ${color.top}, ${color.bottom})`,
                    cursor: "pointer",
                  }}
                  onClick={() => handleColorSelect(color.top, color.bottom)}
                >
                  {`Màu ${index + 1}`}
                </button>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-lovehouse text-primary">User custome</h2>
          <div>
            <input type="color" name="" id="" />
            <input type="color" name="" id="" />
            <input type="color" name="" id="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FiltersSelector;
