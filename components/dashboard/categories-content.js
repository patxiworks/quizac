import QuizItem from "./quiz-item";
import styles from "./styles/categories-content.module.css";
const CategoriesContent = ({ type }) => {
  return (
    <div className={styles.mainContent}>
      <QuizItem
        image="/art1@2x.png"
        title="Zermatt, Switzerland"
        description="Marvel on the beauty of the iconic Matterhorn. Find the best places to stay that has the best views of this peak..."
      />
      <QuizItem
        image="/login-art1@2x.png"
        title="Zermatt, Switzerland"
        description="Marvel on the beauty of the iconic Matterhorn. Find the best places to stay that has the best views of this peak..."
      />
      <QuizItem
        image="/art1@2x.png"
        title="Zermatt, Switzerland"
        description="Marvel on the beauty of the iconic Matterhorn. Find the best places to stay that has the best views of this peak..."
      />
      <QuizItem
        image="/login-art1@2x.png"
        title="Zermatt, Switzerland"
        description="Marvel on the beauty of the iconic Matterhorn. Find the best places to stay that has the best views of this peak..."
      />
    </div>
  );
};

export default CategoriesContent;
