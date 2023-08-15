import { useState, useCallback } from "react";
import HistoryInfo from "./history";
import PortalPopup from "./portal-popup";
import styles from "./styles/history-summary.module.css";
const HistorySummary = () => {
  const [isHistoryPopupOpen, setHistoryPopupOpen] = useState(false);
  const mainContainer = "dashboard";

  const openHistoryPopup = useCallback(() => {
    setHistoryPopupOpen(true);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "fixed";
  }, []);

  const closeHistoryPopup = useCallback(() => {
    setHistoryPopupOpen(false);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "relative";
  }, []);

  return (
    <>
      <div className={styles.boxContainer}>
        <div className={styles.titleBox}>
            <div className={styles.title}>
              <div className={styles.yourHistory}>Your History</div>
            </div>
          </div>
        <div className={styles.infoBox}>
          <div className={styles.historyRow}>
            <div className={styles.historyCellDate}>
              <div className={styles.historyDate}>Jul 20, 10:30</div>
            </div>
            <div className={styles.historyCellCategory}>
              <div className={styles.historyDate}>Art</div>
            </div>
            <div className={styles.historyCellPoints}>
              <div className={styles.historyDate}>1000 pt</div>
            </div>
            <div className={styles.historyCellBadge}>
              <div className={styles.historyDate}>Gold</div>
              <div className={styles.historyBadgeIcon} />
            </div>
          </div>
          <div className={styles.historyRow}>
            <div className={styles.historyCellDate}>
              <div className={styles.historyDate}>Jul 20, 10:30</div>
            </div>
            <div className={styles.historyCellCategory}>
              <div className={styles.historyDate}>Art</div>
            </div>
            <div className={styles.historyCellPoints}>
              <div className={styles.historyDate}>1000 pt</div>
            </div>
            <div className={styles.historyCellBadge}>
              <div className={styles.historyDate}>Gold</div>
              <div className={styles.historyBadgeIcon} />
            </div>
          </div>
          <div className={styles.historyRow}>
            <div className={styles.historyCellDate}>
              <div className={styles.historyDate}>Jul 20, 10:30</div>
            </div>
            <div className={styles.historyCellCategory}>
              <div className={styles.historyDate}>Art</div>
            </div>
            <div className={styles.historyCellPoints}>
              <div className={styles.historyDate}>1000 pt</div>
            </div>
            <div className={styles.historyCellBadge}>
              <div className={styles.historyDate}>Gold</div>
              <div className={styles.historyBadgeIcon} />
            </div>
          </div>
          <div className={styles.historyRow}>
            <div className={styles.historyCellDate}>
              <div className={styles.historyDate}>Jul 20, 10:30</div>
            </div>
            <div className={styles.historyCellCategory}>
              <div className={styles.historyDate}>Art</div>
            </div>
            <div className={styles.historyCellPoints}>
              <div className={styles.historyDate}>1000 pt</div>
            </div>
            <div className={styles.historyCellBadge}>
              <div className={styles.historyDate}>Gold</div>
              <div className={styles.historyBadgeIcon} />
            </div>
          </div>
          <div className={styles.moreLink}>
            <a className={styles.moreText} onClick={openHistoryPopup}>
              See more
            </a>
            <img className={styles.moreIcon} alt="" src="/more-icon.svg" />
          </div>
        </div>
      </div>
      {isHistoryPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Centered"
          onOutsideClick={false}
        >
          <HistoryInfo onClose={closeHistoryPopup} />
        </PortalPopup>
      )}
    </>
  );
};

export default HistorySummary;
