import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

const catCollection = ['categories', 'titles', 'questions'];
const userCollection = ['results', 'scores'];
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

const getTitlesByField = (catId, setData, groupData) => {
    getDocumentsByQuery(`${catCollection[0]}/${catId}/${catCollection[1]}`, setData, groupData);
}

const getTitle = (catId, titleId, setData) => {
    getDocument(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}`, setData);
}

const getQuestions = (catId, titleId, setData) => {
    getDocuments(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}/${catCollection[2]}`, setData);
}

const getQuestion = (catId, titleId, questionId, setData) => {
    getDocument(`${catCollection[0]}/${catId}/${catCollection[1]}/${titleId}/${catCollection[2]}/${questionId}`, setData);
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

const getScore = (userId, category, title, setData) => {
    getDocument(`${userCollection[0]}/${userId}/${userCollection[1]}/${category}##${title}`, setData);
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

// fetches all documents in a collection
async function getDocumentsByQuery(path, setData, data) {
    const result = [];
    try {
      const coll = collection(db, path);
      const q = query(coll, where(data[0], "==", data[1]));
      const querySnapshot = await getDocs(q);
  
      querySnapshot.forEach((doc) => {
        result.push(doc.data());
      });
      setData(result);
  
    } catch (e) {
      setData(['error', e])
    }
}

export {
    getCategories,
    getCategory,
    getTitles,
    getTitlesByField,
    getTitle,
    getQuestions,
    getQuestion,
    getUsers,
    getUser,
    getScores,
    getScore
}