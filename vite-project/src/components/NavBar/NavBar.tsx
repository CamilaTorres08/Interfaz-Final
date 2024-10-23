import styles from "./NavBar.module.css"
import logo from '../../assets/logo.png'; 
import { Link } from 'react-router-dom';
import  {useNavigate}  from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

type Props = {
    username: string
}

function NavBar(props: Props) {
    const {username} = props;
    const history = useNavigate();
    
    const isAdmin = () => {
        const token = sessionStorage.getItem("token");
        if(token){
            const role = Object.entries(jwtDecode(token))[0][1];
            return role === 'ADMIN';
        }
        return false;
        
    };

  
    const logout = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
        history("/"); 
    }

    const handleClick = () => {
        logout();  
    };

    return (
    
    <header className={styles['header']}>
        <div className={styles['header-task']}>
            <img src={logo} alt="Logo" className={styles['logo']} />
            <h1 className={styles['header-title']}>TaskManager</h1>
        </div>
    
        <nav>
            <ul className={styles['nav-list']}>
                <li>
                    <Link to={"/user"} className={styles['nav-link']}>Tasks</Link>
                </li>
                {isAdmin() ? 
                (
                <li>
                    <Link to={"/user/insights"} className={styles['nav-link']} >Insights</Link>
                </li> )
                 : ''}
            </ul>        
        </nav>
        <div className={styles['user']}>
            <h4>Welcome, {username}</h4>
            <button className={styles['button']} onClick={handleClick}>Log Out</button>
        </div>
    </header>
    );
}
export default NavBar;
