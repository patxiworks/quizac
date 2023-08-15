import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  FormHelperText,
  Select,
} from "@mui/material";
import Button from "./button";
import styles from "./styles/signup-form.module.css";
const SignupForm = () => {
  return (
    <form className={styles.form}>
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
      <img className={styles.sepIcon} alt="" src="/sep.svg" />
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
      />
      <img className={styles.sepIcon} alt="" src="/sep.svg" />
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
