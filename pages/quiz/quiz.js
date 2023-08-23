import { useState, useEffect } from 'react';
import { db, app } from '../../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'

const auth = getAuth(app);

const Quiz = ({}) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showResetButton, setShowResetButton] = useState(false);
  const [levels, setLevels] = useState([]); 

  useEffect(() => {
    async function fetchLevels() {
      const levelsCollection = collection(db, 'levels');
      const querySnapshot = await getDocs(levelsCollection);
      const levelData = querySnapshot.docs.map((doc) => doc.data());
      setLevels(levelData);
    }
    fetchLevels();
  }, []);

  useEffect(() => {
    if (currentLevel <= levels.length) {
      setTimer(levels[currentLevel - 1]?.timeLimit || 60);
    }
  }, [currentLevel, levels]);

  useEffect(() => {
    async function fetchDataForLevel(levelNumber) {
      const questionsCollection = collection(
        db,
        `quizzQuestions/level${levelNumber}/questions`
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
  }, [currentLevel]);

  useEffect(() => {
    if (!isQuizEnded) {
      const countdown = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          clearInterval(countdown);
          setIsQuizEnded(true);
          endQuiz()
        }
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [timer, isQuizEnded]);
  

  const handleOptionChange = (event, questionIndex) => {
    if (!isQuizEnded) {
      const newSelectedOptions = [...selectedOptions];
      newSelectedOptions[questionIndex] = event.target.value;
      setSelectedOptions(newSelectedOptions);
    }
  };

  const moveToNextLevel = () => {
    const nextLevel = currentLevel + 1;
    if (nextLevel <= levels.length) {
      if (score >= levels[nextLevel - 1].minScoreToUnlock) {
        setCurrentLevel(nextLevel);
        setSelectedOptions([]);
        setIsQuizEnded(false);
        setTimer(levels[nextLevel - 1].timeLimit); 
        setScore(0);
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
    const timeLimitForCurrentLevel = levels[currentLevel - 1]?.timeLimit || 60;
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
      setQuizSubmitted(true);
      if (score < levels[currentLevel - 1].minScoreToUnlock) {
        setShowResetButton(true);
      }
    }
  };
  return (
    <div>
      <h1>Quiz Game</h1>
      <p>Time Remaining: {timer} seconds</p>
      {isQuizEnded ? (
        <div>
          <p>Quiz Ended</p>
          <p>Time Spent: {levels[currentLevel - 1].timeLimit - timer} seconds</p>
          <p>Your Level: {currentLevel}</p>
          <p>Score: {score}</p>
          <button onClick={moveToNextLevel}>Next Level</button>
          {showResetButton && <button onClick={resetLevel}>Reset Level</button>}
        </div>
      ) : (
        <div>
          {!isQuizEnded && questions.length > 0 && (
            <div>
              {questions.map((question, index) => (
                <div key={index}>
                  <h2>{question.question}</h2>
                  <form>
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex}>
                        <input
                          type="radio"
                          value={option}
                          checked={selectedOptions[index] === option}
                          onChange={(event) => handleOptionChange(event, index)}
                        />
                        {option}
                      </label>
                    ))}
                  </form>
                </div>
              ))}
            </div>
          )}
          <button onClick={endQuiz}>Submit</button>
        </div>
      )}
    </div>
  );
};

export default Quiz;git 