import {BrowserRouter,Routes,Route} from 'react-router-dom'
import React from 'react'
import Home from './Pages/Home'
import About from './Pages/About'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import Project from './Pages/Project'

function App() {
  return (
     <BrowserRouter>
     <Routes>
       <Route path='/' element={<Home/>}/>
       <Route path='/about' element={<About/>}/>
       <Route path='/sign-in' element={<Login/>}/>
       <Route path='/sign-up' element={<Signup/>}/>
       <Route path='/dashboard' element={<Dashboard/>}/>
       <Route path='/projects' element={<Project/>}/>
     </Routes>
     </BrowserRouter>
   
  )
}

export default App
