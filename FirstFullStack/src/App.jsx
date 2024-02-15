import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import About from "./Pages/About"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import "./index.css";
import Header from "./components/Header";
import FooterComp from "./components/Footer"
const App = () => {
    return (

        <>
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path= "/" element = {<Home />} />
            <Route path= "/about" element = {<About />} />
            <Route path="/sign-in" element = {<SignIn />} />
            <Route path="/sign-up" element = {<SignUp />} />
        </Routes>
        <FooterComp />

        </BrowserRouter>
        </>

    )
}


export default App


