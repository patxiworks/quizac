import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import app from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import TopBar from "@/components/dashboard/top-bar";
import QuizSection from "@/components/quiz/quiz-section";
//import HistorySummary from "../../components/dashboard/history-summary";
//import LeaderSummary from "../../components/dashboard/leader-summary";
import styles from "../../index.module.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const auth = getAuth(app)
  const router = useRouter();
  const { category, title } = router.query;

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo)
      } else {
        router.push('/login');
      }
    });
  }, [])

  return (
    <div id="dashboard" className={styles.dashboard}>
      <div className={styles.mainContainer}>
        <TopBar />
        <QuizSection category={category} title={title} />
        <div className={styles.gameInfo}>
        </div>
        <div className={styles.footer}>
          <div className={styles.copyright}>© 2023 Some rights reserved</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
