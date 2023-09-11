import React, { useState, useCallback, useEffect } from "react";
import Image from 'next/image';
import HistoryInfo from "./history";
import PortalPopup from "./portal-popup";
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, app } from "@/firebase";
import { getAuth } from "firebase/auth";

import styles from "./styles/history-summary.module.css";

const auth = getAuth(app);

const HistorySummary = () => {
  const [currentLevel, setCurrentLevel] = useState(1);
  const [isHistoryPopupOpen, setHistoryPopupOpen] = useState(false);
  const mainContainer = "dashboard";
  const [userHistory, setUserHistory] = useState([]);
  const [latestTimestamp, setLatestTimestamp] = useState(null);

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

  useEffect(() => {
    async function fetchUserHistory() {
      if (auth?.currentUser) {
        const userEmail = auth.currentUser.email;

        const quizzResultCollection = collection(
          db,
          "quizzresult",
          userEmail,
          `level${currentLevel}`
        );

        const queryObj = query(
          quizzResultCollection,
          where('userEmail', '==', auth.currentUser.email),
          where('category', '==', 'art'),
          orderBy('timestamp', 'desc'), 
        );

        try {
          const querySnapshot = await getDocs(queryObj);

          let totalScore = 0;
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            totalScore += data.score || 0;
          });

          setLatestTimestamp(querySnapshot.docs[0]?.data().timestamp || null);

          const totalScoreEntry = {
            id: 'art',
            timestamp: latestTimestamp,
            category: 'Art',
            score: totalScore,
            title: 'Total Score',
          };

          setUserHistory([totalScoreEntry]);
        } catch (error) {
          console.error('Error fetching user history:', error);
        }
      }
    }

    fetchUserHistory();
  }, [currentLevel,latestTimestamp]);

  function formatTimestamp(timestamp) {
    if (timestamp) {
      const date = timestamp.toDate();
      return date.toLocaleString(); 
    }
    return 'N/A';
  }

  return (
    <>
      <div className={styles.boxContainer}>
        <div className={styles.titleBox}>
          <div className={styles.title}>
            <div className={styles.yourHistory}>Your History</div>
          </div>
        </div>
        <div className={styles.infoBox}>
          {userHistory.map((historyItem) => (
            <div key={historyItem.id} className={styles.historyRow}>
              <div className={styles.historyCellDate}>
                <div className={styles.historyDate}>
                  {formatTimestamp(historyItem.timestamp)}
                </div>
              </div>
              <div className={styles.historyCellCategory}>
                <div className={styles.historyDate}>{historyItem.category}</div>
              </div>
              <div className={styles.historyCellPoints}>
                <div className={styles.historyDate}>{historyItem.score} pt</div>
              </div>
              <div className={styles.historyCellBadge}>
                <div className={styles.historyDate}>Gold</div>
                <div className={styles.historyBadgeIcon} />
              </div>
            </div>
          ))}
          <div className={styles.moreLink}>
            <a className={styles.moreText} onClick={openHistoryPopup}>
              See more
            </a>
            <Image className={styles.moreIcon} width={100} height={100} alt="" src="/more-icon.svg" />
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
