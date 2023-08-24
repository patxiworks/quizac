import QuizItem from "./quiz-item";
import styles from "./styles/categories-content.module.css";

const CategoriesContent = ({ catid, quizzes }) => {
  return (
    <div className={styles.mainContent}>
      {quizzes && quizzes.map((quiz, i) => {
        return (
          <QuizItem
            key={i}
            image={quiz.image ? quiz.image : "/art1@2x.png"}
            title={quiz.name}
            description={quiz.description}
            url={`/quiz/${catid}/${quiz.id}`}
          />
        )
      })}
    </div>
  );
};

export default CategoriesContent;
