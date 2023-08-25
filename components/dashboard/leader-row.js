import Image from 'next/image';
import styles from "./styles/leader-row.module.css";

const LeaderRow = ({ position, username, points }) => {
  return (
    <div className={styles.leaderRow}>
      <div className={styles.leaderCellPosition}>
        <i className={styles.leaderPositionText}>{position}</i>
        <div className={styles.leaderCellUser}>
          <Image
            className={styles.userAvatarIcon}
            width={100} height={100}
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
