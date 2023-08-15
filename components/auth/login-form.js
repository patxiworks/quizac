import { TextField } from "@mui/material";
import Button from "./button";
import styles from "./styles/login-form.module.css";
import signupStyles from "./styles/signup-form.module.css";
const LoginForm = () => {
  return (
    <form className={styles.form}>
      <TextField
        className={styles.input}
        color="primary"
        variant="filled"
        type="text"
        label="Email"
        placeholder="me@email.com"
        size="medium"
        margin="none"
      />
      <TextField
        className={styles.input}
        color="primary"
        variant="filled"
        type="text"
        label="Password"
        placeholder="At least 8 characters"
        size="medium"
        margin="none"
      />
      <a className={styles.forgotPassword}>Forgot Password?</a>
      {/*<MainButton label="Sign in" />*/}
      <div className={signupStyles.signUpButton}>
        <Button
          signInText="Sign in"
          typeDesktopPosition="unset"
          typeDesktopWidth="unset"
          typeDesktopBoxSizing="border-box"
          typeDesktopCursor="pointer"
          typeDesktopBorder="none"
          typeDesktopAlignSelf="stretch"
          signInDisplay="inline-block"
          signInFlex="1"
        />
      </div>
    </form>
  );
};

export default LoginForm;
