import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../../firebase";

import styles from "./Home.module.css";

function Home(props) {
  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.heading}>Faculty Calendar Management System</h1>
      </header>
      <br />
      <br />
      <br />
      <div className={styles.content}>
        {props.name ? (
          <>
            <h2 className={styles.welcome}>Welcome - {props.name}</h2>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <div className={styles.loginContainer}>
              <h3 className={styles.loginLink}>
                <Link to="/login">Login</Link>
              </h3>
              <h3 className={styles.signupLink}>
                <Link to="/signup">Sign up</Link>
              </h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
