import { useState, useEffect } from "react";
import CategoriesHead from "./categories-head";
import CategoriesContent from "./categories-content";
import PopupBox from "./popup-box";
import styles from "./styles/quizzes.module.css";
import commonStyles from "./styles/common.module.css";
import { collection, getDocs } from 'firebase/firestore';
import { db } from "@/firebase";

const Quizzes = ({ catid, title, onClose }) => {
  const [quizzes, setQuizzes] = useState(null);

  useEffect(()=> {
    async function fetchQuizzes(id) {
      const quizCollection = collection(db, "quizzQuestions", id, "titles");
      const docSnapshot = await getDocs(quizCollection);
  
      const fetchedQuizzes = docSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          image: data.image,
          description: data.description,
        };
      });
      setQuizzes(fetchedQuizzes);
    } 
    if (catid) fetchQuizzes(catid)
  }, [catid])

  return (
    <div className={styles.quizzes}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <CategoriesHead category={title} />
        </div>
        <CategoriesContent catid={catid} quizzes={quizzes} />
      </div>
    </div>
  );
};

export default Quizzes;
