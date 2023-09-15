import { useState, useEffect, useCallback } from "react";
import styles from "./styles/quiz-frame.module.css";

const QuizFrame = ( {style, type, id, fullscreen} ) => {
    const [arrowActive, setArrowActive] = useState(false);
    const toggleClass = () => {
      setArrowActive(!arrowActive);
    };
    if (arrowActive) {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      document.body.classList.add('gac-fullscreen');
    } else {
      document.body.classList.remove('gac-fullscreen');
    }
    const arrowStyle = arrowActive ? `${styles.left}` : styles.right;
    const frameStyle = arrowActive ? styles.transformFrame : '';
    const boxStyle = arrowActive ? styles.transformBox : '';
  
    return (
      <div className={styles[style]}>
        <iframe className={`${styles.gacFrame} ${frameStyle}`} src={`https://embed.culturalspot.org/embedv2/${type}/${id}`}></iframe>
        {fullscreen ?
        <div className={`${styles.gacFrameHandle} ${boxStyle}`}>
            <div className={styles.arrowBox} onClick={toggleClass}><i className={`${styles.arrow} ${arrowStyle}`}></i></div>
        </div>
        :''}
      </div>
    )
}

export default QuizFrame;