import { useState, useCallback } from "react";
import CategoryItem from "./category-item";
import styles from "./styles/categories.module.css";
import commonStyles from "./styles/common.module.css";
const Categories = ({ onClose }) => {
  return (
    <div className={styles.categories}>
      <div className={styles.mainContainer}>
        <div className={commonStyles.header}>
          <div className={commonStyles.backLink} onClick={onClose}>&lt; Back</div>
          <div className={commonStyles.contentTitle}>Choose a category</div>
        </div>
        <div className={styles.mainContent}>
          <CategoryItem
            image="/unsplashc-zhkgezy3u1@2x.png"
            title="Nigerian Cuisine"
            description="The amazing Tuscany is home to famous Renaissance art and architecture and a vast scenic landscape."
          />
          <CategoryItem
            image="/login-art3@2x.png"
            title="Nigerian Art"
            description="The amazing Tuscany is home to famous Renaissance art and architecture and a vast scenic landscape."
          />
          <CategoryItem
            image="/art2@2x.png"
            title="Nollywood"
            description="The amazing Tuscany is home to famous Renaissance art and architecture and a vast scenic landscape."
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
