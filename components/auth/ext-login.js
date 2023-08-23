import { useState, useEffect } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import app from "@/firebase";
import styles from "./styles/ext-login.module.css";

const ExternalLogin = () => {
    const [user, setUser] = useState(null);
    const provider = new GoogleAuthProvider();
    const auth = getAuth(app);

    const SIGN_IN_WITH_GOOGLE = () => {
        signInWithPopup(auth, provider)
          .then((result) => {
            setUser(result.user);
          })
          .catch((error) => {
            const errorCode = error.code;
            //alert(errorCode);
          });
      };
    
      const SIGN_IN_ANONYMOUSLY = () => {
        signInAnonymously(auth)
          .then(() => {
            console.log("you have signed in as guest")
            //alert(user)
            // Signed in..
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ...
          });
      };

    return (
        <div className={styles.frame2}>
            <div className={styles.socialSignIn}>
                <div className={styles.or}>
                    <div className={styles.orChild} />
                    <div className={styles.or1}>Or</div>
                    <div className={styles.orChild} />
                </div>
                <div className={styles.socialButtonsColumns}>
                    <div className={styles.socialButton}>
                        <img
                            className={styles.googleIcon}
                            alt=""
                            src="/google1.svg"
                        />
                        <img
                            className={styles.facebookIcon}
                            alt=""
                            src="/facebook.svg"
                        />
                        <div className={styles.signInWith}>
                            <div onClick={SIGN_IN_WITH_GOOGLE} className={`${styles.button} ${styles.google}`}>
                                Sign in with Google
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.socialButtonsColumns}>
                    <div className={styles.socialButton}>
                        <img
                            className={styles.googleIcon}
                            alt=""
                            src="/google2.svg"
                        />
                        <img
                            className={styles.facebookIcon}
                            alt=""
                            src="/facebook.svg"
                        />
                        <div className={styles.signInWith}>
                            <div onClick={SIGN_IN_ANONYMOUSLY} className={`${styles.button} ${styles.google}`}>
                                Sign in as a guest
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExternalLogin;