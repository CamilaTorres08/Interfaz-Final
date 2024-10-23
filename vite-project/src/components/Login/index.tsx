import React, { useState } from 'react'
import styles from './Login.module.css'
import LoginImg from '../../assets/LoginImg.png'
import { Link } from 'react-router-dom';
import * as LoginService from '../Services/LoginService';
import  {useNavigate}  from 'react-router-dom';

type Props = {}

function Login(props: Props) {
    const [userName, setUserName] = useState('');
    const [password,setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserName(e.target.value);
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const history = useNavigate();

    const handleClick = () => {
        console.log(sessionStorage.getItem("token"));
        history("/user"); 
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        startLogin();
    };
    const startLogin = async () =>{
        const answer = await LoginService.LoginUser(userName,password);
        if(answer){
            handleClick();
        }
        
    }

  return (
    <div className={styles['main-container']}>
        <div className={styles['form-login']}>
            <h1 className="title-login">Welcome!</h1>
            <form className={styles['form-container']} onSubmit={handleFormSubmit}>
                <div className={styles['form-group']}>
                    <label htmlFor="username" className="label-email"><i className="fas fa-envelope"></i>Username</label>
                    <input id="name" type="text" className="input"
                    value={userName}
                    onChange={handleUsernameChange}
                    required
                    />
                </div>
                <div className={styles['form-group']}>
                    <label htmlFor="password" className="label-password"><i className="fas fa-lock"></i>Password</label>
                    <div className={styles['password-container']}>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className={styles['password-input']}
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility} className={styles['password-button']}>
                            {showPassword ? <i className="fas fa-eye-slash" style={{ color: '#15505d' }}></i> : <i className="fas fa-eye" style={{ color: '#15505d' }}></i>}
                        </button>
                    </div>
                </div>
                <button className={styles['button']}
                type = 'submit'
                >Sign In</button>
            </form>
                <p className={styles['create-count']}>Don't Have Account? 
                    <Link to='/Register' className={styles['a-create-count']}>Create Account</Link></p>
        </div>
        <div className={styles['picture-login']}>
            <img className={styles['img']} src={LoginImg}/>
            <h2 className={styles["title-image"]}>Task Manager</h2>
            <p className={styles["paragraph-title"]}>Manage your task in One Place with Ease!</p>
        </div>
    </div>
  )
}

export default Login