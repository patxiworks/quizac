/*const setUserScoreWithLevel = async (userId, category, title, level, score, params=null) => {
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
  };*/


const saveToLocalStorage = (title, level, score, params=null) => {
    const storage = "quizac"
    const localdata = JSON.parse(localStorage.getItem(storage)) || null
    //const json = localdata && title in localdata ? localdata[title] : {}
    const value = { score, timestamp: Date.now(), params }
    const newTitleData = { [level]: [value] }
    const newData = { [title]: newTitleData }
    if (localdata) {
        if (title in localdata) {
            const json = localdata[title]
            if (level in json) {
                Array.isArray(json[level]) ? json[level].push(value) : json[level] = [value]
            } else {
                json[level] = [value]
            }
        } else {
            localdata[title] = newTitleData
        }
        localStorage.setItem(storage, JSON.stringify(localdata))
    } else {
        localStorage.setItem(storage, JSON.stringify(newData))
    }
}

export {
    saveToLocalStorage
}