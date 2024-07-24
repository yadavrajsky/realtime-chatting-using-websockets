/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
const Home = () => {
    const navigate=useNavigate();
    const {isAuthenticated } = useSelector((state) => state.user);
    useEffect(() => {
        if(isAuthenticated)
        {
          navigate("/dashboard");
        }
    }, [isAuthenticated, navigate])
    return (
        <>
            <div className='mt-3 text-center'>
               My Web Home
            </div>
            <p className="text-blue-600 text-center">
               Whoooooaaaaaa!!!!!!!!!
            </p>
        </>


    )
}

export default Home