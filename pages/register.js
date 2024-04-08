import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { app } from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { CircularProgress } from '@mui/material';
import LogoArt from "../components/auth/logo-art";
import FormIntro from "../components/auth/form-intro";
import SignupForm from "../components/auth/signup-form";
import commonStyles from "./common.module.css";
import styles from "./register.module.css";

const Signup = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={styles.signup}>
      <div className={commonStyles.mainContainer}>
        <LogoArt assetId='eQHH3QrjkD0OUQ?nzh' />
        {showForm ? 
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}>
            <LogoArt assetId='eQHH3QrjkD0OUQ?nzh' />
          </div>
          <div className={commonStyles.homeContent}>
            <div className={commonStyles.leftSide8Column}>
              <div className={commonStyles.pageForm}>
                <div className={commonStyles.frame}>
                  <FormIntro 
                    title="Register here" 
                    intro="Fill in your details below to get started."
                    icon="✍"
                  />
                  <SignupForm />
                </div>
              </div>
            </div>
          </div>
          <div className={commonStyles.copyright}>© 2023 Some rights reserved</div>
        </div>
        : 
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.loadingContent}><CircularProgress /></div>
        </div>
        }
      </div>
    </div>
  );
};

export default Signup;