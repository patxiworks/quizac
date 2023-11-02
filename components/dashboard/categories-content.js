import { useState, useEffect, useCallback } from "react";
import QuizItem from "./quiz-item";
import PopupBox from "./popup-box";
import { LongText, filterText } from "../utils";
import styles from "./styles/categories-content.module.css";

import { getTitles } from "@/data/fetch";

const CategoriesContent = ({ category, titles, popupTitle }) => {
  const [filtered, setFiltered] = useState([]);

  const filterList = (item) => {
    filterText(titles, item, 'title', setFiltered);
  }

  useEffect(() => {
    console.log(titles)
    setFiltered(titles)
  },[])

  return (
    <PopupBox popupTitle={popupTitle} getFilter={filterList}>
      {filtered && filtered.map((quiz, i) => {
        return (
          <QuizItem
            key={i}
            image={quiz.image ? quiz.image : "/art1@2x.png"}
            title={quiz.title}
            description={<LongText content={quiz.description} limit={20} hideReadMore={true} />}
            url={`/quiz/${category}/${quiz.id}`}
          />
        )
      })}
    </PopupBox>
  );
};

export default CategoriesContent;
