import styles from "./styles/main-button.module.css";
const MainButton = ({ label }) => {
  return (
    <button className={styles.mainButton}>
      <div className={styles.signIn}>{label}</div>
    </button>
  );
};

export default MainButton;
