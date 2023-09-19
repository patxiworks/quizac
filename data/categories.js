import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';

// fetches all documents in the "categories" collection
async function getCategories(setData) {
  const result = {};
  try {
    const categoriesCollection = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesCollection);

    querySnapshot.forEach((doc) => {
      result[doc.id] = doc.data();
    });
    setData(result);

  } catch (e) {
    result['error'] = e;
    setData(result)
  }
}

// fetches the data of a specific category
async function getCategory(id, setData) {
  try {
    const docRef = doc(db, "categories", id);
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

// fetches all documents in the "titles" subcollection
async function getTitles(docId, setData) {
  const result = [];
  try {
    const titlesCollection = collection(db, 'categories', docId, 'titles');
    const querySnapshot = await getDocs(titlesCollection);

    querySnapshot.forEach((doc) => {
      result.push(doc.data());
    });
    setData(result);

  } catch (e) {
    setData(['error', e])
  }
}
//getTitles('cuisine');

// fetches the data of a specific title
async function getTitle(docId, titleId) {
  try {
    const titleRef = doc(db, 'categories', docId, 'titles', titleId);
    const titleDocSnap = await getDoc(titleRef);

    if (docSnap.exists()) {
      setData(docSnap.data());
    } else {
      setData(null);
    }
  } catch (error) {
    setData({'error': error});
  }
}
//getTitle('cuisine', '0AEnVpcdmyKCOg'); 

async function getQuestions(documentId) {
  try {
    const categoryDocRef = collection(db, 'categories', documentId,'questions');
    const querySnapshot = await getDocs(categoryDocRef);

    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        console.log('Questions data:', docSnap.data());
      } else {
        console.log('Document does not exist');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
//getQuestions('cuisine');

async function getquestion(categoryId, questionId) {
  try {
    const questionRef = doc(db, 'categories', categoryId, 'questions', questionId);
    const questionDocSnap = await getDoc(questionRef);

    if (questionDocSnap.exists()) {
      console.log('Question data:', questionDocSnap.data());
    } else {
      console.log('question document does not exist');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
//getquestion('cuisine', '0AEnVpcdmyKCOg');

export {
    getCategories,
    getCategory,
    getTitles,
    getTitle
}