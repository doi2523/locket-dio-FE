import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthLocket.jsx";

import LeftHomeScreen from "./ExtendPage/leftHomeScreen.jsx";
import RightHomeScreen from "./ExtendPage/rightHomeScreen.jsx";
import MainHomeScreen from "./ExtendPage/mainHomeScreen.jsx";

import CustomeForm from "./ControlPage/CustomeForm.jsx";

const CameraCapture = () => {
  const { user, setUser } = useContext(AuthContext);
  
  return (
    <>
      <MainHomeScreen />
      {/* left */}
      <LeftHomeScreen />
      {/* right */}
      <RightHomeScreen />
      <CustomeForm/>
    </>
  );
};

export default CameraCapture;
