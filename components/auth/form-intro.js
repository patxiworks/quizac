import styles from "./styles/form-intro.module.css";
const FormIntro = ({title, intro, icon}) => {
  return (
    <div className={styles.intro}>
      <div className={styles.introMessageContainer}>
        <span className={styles.introMessage}>{title}</span>
        <span> {icon}</span>
      </div>
      <div className={styles.todayIsAContainer}>
        <p className={styles.todayIsA}>{intro}</p>
      </div>
    </div>
  );
};

export default FormIntro;
