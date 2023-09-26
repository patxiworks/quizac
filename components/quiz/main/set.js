import { db } from '../../../firebase';
import { doc, setDoc, collection, updateDoc, getDoc } from 'firebase/firestore'; 

const setUserScoreWithLevel = async (userId, category, title, level, score) => {
  try {
    const quizId = `${category}_${title}`;
    const userDocRef = doc(db, 'results', userId);
    const scoresCollectionRef = collection(userDocRef, 'scores');
    const scoreDocRef = doc(scoresCollectionRef, quizId);

    
    const scoreDocSnapshot = await getDoc(scoreDocRef);
    
    if (scoreDocSnapshot.exists()) {
      const scoreDocData = {
        [level]: score,
      };

      
      await updateDoc(scoreDocRef, scoreDocData);
    } else {
      await setDoc(scoreDocRef, {
        [level]: score,
      });
    }
  //console.log(`Score for user ${userId} in level ${level} of ${quizId} set to ${score}`);
  } catch (error) {
    console.error('Error setting user score:', error);
  }
};

export { setUserScoreWithLevel };
