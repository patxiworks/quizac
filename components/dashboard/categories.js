import { useState, useCallback } from "react";
import CategoryItem from "./category-item";
import styles from "./styles/categories.module.css";
import commonStyles from "./styles/common.module.css";

const Categories = ({ categories, onClose }) => {
  return (
    <div className={styles.categories}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <div className={commonStyles.contentTitle}>Choose a category</div>
        </div>
        <div className={styles.mainContent}>
          {categories.map(cat => {
            return <CategoryItem
              id={cat.id}
              image={cat.image ? cat.image : "/unsplashc-zhkgezy3u1@2x.png"}
              title={cat.name}
              description={cat.description}
            />
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
