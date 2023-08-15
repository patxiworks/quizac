import ArtWork from "../components/auth/art-work";
import FormIntro from "../components/auth/form-intro";
import SignupForm from "../components/auth/signup-form";
import commonStyles from "./common.module.css";
import styles from "./register.module.css";
const Signup = () => {
  return (
    <div className={styles.signup}>
      <div className={commonStyles.mainContainer}>
        <ArtWork image="/art@2x.png" />
        <div className={commonStyles.mainContent}>
          <div className={commonStyles.topImage}>
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
      </div>
    </div>
  );
};

export default Signup;