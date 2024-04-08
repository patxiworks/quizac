import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import Image from 'next/image';
import Button from "./button";
import styles from "./styles/signup-form.module.css";
import { getAuth, createUserWithEmailAndPassword , updateProfile} from "firebase/auth";
import { app } from "../../firebase";

const SignupForm = () => {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState("Male");
  const [country, setCountry] = useState("Nigeria");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter()

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const auth = getAuth(app);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user)
      const displayName = `${firstName} `;
     updateProfile(user, {
        displayName: displayName,
      });
      setDisplayName(displayName);
      router.push({
        pathname: '/dashboard',
        query: { displayName: displayName },
      });
    } catch (error) {
      const errorCode = error.code;
    }
  }
  
  return (
    <form className={styles.form} onClick={handleSignUp}>
      <div className={styles.firstNameParent}>
        <TextField
          className={styles.firstName}
          sx={{ width: 182 }}
          color="primary"
          variant="filled"
          type="text"
          label="First name"
          size="medium"
          margin="none"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextField
          className={styles.firstName}
          sx={{ width: 182 }}
          color="primary"
          variant="filled"
          type="text"
          label="Surname"
          size="medium"
          margin="none"
          required
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
      </div>
      <div className={styles.firstNameParent}>
        <FormControl sx={{ width: 182 }} variant="filled" required>
          <InputLabel color="primary">Gender</InputLabel>
          <Select color="primary" size="medium" label="Gender">
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
          </Select>
          <FormHelperText />
        </FormControl>
        <FormControl sx={{ width: 182 }} variant="filled" required>
          <InputLabel color="primary">Country</InputLabel>
          <Select color="primary" size="medium" label="Country">
            <MenuItem value="Nigeria">Nigeria</MenuItem>
          </Select>
          <FormHelperText />
        </FormControl>
      </div>
      <Image className={styles.sepIcon} width={100} height={100} alt="" src="/sep.svg" />
      <TextField
        className={styles.email}
        color="primary"
        variant="filled"
        type="email"
        label="Email"
        placeholder="me@email.com"
        size="medium"
        margin="none"
        required
       onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        className={styles.email}
        color="primary"
        variant="filled"
        type="password"
        label="Password"
        placeholder="At least 8 characters"
        size="medium"
        margin="none"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        className={styles.email}
        color="primary"
        variant="filled"
        type="password"
        label="Password"
        size="medium"
        margin="none"
        required
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <Image className={styles.sepIcon} width={100} height={100} alt="" src="/sep.svg" />
      <div className={styles.signUpButton}>
        <Button
        
          signInText="Sign up"
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

export default SignupForm;
