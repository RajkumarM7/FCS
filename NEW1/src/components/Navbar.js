import { useRef } from 'react'
import {FaBars,FaTimes} from "react-icons/fa";
import "../styles/main.css"
function Navbar() {
    const navRef = useRef();
    const showNavbar = () =>{
        navRef.current.classList.toggle("responsive_nav")
    }
  return (
    <div>
        <header>
            <h3>FCS</h3>
            <nav ref={navRef}>
                <a href="/#">Home</a>
                <a href="/#">Schedule</a>
                <a href="/#">Logout</a>
                <button className="nav-btn nav-close-btn" onClick={showNavbar}>
                    <FaTimes/>
                </button>
            </nav>
            <button className="nav-btn" onClick={showNavbar}>
                <FaBars/>
            </button>
        </header>
    </div>
  )
}

export default Navbar


