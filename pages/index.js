import Link from "next/link";
import ArtWork from "../components/auth/art-work";
import FormIntro from "../components/auth/form-intro";
import LoginForm from "../components/auth/login-form";
import commonStyles from "./common.module.css";
import styles from "./index.module.css";
const Login = () => {
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
                            Sign in with Google
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
                            Sign in as a guest
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
