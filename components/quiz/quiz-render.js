import { useState, useEffect, useCallback } from "react";
import useSWR from 'swr';
import Quiz from "./mcq/quiz";
import MapGuess from "./maps/map";
import SlidePuzzle from "./puzzles/slide";
import styles from "./styles/common.module.css";

const fetcher = (url) => fetch(url).then((res) => res.json());

const QuizRender = ({category, title, quizStarted}) => {
    const [startQuiz, setStartQuiz] = useState(false);
    const { data, error } = useSWR('/api/quizdata', fetcher);
    let quiz = '';
    
    useEffect(() => {
        setStartQuiz(false);
        quizStarted(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [title?.id]);

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

    switch (title?.quiz) {
        case 'mcq':
            quiz = <Quiz quizData={data} quizDataError={error} category={category} title={title.id} />;
            break;
        case 'map':
            quiz = <MapGuess quizData={data} quizDataError={error} category={category} title={title} />;
            break;
        case 'puzzle':
            quiz = <SlidePuzzle quizData={data} quizDataError={error} category={category} title={title} />;
            break;
        default:
            quiz = <Quiz quizData={data} quizDataError={error} category={category} title={title?.id} />;
    }

    return (
        <>
        { startQuiz
        ? quiz
        : <div className={styles.quizStartButtonContainer}><button className={styles.quizStartButton} onClick={quizStart}>Start the quiz</button></div>
        }
        </>
    )
}

export default QuizRender;