import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Accountbook from "./Pages/Accountbook/accountbook";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Login/Login";
import Signup from "./Pages/Login/Signup";
import Wishlist from "./Pages/Wishlist/Wishlist";
import Premium from "./Pages/Premium/Premium";
import Paying from "./Pages/Premium/Paying";
import SideNavBar from "./Pages/Home/SideNavBar";
import Analysis from "./Pages/Analysis/Analysis";
import Mypage from "./Pages/Mypage/Mypage";
import AWS from 'aws-sdk'
//dummyData
import { data } from "./InitData/data";
//redux
import { useDispatch } from "react-redux";
import { setfetchData } from "./Redux/reducers";

function App() {
  const dispatch = useDispatch();
  AWS.config.update({
    region: process.env.REACT_APP_region,
    accessKeyId: process.env.REACT_APP_accessKeyId,
    secretAccessKey: process.env.REACT_APP_secretAccessKey
  });

  useEffect(() => {
    dispatch(setfetchData(data));
  }, [dispatch]);
  const [isHome, setIsHome] = useState(true);
  return (
    <main className={isHome ? "main-home" : "main-else"}>
      <BrowserRouter>
        <SideNavBar setIsHome={setIsHome} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/accountbook" element={<Accountbook />} />
          <Route path="/analysis" element={<Analysis />} />
          <Route path="/wishList" element={<Wishlist />} />
          <Route path="/premium" element={<Premium />} />
          <Route path="/paying" element={<Paying />} />
          <Route path="/mypage" element={<Mypage />} />
        </Routes>
      </BrowserRouter>
    </main>
  );
}

export default App;
