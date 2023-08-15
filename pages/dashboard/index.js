import TopBar from "../../components/dashboard/top-bar";
import MainSection from "../../components/dashboard/main-section";
import HistorySummary from "../../components/dashboard/history-summary";
import LeaderSummary from "../../components/dashboard/leader-summary";
import styles from "./index.module.css";
const Dashboard = () => {
  return (
    <div id="dashboard" className={styles.dashboard}>
      <div className={styles.mainContainer}>
        <TopBar />
        <MainSection />
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
