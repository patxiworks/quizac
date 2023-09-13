import { db } from '../firebase';
import { collection, getDocs, doc, getDoc, query, where, documentId } from 'firebase/firestore';

// Function to get all documents in the "categories" collection
async function getAllCategories() {
  try {
    const categoriesCollection = collection(db, 'categories');
    const querySnapshot = await getDocs(categoriesCollection);

    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        console.log('Document data:', docSnap.data());
      } else {
        console.log('Document does not exist');
      }
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function getCategoryById(categoryId) {
  try {
    const docRef = doc(db, "categories", categoryId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Category data:', docSnap.data());
    } else {
      console.log('Category does not exist');
    }
  } catch (error) {
    console.error('Error fetching category by ID:', error);
  }
}

getAllCategories();
getCategoryById('cuisine');

async function getTitles(documentId) {
  try {
    const titlesCollection = collection(db, 'categories', documentId, 'titles');
    const querySnapshot = await getDocs(titlesCollection);

    querySnapshot.forEach((docSnap) => {
      if (docSnap.exists()) {
        console.log(docSnap.data());
      } else {
        console.log('Document does not exist');
      }
    });
  } catch (error) {
    console.error('Error:', error);
  }
}
getTitles('cuisine');

async function getTitle(categoryId, titleId) {
  try {
    const titleRef = doc(db, 'categories', categoryId, 'titles', titleId);
    const titleDocSnap = await getDoc(titleRef);

    if (titleDocSnap.exists()) {
      console.log('Title data:', titleDocSnap.data());
    } else {
      console.log('Title document does not exist');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
getTitle('cuisine', '0AEnVpcdmyKCOg'); 

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
getQuestions('cuisine');

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
getquestion('cuisine', '0AEnVpcdmyKCOg'); 