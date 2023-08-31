import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import app from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import LogoArt from "../components/auth/logo-art";
import FormIntro from "../components/auth/form-intro";
import LoginForm from "../components/auth/login-form";
import ExternalLogin from "../components/auth/ext-login";
import commonStyles from "./common.module.css";
import styles from "./index.module.css";

const Login = () => {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const auth = getAuth(app)

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo);
        router.push('/dashboard');
      } else {
        setShowForm(true)
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.login}>
      <div className={commonStyles.mainContainer}>
        <LogoArt assetId='hQFiKbLgmwYEpQ' />
        {showForm ? 
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}>
            <LogoArt assetId='hQFiKbLgmwYEpQ' />
          </div>
          <div className={commonStyles.homeContent}>
            <div className={commonStyles.leftSide8Column}>
              <div className={commonStyles.pageForm}>
                <div className={commonStyles.frame}>
                  <FormIntro
                    title="Sign in here"
                    intro="Log in to your account to start a quiz."
                    icon="👋"
                  />
                  <LoginForm />
                </div>
                <div className={styles.frame1}>
                  <ExternalLogin />
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
        : 
        <div className={commonStyles.mainContent}>
          <div style={{display: 'flex',
  height: '450px',
  justifyContent: 'center',
  alignItems: 'center'}}><CircularProgress /></div>
        </div>
        }
      </div>
    </div>
  );
};

export default Login;
