import { useState, useEffect, useCallback } from "react";
import CategoryItem from "./category-item";
import PopupBox from "./popup-box";
import styles from "./styles/categories.module.css";
import commonStyles from "./styles/common.module.css";

import { getCategories } from "@/data/fetch";

const Categories = ({ onClose }) => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    getCategories(setCategories);
  },[])

  return (
    <PopupBox onClose={onClose}>
      {categories && categories.map((cat, i) => {
        return (
          <CategoryItem
            key={i}
            id={cat.id}
            image={cat.image ? cat.image : "/unsplashc-zhkgezy3u1@2x.png"}
            title={cat.name}
            description={cat.description}
            onClose={onClose}
          />
        )
      })}
    </PopupBox>
  );
};

export default Categories;
