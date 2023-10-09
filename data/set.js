import { db } from '../firebase';
import { doc, collection, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const setUserScoreWithLevel = async (userId, category, title, level, score) => {
  try {
    const categoryDocRef = doc(db, 'categories', category);
    const usersCollectionRef = collection(categoryDocRef, 'users');
    const userDocRef = doc(usersCollectionRef, userId);
    const scoresCollectionRef = collection(userDocRef, 'scores');
    const quizTitleDocRef = doc(scoresCollectionRef, title);
    const quizTitleDocSnapshot = await getDoc(quizTitleDocRef);

    if (quizTitleDocSnapshot.exists()) {
      await updateDoc(quizTitleDocRef, {
        [`${level}.score`]: score,
        [`${level}.timestamp`]: Date.now(),
      });
    } else {
      await setDoc(quizTitleDocRef, {
          [level]: {
            score,
            timestamp: Date.now(),
        },
      });
    }
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };

