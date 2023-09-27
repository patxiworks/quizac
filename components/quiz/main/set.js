import { db } from '../../../firebase';
import { doc, setDoc, collection, updateDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
        scores: {
          [level]: [{ score, timestamp: Date.now() }],
        },
      });
    }
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };
