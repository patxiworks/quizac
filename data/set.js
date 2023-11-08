import { db } from '../firebase';
import { doc, collection, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';

const setUserScoreWithLevel = async (userId, category, title, level, score, params=null) => {
  try {
    const categoryDocRef = doc(db, 'categories', category);
    //const quizScoresDocRef = doc(categoryDocRef, 'titles', title, 'scores', userId);
    //const quizScoresDocSnapshot = await getDoc(quizScoresDocRef);
    const usersCollectionRef = collection(categoryDocRef, 'users');
    const userDocRef = doc(usersCollectionRef, userId);
    const scoresCollectionRef = collection(userDocRef, 'scores');
    const quizTitleDocRef = doc(scoresCollectionRef, title);
    const quizTitleDocSnapshot = await getDoc(quizTitleDocRef);

    if (quizTitleDocSnapshot.exists()) {
      await updateDoc(quizTitleDocRef, {
        //[`${level}.score`]: score,
        //[`${level}.timestamp`]: Date.now(),
        [level]: arrayUnion({ score, timestamp: Date.now(), params }),
      });
    } else {
      await setDoc(quizTitleDocRef, {
        [level]: [{
          score,
          timestamp: Date.now(),
          params,
        }],
      });
    }
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };

/*
const setUserScoreWithLevel = async (userId, category, title, level, score) => {
  try {
    const userDocRef = doc(db, 'results', userId);
    const scoresCollectionRef = collection(userDocRef, 'scores');
    const userScoresDocRef = doc(scoresCollectionRef, `${category}##${title}`);

    const userScoresSnapshot = await getDoc(userScoresDocRef);

    if (userScoresSnapshot.exists()) {
      await updateDoc(userScoresDocRef, {
        [`${level}`]: arrayUnion({ score, timestamp: Date.now() }),
      });
    } else {
      await setDoc(userScoresDocRef, {
          [level]: [{ score, timestamp: Date.now() }],
      });
    }
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };
*/