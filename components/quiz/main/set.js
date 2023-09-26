import { db } from '../../../firebase';
import { doc, setDoc, collection, updateDoc, getDoc, addDoc, increment } from 'firebase/firestore';

const setUserScoreWithLevel = async (userId, category, title, level, score) => {
  try {
    const userDocRef = doc(db, 'results', userId);
    const scoresCollectionRef = collection(userDocRef, 'scores');
    const categoryDocRef = doc(scoresCollectionRef, category);
    const categoryDocSnapshot = await getDoc(categoryDocRef);

    if (!categoryDocSnapshot.exists()) {
      await setDoc(categoryDocRef, {});
    }

    const titleSubcollectionRef = collection(categoryDocRef, title);
    const levelCounterDocRef = doc(titleSubcollectionRef, 'levelCounter');
    const levelCounterDocSnapshot = await getDoc(levelCounterDocRef);
    let nextLevelNumber = 1;

    if (levelCounterDocSnapshot.exists()) {
      nextLevelNumber = levelCounterDocSnapshot.data().nextNumber;
      await updateDoc(levelCounterDocRef, {
        nextNumber: increment(1),
      });
    } else {
      await setDoc(levelCounterDocRef, {
        nextNumber: nextLevelNumber + 1,
      });
    }
    const levelDocRef = doc(titleSubcollectionRef, `${level}_${nextLevelNumber}`);
    const levelDocSnapshot = await getDoc(levelDocRef);

    if (levelDocSnapshot.exists()) {
      await updateDoc(levelDocRef, {
        score: score,
      });
    } else {
      await setDoc(levelDocRef, {
        score: score,
      });
    }
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };
