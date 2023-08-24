import { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Link from "next/link";
import { collection, getDocs } from 'firebase/firestore';
import { app, db } from "@/firebase";
import { getAuth, onAuthStateChanged } from 'firebase/auth';

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
    async function fetchCategories() {
      const catsCollection = collection(db, "quizzQuestions");
      const querySnapshot = await getDocs(catsCollection);

      const fetchedCategories = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          description: data.description,
        };
      });
      setCategories(fetchedCategories);
    } 
    fetchCategories();
  }, []);

  return (
    <div id="dashboard" className={styles.dashboard}>
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
    </div>
  );
};

export default Dashboard;
