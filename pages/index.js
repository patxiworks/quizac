import Link from "next/link";
import ArtWork from "../components/auth/art-work";
import FormIntro from "../components/auth/form-intro";
import LoginForm from "../components/auth/login-form";
import commonStyles from "./common.module.css";
import styles from "./index.module.css";
import { useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';
import app from "@/firebase";


const Login = () => {
  const provider = new GoogleAuthProvider();

  const [user, setUser] = useState(null);


  const SIGN_IN_WITH_GOOGLE = () => {
    const auth = getAuth(app);
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log("user >>>", user);
        setUser(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        alert(errorCode);
      });
  };


  const SIGN_IN_ANONYMOUSLY = () => {
    const auth = getAuth();

    signInAnonymously(auth)
      .then(() => {
        console.log("you have signed in as guest")
        alert(user)
        // Signed in..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        // ...
      });
  };


  return (
    <div className={styles.login}>
      <div className={commonStyles.mainContainer}>
        <ArtWork image="/art1@2x.png" />
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}>
          </div>
          <div className={commonStyles.homeContent}>
            <div className={commonStyles.leftSide8Column}>
              <div className={commonStyles.pageForm}>
                <div className={commonStyles.frame}>
                  <FormIntro
                    title="Welcome back"
                    intro="Log in to your account to start a quiz."
                    icon="👋"
                  />
                  <LoginForm />
                </div>
                <div className={styles.frame1}>
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
                  <div className={styles.dontYouHaveAnAccountParent}>
                    <div
                      className={styles.dontYouHave}
                    >{`Don't you have an account? `}</div>
                    <Link className={styles.signUp} href="/register">
                      Sign up
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={commonStyles.copyright}>© 2023 Some rights reserved</div>
        </div>
      </div>
    </div>
  );
};

export default Login;
