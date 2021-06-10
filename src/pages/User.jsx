import React from 'react'
import '../styles/css/style.css';
import Header from "../components/Header/Header"
import UserForm from '../components/UserForm/UserForm';


const User = () => {

  return (
    <div className="bg-pink">
       <Header/>
       <UserForm/>
    </div>
  );
}

export default User;
