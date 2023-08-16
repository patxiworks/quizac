import { TextField } from "@mui/material";
import { useRouter } from "next/router";
import Button from "./button";
import styles from "./styles/login-form.module.css";
import signupStyles from "./styles/signup-form.module.css";
import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db, app } from "../../firebase";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter()

  const handleSignIn = async (e) => {
    e.preventDefault();
    const auth = getAuth(app);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        router.push('/dashboard')
        })
      .catch((error) => {
       const errorCode = error.code;
      });
  };

  return (
    <form className={styles.form} onClick={handleSignIn}>
      <TextField
        className={styles.input}
        color="primary"
        variant="filled"
        type="email"
        label="Email"
        placeholder="me@email.com"
        size="medium"
        margin="none"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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
        ></Button>
      </div>
    </form>
  );
};

export default LoginForm;
