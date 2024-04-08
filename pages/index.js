import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { app } from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LogoArt from "../components/auth/logo-art";
import FormIntro from "../components/auth/form-intro";
import LoginForm from "../components/auth/login-form";
import ExternalLogin from "../components/auth/ext-login";
import commonStyles from "./common.module.css";
import styles from "./index.module.css";

const Login = () => {
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();
  const auth = getAuth(app)

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        router.push('/dashboard');
      } else {
        setShowForm(true)
      }
    });
  }, [])

  return (
    <div className={styles.login}>
      <div className={commonStyles.mainContainer}>
        <LogoArt assetId='hQFiKbLgmwYEpQ' />
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}></div>
          <div className={commonStyles.homeContent}>
            <div className={commonStyles.leftSide8Column}>
              <div className={commonStyles.pageForm}>
                <div className={commonStyles.frame}>
                  <FormIntro
                    title="Welcome to Quizac"
                    intro=""
                    icon="👋"
                  />
                  <div>
                  <p style={{fontSize: '20px'}}>Quizac is a platform that will help you learn about Nigeria and its culture.
                  You can choose to <Link className={styles.signUp} href="/login">sign in to account</Link> or just <Link className={styles.signUp} href="#">play as a random user</Link>.</p>
                  </div>
                </div>
                <div className={styles.frame1}>
                  
                  
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
