import { useState, useEffect, useCallback } from "react";
import Quiz from "./main/quiz";
import MapGuess from "./map";

const QuizRender = ({category, title, quizStarted}) => {
    const [startQuiz, setStartQuiz] = useState(false);
    let quiz = '';
    
    useEffect(() => {
        setStartQuiz(false);
        quizStarted(false);
    }, [title.id]);

    const checkType = () => {
        if (title?.coordinates) {
            return 'map';
        } else {
            return 'mcq';
        }
    }

    const quizStart = () => {
        setStartQuiz(true);
        quizStarted(true);
    }

    switch (checkType()) {
        case 'mcq':
            quiz = <Quiz category={category} title={title.id} />;
            break;
        case 'map':
            quiz = <MapGuess category={category} title={title.id} />;
            break;
        default:
            quiz = <Quiz category={category} title={title.id} />;
    }

    return (
        <>
        { startQuiz
        ? quiz
        : <button onClick={quizStart}>Start the quiz</button>
        }
        </>
    )
}

export default QuizRender;