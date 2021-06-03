import React, {useState} from 'react'
import '../styles/css/style.css';
import Button from '../components/Button'
import {Link} from "react-router-dom"
import {useHistory} from "react-router-dom"
import Header from "../components/Header"
import UserForm from '../components/UserForm';


function User() {
    const history = useHistory()
    const changePage = () => {
        history.push("/feed")
    }

  return (
    <div className="bg-pink">
       <Header/>
       <UserForm/>
    </div>
  );
}

export default User;
