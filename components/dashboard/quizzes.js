import CategoriesHead from "./categories-head";
import CategoriesContent from "./categories-content";
import styles from "./styles/quizzes.module.css";
import commonStyles from "./styles/common.module.css";
const Quizzes = ({ onClose, category }) => {
  return (
    <div className={styles.quizzes}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <CategoriesHead category={category} />
        </div>
        <CategoriesContent />
      </div>
    </div>
  );
};

export default Quizzes;
