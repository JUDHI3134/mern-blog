import {BrowserRouter,Routes,Route} from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Project from './Pages/Project'
import Header from './Components/Header'
import Footer from './Components/Footer'
import PrivateRoute from './Components/PrivateRoute'
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute'
import CreatePost from './Pages/CreatePost'

function App() {
  return (
     <BrowserRouter>
     <Header/>
     <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/sign-in' element={<Login/>}/>
       <Route path='/sign-up' element={<Signup/>}/>
       <Route element={<PrivateRoute/>}>
       <Route path='/dashboard' element={<Dashboard/>}/>
       </Route>
       <Route element={<OnlyAdminPrivateRoute/>}>
       <Route path='/create-post' element={<CreatePost/>}/>
       </Route>
       <Route path='/projects' element={<Project/>}/>
     </Routes>
     <Footer/>
     </BrowserRouter>
   
  )
}

export default App
