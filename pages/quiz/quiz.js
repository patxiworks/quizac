import { useState, useEffect } from 'react';
import {db} from '../../firebase'
import {collection, getDocs,addDoc } from 'firebase/firestore';

const Quiz = ({ }) => {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60);
  const [isQuizEnded, setIsQuizEnded] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const dataCollection = collection(db, 'quizz');
      try {
        const querySnapshot = await getDocs(dataCollection);
        const fetchedQuestions = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            question: data.questions,
            options: data.options,
            answer: data.answer,
          };
        });
        setQuestions(fetchedQuestions);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      if (timer > 0 && !isQuizEnded) {
        setTimer(timer - 1);
      } else {
        clearInterval(countdown);
        endQuiz();
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

  const endQuiz = async () => {
    setIsQuizEnded(true);

    if (!quizSubmitted) {
      let score = 0;
      for (let i = 0; i < questions.length; i++) {
        if (selectedOptions[i] === questions[i].answer) {
          score++;
        }
      }
      setScore(score);
      setQuizSubmitted(true);

      const docRef = await addDoc(collection(db, "quizresult"), {
        score: score,
      });
      const newCol = collection(db, "quizresult",docRef.id, "scores");
    }
  }
  return (
    <div>
      <h1>Quiz Game</h1>
      <p>Time Remaining: {timer} seconds</p>
      {isQuizEnded ? (
        <div>
          <p>Quiz Ended</p>
          <p>Time Spent: {60 - timer} seconds</p>
          <p>Final Score: {score}</p>         
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
export default Quiz;