import LeaderRow from "./leader-row";
import styles from "./styles/leaderboard.module.css";
import commonStyles from "./styles/common.module.css";
const Leaderboard = ({ onClose }) => {
  return (
    <div className={styles.leaderboard}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <div className={commonStyles.contentTitle}>Leaderboard</div>
        </div>
        <div className={styles.mainContent}>
          <LeaderRow position="1" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="2" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="3" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="4" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="5" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="6" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="7" username="Gerald Jones" points="1000 pt" />
          <LeaderRow position="8" username="Gerald Jones" points="1000 pt" />
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
