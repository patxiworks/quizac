import { useState, useCallback } from "react";
import Leaderboard from "./leaderboard";
import PortalPopup from "./portal-popup";
import styles from "./styles/leader-summary.module.css";
import boxStyles from "./styles/history-summary.module.css";
const LeaderSummary = () => {
  const [isLeaderboardPopupOpen, setLeaderboardPopupOpen] = useState(false);
  const mainContainer = "dashboard";

  const openLeaderboardPopup = useCallback(() => {
    setLeaderboardPopupOpen(true);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "fixed";
  }, []);

  const closeLeaderboardPopup = useCallback(() => {
    setLeaderboardPopupOpen(false);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "relative";
  }, []);

  return (
    <>
      <div className={boxStyles.boxContainer}>
      <div className={boxStyles.titleBox}>
        <div className={boxStyles.title}>
          <div className={styles.leaderboard}>Leaderboard</div>
        </div>
      </div>
      <div className={boxStyles.infoBox}>
        <div className={styles.leaderRow}>
          <div className={styles.leaderCellPosition}>
            <div className={styles.leaderPositionText}>1st</div>
          </div>
          <div className={styles.leaderCellUser}>
            <div className={styles.userAvatar} />
            <div className={styles.leaderPositionText}>User</div>
          </div>
          <div className={styles.leaderCellPoints}>
            <div className={styles.leaderPositionText}>1000 pt</div>
          </div>
          <div className={styles.leaderCellBadge}>
            <div className={styles.leaderPositionText}>Gold</div>
            <div className={styles.userAvatar} />
          </div>
        </div>
        <div className={styles.leaderRow}>
          <div className={styles.leaderCellPosition}>
            <div className={styles.leaderPositionText}>1st</div>
          </div>
          <div className={styles.leaderCellUser}>
            <div className={styles.userAvatar} />
            <div className={styles.leaderPositionText}>User</div>
          </div>
          <div className={styles.leaderCellPoints}>
            <div className={styles.leaderPositionText}>1000 pt</div>
          </div>
          <div className={styles.leaderCellBadge}>
            <div className={styles.leaderPositionText}>Gold</div>
            <div className={styles.userAvatar} />
          </div>
        </div>
        <div className={styles.leaderRow}>
          <div className={styles.leaderCellPosition}>
            <div className={styles.leaderPositionText}>1st</div>
          </div>
          <div className={styles.leaderCellUser}>
            <div className={styles.userAvatar} />
            <div className={styles.leaderPositionText}>User</div>
          </div>
          <div className={styles.leaderCellPoints}>
            <div className={styles.leaderPositionText}>1000 pt</div>
          </div>
          <div className={styles.leaderCellBadge}>
            <div className={styles.leaderPositionText}>Gold</div>
            <div className={styles.userAvatar} />
          </div>
        </div>
        <div className={styles.leaderRow}>
          <div className={styles.leaderCellPosition}>
            <div className={styles.leaderPositionText}>1st</div>
          </div>
          <div className={styles.leaderCellUser}>
            <div className={styles.userAvatar} />
            <div className={styles.leaderPositionText}>User</div>
          </div>
          <div className={styles.leaderCellPoints}>
            <div className={styles.leaderPositionText}>1000 pt</div>
          </div>
          <div className={styles.leaderCellBadge}>
            <div className={styles.leaderPositionText}>Gold</div>
            <div className={styles.userAvatar} />
          </div>
        </div>
        <div className={styles.moreLink}>
          <a className={styles.moreText} onClick={openLeaderboardPopup}>
            See more
          </a>
          <img className={styles.moreIcon} alt="" src="/more-icon.svg" />
        </div>
      </div>
      </div>
      {isLeaderboardPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Centered"
          onOutsideClick={false}
        >
          <Leaderboard onClose={closeLeaderboardPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default LeaderSummary;
