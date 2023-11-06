import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import { collection, getDocs } from 'firebase/firestore';
import { app, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getCategories } from "@/data/fetch";

import TopBar from "../../components/dashboard/top-bar";
import MainSection from "../../components/dashboard/main-section";
import HistorySummary from "../../components/dashboard/history-summary";
import LeaderSummary from "../../components/dashboard/leader-summary";
import styles from "./index.module.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [categories, setCategories] = useState(null);
  const router = useRouter();
  const auth = getAuth(app)

  useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo)
      } else {
        router.push('/login');
      }
    });
  }, [])

  useEffect(() => {
    getCategories(setCategories);
  }, []);

  return (
    <div id="dashboard" className={styles.dashboard}>
      {user ? 
      <div className={styles.mainContainer}>
        <TopBar />
        <MainSection categories={categories} />
        <div className={styles.gameInfo}>
          <HistorySummary />
          <LeaderSummary />
        </div>
        <div className={styles.footer}>
          <div className={styles.copyright}>© 2023 Some rights reserved</div>
        </div>
      </div>
      : ''}
    </div>
  );
};

export default Dashboard;
