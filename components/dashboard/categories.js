import { useState, useEffect, useCallback } from "react";
import CategoryItem from "./category-item";
import PopupBox from "./popup-box";
import styles from "./styles/categories.module.css";
import commonStyles from "./styles/common.module.css";

import { filterText } from "../utils";

const Categories = ({ categories }) => {
  const [filtered, setFiltered] = useState([]);

  const filterList = (item) => {
    filterText(categories, item, 'name', setFiltered);
  }

  useEffect(() => {
    setFiltered(categories)
  },[])

  return (
    <PopupBox popupTitle="Choose a category" items={categories} getFilter={filterList}>
      {filtered && filtered.map((cat, i) => {
        return (
          <CategoryItem
            key={i}
            id={cat.id}
            image={cat.image ? cat.image : "/unsplashc-zhkgezy3u1@2x.png"}
            title={cat.name}
            description={cat.description}
          />
        )
      })}
    </PopupBox>
  );
};

export default Categories;
