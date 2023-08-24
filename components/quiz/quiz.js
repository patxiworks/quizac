import { useState, useEffect } from 'react';
import { db, app } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'
import styles from "./styles/quiz.module.css";
const auth = getAuth(app);

const Quiz = ({category, title, getScore}) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(10);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showResetButton, setShowResetButton] = useState(false);
  const [levels, setLevels] = useState([]); 
  const [moraleBooster, setMoraleBooster] = useState('');
  const [moraleBoosters, setMoraleBoosters] = useState({
    complete: [],
    half: [],
    wrong: [],
  });

  useEffect(() => {
    async function fetchLevels() {
      const levelsCollection = collection(db, 'levels');
      const querySnapshot = await getDocs(levelsCollection);
      const levelData = querySnapshot.docs.map((doc) => doc.data());
      setLevels(levelData);
    }
    async function fetchMoraleBoosters() {
      const moraleBoosterCollection = collection(db, 'morale_boosters');
      try {
        const querySnapshot = await getDocs(moraleBoosterCollection);
        const fetchedBoosters = querySnapshot.docs[0].data();
        setMoraleBoosters(fetchedBoosters);
      } catch (error) {
      }
    }
    fetchLevels();
    fetchMoraleBoosters();
  }, []);

  useEffect(() => {
    if (currentLevel <= levels.length) {
      setTimer(levels[currentLevel - 1]?.timeLimit || 10);
    }
  }, [currentLevel, levels]);

  useEffect(() => {
    async function fetchDataForLevel(levelNumber) {
      const questionsCollection = collection(
        db,
        `quizzQuestions/${category}/titles/${title}/questions`
      );
      const querySnapshot = await getDocs(questionsCollection);

      const fetchedQuestions = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          question: data.question,
          options: data.options,
          answer: data.answer,
        };
      });
      setQuestions(fetchedQuestions);
    } 
  
    fetchDataForLevel(currentLevel);
  }, [category, title, currentLevel]);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0 && !isQuizEnded) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        handleNextQuestion();
      }
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isQuizEnded]);

  const handleOptionChange = (event, questionIndex) => {
    if (!isQuizEnded) {
      const newSelectedOptions = [...selectedOptions];
      newSelectedOptions[questionIndex] = event.target.value;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const displayRandomMoraleBooster = (category) => {
    const randomIndex = Math.floor(Math.random() * moraleBoosters[category].length);
    return moraleBoosters[category][randomIndex];
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(levels[currentLevel - 1]?.timeLimit || 10); // Set the timer based on the level's time limit
    } else {
      endQuiz();
    }
  };
  
  const moveToNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= levels.length) {
      if (score >= levels[nextLevel - 1].minScoreToUnlock) {
        setCurrentLevel(nextLevel);
        setSelectedOptions([]);
        setIsQuizEnded(false);
        setTimer(10); 
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizSubmitted(false);
        setShowResetButton(false);
      } else {
        alert("You need a higher score to unlock the next level.");
        setShowResetButton(true);
      }
    } else {
      alert("Congratulations! You've completed all levels.");
    }
  };
  
  const resetLevel = () => {
    setSelectedOptions([]);
    setIsQuizEnded(false);
    setCurrentQuestionIndex(0);
    const timeLimitForCurrentLevel = levels[currentLevel - 1]?.timeLimit || 10;
    setTimer(timeLimitForCurrentLevel);
    setScore(0);
    setQuizSubmitted(false);
    setShowResetButton(false);
  };

  const endQuiz = async () => {
    setIsQuizEnded(true);
    if (!quizSubmitted) {
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] === questions[i].answer) {
          score++;
        }
      }
      const levelScoresCollection = collection(
        db,
        "quizzresult",auth.currentUser.email,`level${currentLevel}`,      );

      await addDoc(levelScoresCollection, { score: score });

      setScore(score);
      getScore(score);
      setQuizSubmitted(true);
      
      let moraleBoosterText = '';
      if (score === questions.length) {
        moraleBoosterText = displayRandomMoraleBooster('complete');
      } else if (score >= questions.length / 2) {
        moraleBoosterText = displayRandomMoraleBooster('half');
      } else {
        moraleBoosterText = displayRandomMoraleBooster('wrong');
      }
      setMoraleBooster(moraleBoosterText);
      if (score < levels[currentLevel - 1].minScoreToUnlock) {
        setShowResetButton(true);
      }
    }
  };

  return (
    <div className={styles.quizContainer}>
      <div className={styles.scoreBox}>
        <div className={styles.scorePanel}>
          <div>Level: {currentLevel}</div>
          <div>Score: {score}</div>
        </div>
      </div>
      {isQuizEnded ? (
        <div className={styles.quizResults}>
          <p>Quiz Ended</p>
          
          {moraleBooster !== '' && (
            <div className={styles.moraleBooster}>
              <p>{moraleBooster}</p>
            </div>
          )}
          <button className={styles.nextButton} onClick={moveToNextLevel}>Next Level</button>
          {showResetButton && <button className={styles.nextButton} onClick={resetLevel}>Try again</button>}
        </div>
      ) : (
        <div>
        <div className={styles.timer}><p style={{color: "#ff0000"}}>{timer} seconds</p></div>
        {questions.length > 0 && currentQuestionIndex < questions.length &&(
          <div className={styles.questionContainer}>
            <h2 className={styles.question}>{questions[currentQuestionIndex].question}</h2>
            <form>
              {questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <label key={optionIndex} className={styles.optionLabel}>
                  <input
                    type="radio"
                    value={option}
                    checked={selectedOptions[currentQuestionIndex] === option}
                    onChange={(event) => handleOptionChange(event, currentQuestionIndex)}
                  />
                  {option}
                </label>
              ))}
            </form>
            <button
              className={styles.nextButton}
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Submit"}
            </button>
          </div>
        )}
      </div>
    )}
  </div>
);
};

export default Quiz;