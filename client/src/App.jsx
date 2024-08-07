import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./Pages/Home"
import About from "./Pages/About"
import SignIn from "./Pages/SignIn"
import SignUp from "./Pages/SignUp"
import Dashboard from "./Pages/Dashboard"
import "./index.css";
import Header from "./components/Header";
import FooterComp from "./components/Footer"
import PrivateRoutes from './components/PrivateRoutes'
import CreatePost from "./Pages/CreatePost"
import UpdatePost from "./Pages/UpdatePost"
import Edits from "./Pages/Edits"
import { Edit } from "./Pages/Edit"
import Search from "./Pages/Search"


const App = () => {

    return (
        <BrowserRouter>
        <Header />
        <Routes>
            <Route path= "/" element = {<Home />} />
            <Route path= "/about" element = {<About />} />
            <Route path="/sign-in" element = {<SignIn />} />
            <Route path="/sign-up" element = {<SignUp />} />
            <Route path="/search" element = {<Search />} />
            <Route element= {<PrivateRoutes />}>
               <Route path= '/dashboard' element= {<Dashboard />}/>
               <Route path="/create-post" element={<CreatePost />} />
               <Route path="/update-post" element={<UpdatePost />} />
            </Route>
            
            <Route path="/posts" element={<Edits />} />  
            <Route path="/posts/:id" element={<Edit />} />
            
        </Routes>

        <FooterComp />

        </BrowserRouter>

    )
}


export default App


