import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

const catCollection = ['categories', 'titles', 'questions'];
const userCollection = ['users', 'scores'];
// Categories collection

const getCategories = (setData) => {
    getDocuments(catCollection[0], setData);
}

const getCategory = (catId, setData) => {
    getDocument(`${catCollection[0]}/${catId}`, setData);
}

const getTitles = (catId, setData) => {
    getDocuments(`${catCollection[0]}/${catId}/${catCollection[1]}`, setData);
}

const getTitle = (catId, titleId, setData) => {
    getDocument(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}`, setData);
}

const getQuestions = (catId, titleId, setData) => {
    getDocuments(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}/${catCollection[3]}`, setData);
}

const getQuestion = (catId, titleId, questionId, setData) => {
    getDocument(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}/${catCollection[3]}/${questionId}`, setData);
}

// Users collection

const getUsers = (setData) => {
    getDocuments(userCollection[0], setData);
}

const getUser = (userId, setData) => {
    getDocument(`${userCollection[0]}/${userId}`, setData);
}

const getScores = (userId, setData) => {
    getDocuments(`${userCollection[0]}/${userId}/${userCollection[1]}`, setData);
}

const getScore = (userId, scoreId, setData) => {
    getDocument(`${userCollection[0]}/${userId}/${userCollection[1]}/${scoreId}`, setData);
}

// fetches all documents in a collection
async function getDocuments(path, setData) {
    const result = [];
    try {
      const coll = collection(db, path);
      const querySnapshot = await getDocs(coll);
  
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      setData(result);
  
    } catch (e) {
      setData(['error', e])
    }
}

// fetches the data of a specific category
async function getDocument(path, setData) {
    try {
      const docRef = doc(db, path);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        setData(docSnap.data());
      } else {
        setData(null);
      }
    } catch (error) {
      setData({'error': error});
    }
}

export {
    getCategories,
    getCategory,
    getTitles,
    getTitle,
    getQuestions,
    getQuestion,
    getUsers,
    getUser,
    getScores,
    getScore
}