import styles from './styles/progress.module.css';

function Progress({ numTotalQuestions, numCurrentQuestion }) {
    const isPast = i => i + 1 < numCurrentQuestion;
    const isCurrent = i => i + 1 === numCurrentQuestion;
  
    return (
      <div className={styles.progress}>
        <div className={styles.bullets}>
          {[...Array(numTotalQuestions)].map((e, i) => (
            <div
              key={`bullet-${i + 1}`}
              className={[
                styles.bullet,
                isPast(i) ? styles.past : '',
                isCurrent(i) ? styles.current : '',
              ].join(' ')}
            />
          ))}
        </div>
      </div>
    );
  }

  export default Progress;