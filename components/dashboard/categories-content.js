import { useState, useEffect, useCallback } from "react";
import QuizItem from "./quiz-item";
import PopupBox from "./popup-box";
import styles from "./styles/categories-content.module.css";

import { getTitles } from "@/data/fetch";

const CategoriesContent = ({ category, onClose }) => {
  const [titles, setTitles] = useState(null);

  useEffect(() => {
    console.log(category)
    if (category) getTitles(category, setTitles);
  },[category])

  return (
    <PopupBox onClose={onClose}>
      {titles && titles.map((quiz, i) => {
        return (
          <QuizItem
            key={i}
            image={quiz.image ? quiz.image : "/art1@2x.png"}
            title={quiz.title}
            description={quiz.description}
            url={`/quiz/${category}/${quiz.id}`}
            onClose={onClose}
          />
        )
      })}
    </PopupBox>
  );
};

export default CategoriesContent;
