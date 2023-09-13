import { db } from "../firebase"; 
import { collection, query,  getDocs,getDoc, addDoc, doc,  updateDoc} from 'firebase/firestore';

const resultCollection = collection(db, 'results');

const getResults = async () => {
  const resultQuery = query(resultCollection);
  const resultSnapshot = await getDocs(resultQuery);
  return resultSnapshot.docs.map(doc => doc.data());
};

const getUsers = async () => {
  try {
    const resultQuery = query(resultCollection);
    const resultSnapshot = await getDocs(resultQuery);
    const usersWithUserData = resultSnapshot.docs.map(doc => doc.data());
    const userIds = usersWithUserData.map(user => user.userId);
    return userIds;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

const getUser = async (userId) => {
  const resultDocRef = doc(resultCollection, userId);
  const resultDocSnapshot = await getDoc(resultDocRef);
  return resultDocSnapshot.exists() ? resultDocSnapshot.data() : null;
};

const getuserScores = async (userId) => {
  const user = await getUser(userId);
  return user ? user.scores.map(userScore => userScore.quizId) : [];
};

const getuserScore = async (userId, quizId) => {
  const user = await getUser(userId);
  if (user) {
    const score = user.scores.find(userScore => userScore.quizId === quizId);
    return score ? score.score : null; 
  }
  return null;
};

const setUser = async (user) => {
  try {
    const userDocRef = await addDoc(resultCollection, user);
    console.log("User document written with ID: ", userDocRef.id);
  } catch (error) {
    console.error('Error setting user data:', error);
  }
};

const setuserScore = async (userId, quizId, score) => {
  const userDocRef = doc(resultCollection, userId);
  const userDocSnapshot = await getDoc(userDocRef);

  if (userDocSnapshot.exists()) {
    const userData = userDocSnapshot.data();
    const updatedScores = userData.scores || [];
    updatedScores.push({ quizId, score });

    await updateDoc(userDocRef, {
      scores: updatedScores,
    });
  }
};

export {
  getResults,
  getUsers,
  getUser,
  getuserScores,
  getuserScore,
  setUser,
  setuserScore,
};