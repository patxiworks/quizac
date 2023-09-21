import { useState, useEffect, useCallback } from "react";
import QuizItem from "./quiz-item";
import PopupBox from "./popup-box";
import { LongText } from "../utils";
import styles from "./styles/categories-content.module.css";

import { getTitles } from "@/data/fetch";

const CategoriesContent = ({ category, groupTitles, onClose, popupTitle }) => {
  const [titles, setTitles] = useState(null);

  useEffect(() => {
    if (!groupTitles?.length) {
      if (category) getTitles(category, setTitles);
    } else {
      setTitles(groupTitles);
    }
  }, [category])

  return (
    <PopupBox onClose={onClose} popupTitle={popupTitle}>
      {titles && titles.map((quiz, i) => {
        return (
          <QuizItem
            key={i}
            image={quiz.image ? quiz.image : "/art1@2x.png"}
            title={quiz.title}
            description={<LongText content={quiz.description} limit={20} hideReadMore={true} />}
            url={`/quiz/${category}/${quiz.id}`}
            onClose={onClose}
          />
        )
      })}
    </PopupBox>
  );
};

export default CategoriesContent;
