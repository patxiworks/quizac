import styles from "./styles/leader-row.module.css";
const LeaderRow = ({ position, username, points }) => {
  return (
    <div className={styles.leaderRow}>
      <div className={styles.leaderCellPosition}>
        <i className={styles.leaderPositionText}>{position}</i>
        <div className={styles.leaderCellUser}>
          <img
            className={styles.userAvatarIcon}
            alt=""
            src="/user-avatar1@2x.png"
          />
          <b className={styles.userName}>{username}</b>
        </div>
      </div>
      <div className={styles.leaderCellPoints}>
        <div className={styles.pointsText}>{points}</div>
      </div>
    </div>
  );
};

export default LeaderRow;
