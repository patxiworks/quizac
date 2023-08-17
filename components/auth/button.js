
import { useMemo } from "react";
import styles from "./styles/button.module.css";
const Button = ({
  onClick,
  signInText,
  typeDesktopPosition,
  typeDesktopWidth,
  typeDesktopBoxSizing,
  typeDesktopCursor,
  typeDesktopBorder,
  typeDesktopAlignSelf,
  signInDisplay,
  signInFlex,
  
}) => {
  const typeDesktopStyle = useMemo(() => {
    return {
      position: typeDesktopPosition,
      width: typeDesktopWidth,
      boxSizing: typeDesktopBoxSizing,
      cursor: typeDesktopCursor,
      border: typeDesktopBorder,
      alignSelf: typeDesktopAlignSelf,
    };
  }, [
    typeDesktopPosition,
    typeDesktopWidth,
    typeDesktopBoxSizing,
    typeDesktopCursor,
    typeDesktopBorder,
    typeDesktopAlignSelf,
  ]);

  const signInStyle = useMemo(() => {
    return {
      display: signInDisplay,
      flex: signInFlex,
    };
  }, [signInDisplay, signInFlex]);

  return (
    <div className={styles.typedesktop} style={typeDesktopStyle}>
      <div className={styles.signIn} style={signInStyle} onClick={onClick}>
        {signInText}
      </div>
    </div>
  );
};

export default Button;