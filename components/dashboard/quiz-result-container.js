import { useMemo } from "react";
import Image from 'next/image';
//import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import styles from "./styles/quiz-result-container.module.css";

const QuizResultContainer = ({ icon, value, message, propWidth }) => {
  const frameStyle = useMemo(() => {
    return {
      width: propWidth,
    };
  }, [propWidth]);

  return (
    <div className={styles.antDesignflagFilledParent}>
      <Image className={styles.antDesignflagFilledIcon} width={100} height={100} alt="" src={icon} />
      <div className={styles.frame} style={frameStyle}>
        <b className={styles.b}>{value}</b>
        <div className={styles.correctAnswers}>{message}</div>
      </div>
    </div>
  );
};

export default QuizResultContainer;
