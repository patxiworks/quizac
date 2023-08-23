import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import app from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import ArtWork from "../components/auth/art-work";
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
        <ArtWork image="/art1@2x.png" radius={1} />
        {showForm ? 
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}></div>
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
          <div>
            Loading...
            <h2>You're already logged in. <p><Link href="/dashboard">Click here to go to your dashboard</Link></p></h2>
          </div>
        </div>
        }
      </div>
    </div>
  );
};

export default Login;
