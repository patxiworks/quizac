import Progress from "../components/progress";
import CountdownTimer from "../components/timer";
import styles from "../styles/quiz.module.css";

export default function QuizDisplay({ timer, score, currentQuestion, questions, handleOptionClick }) {

    return (
        <>
            <div className={styles.timer}></div>
            <div className={styles.quizQuestionContainer}>
                <div className={styles.infoPanel}>
                    {/*<p className={styles.quizQuestionCounter} style={timer<6 ? { color: "#ff0000" } : {}}>
                        {timer} seconds
                    </p>*/}
                    <div className={styles.quizQuestionCounter}>
                        <CountdownTimer initialSeconds={timer.initial} start={timer.start} reset={timer.reset} stop={timer.stop} onComplete={handleOptionClick} />
                    </div>
                    <div className={styles.quizScore}>Score: {score}</div>
                </div>
                <Progress
                    numCurrentQuestion={currentQuestion + 1}
                    numTotalQuestions={questions.length}
                />
                <h2 className={styles.quizQuestion}>
                    {questions[currentQuestion].question}
                </h2>
                <ul className={styles.quizOptions}>
                    {questions[currentQuestion].options.map((option) => (
                    <li
                        key={option}
                        className={styles.quizOption}
                        onClick={() => handleOptionClick(option)}
                    >
                        {option}
                    </li>
                    ))}
                </ul>
            </div>
        </>
    )
}