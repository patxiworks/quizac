import { useState, useEffect, useCallback } from "react";
import Link from 'next/link';
import { db, app } from '../../firebase';
import { doc, collection, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { CircularProgress, bottomNavigationActionClasses } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Categories from "../dashboard/categories";
import CategoriesContent from "../dashboard/categories-content";
import PortalPopup from "../dashboard/portal-popup";
import QuizFrame from "./quiz-frame";
//import Quiz from "./quiz";
import Quiz from "./main/quiz";
import { LongText } from "../utils";
import { getCategories, getCategory, getTitles } from "@/data/fetch";
import styles from "./styles/quiz-section.module.css";

import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

const QuizSection = ({ category, title }) => {
  const [startQuiz, setStartQuiz] = useState(false);
  const [quizCategory, setQuizCategory] = useState('');
  const [quizCategoryNames, setQuizCategoryNames] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0); 
  const [isCategoriesPopupOpen, setCategoriesPopupOpen] = useState(false);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [popupPage, setPopupPage] = useState(null);

  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState([]);
  const [groupTitles, setGroupTitles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visited, setVisited] = useState([]);
  const [nextTitle, setNextTitle] = useState('');
  const [prevTitle, setPrevTitle] = useState('');
  const mainContainer = "quiz";

  useEffect(() => {
    if (category) {
      getCategories(setCategories); // get all categories
      getTitles(category, setTitles); // get titles
      getCategory(category, setQuizCategory); // set quizCategory
    }
  }, [category])

  useEffect(() => {
    if (titles.length) {
      setGroups([...new Set(titles.map(item => item.group))])
    }
  }, [titles, quizTitle?.group])

  useEffect(() => {
    setGroupTitles(getGroupTitles(titles, quizTitle?.group))
  }, [quizTitle])

  useEffect(() => {
    const mTitle = titles.filter(t => t.id == title);
    const sTitles = titles.filter(item => item.group == mTitle[0].group);
    // set nextTitle
    setVisited(prev => [...prev, title]);
    let rem = sTitles?.filter(i => !visited.includes(i.id) && i.id !== title);
    if (!rem.length) { setVisited([]); rem = sTitles; }
    // get random item from titles array
    const randTitle = rem[(Math.floor(Math.random() * rem.length))];
    setNextTitle(randTitle?.id);

    // set quizTitle
    const arrQuizTitle = titles?.filter(t => t.id === title);
    setQuizTitle(arrQuizTitle && arrQuizTitle.length ? arrQuizTitle[0] : null);

    // set array of quizCategory names
    setQuizCategoryNames(categories.map(cat => cat.name))
  },[title, titles, categories])

  const getGroupTitles = (items, group) => {
    return items.filter(t => t.group == group)
  }
  
  const popupCategories = (event) => {
    openPopup();
    setSelectedItem(event.target.value);
    setPopupPage('categories');
  }

  const popupTitles = (event) => {
    openPopup();
    setSelectedItem(event.target.value);
    setPopupPage('titles');
  }

  const openPopup = useCallback(() => {
    setPopupOpen(true);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "fixed";
  }, []);

  const closePopup = useCallback(() => {
    setPopupOpen(false);
    const mainDiv = document.getElementById(mainContainer);
    mainDiv.style.position = "relative";
  }, []);

  const gac = (pos) => {
    return (
      quizTitle
      ? quizTitle === 'error'
        ? <div className={styles[pos]}><div className={styles.noAsset}>No asset found in the collection</div></div>
        : 
        <>
          <QuizFrame style={pos} type="asset" id={quizTitle.id+'?nzh'} fullscreen={true} />
        </>
      : <div className={styles[pos]}><CircularProgress /></div>
    )
  }

  const itemSelect = (items, item, popup) => {
    return (
      <>
        <Select
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            "&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
              },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: 0,
              },
              "&.MuiOutlinedInput-root .MuiSelect-select.MuiSelect-outlined":
              {
                padding: 0,
                paddingRight: '32px',
                fontWeight: 'bold',
              }
          }}
          autoFocus
          value={item}
          onChange={popup}
          label=""
          inputProps={{
            name: 'dropdown',
            id: 'dropdown',
          }}
        >
          <MenuItem value={item}>{item}</MenuItem>
          {items.map((i,j) => {
            if (i !== item) return <MenuItem key={j} value={i}>{i}</MenuItem>
          })}
        </Select>
    </>
    )
  }

  const resetTotalScore = () => {
    setTotalScore(0); // Reset the total score
    setStartQuiz(true); // Start the quiz again
  };

  return (
    <>
      { quizCategory && quizTitle ?
      <div className={styles.mainSection}>
        <div className={styles.leftSection}>
          { gac('sideGacBox') }
        </div>
        <div className={styles.mainContent}>
          <div className={styles.topSection}>
            { gac('topGacBox') }
          </div>
          <div className={styles.pageNav}>
              <div className={styles.categoryName}>
                {itemSelect(quizCategoryNames, quizCategory.name, popupCategories)}
                {itemSelect(groups, quizTitle.group, popupTitles)}
              </div>
              <div className={styles.totalScore}>Total score: {totalScore}</div>
          </div>
          <div className={styles.homeContent}>
            { quizCategory !== 'error' && quizTitle !== 'error' ?
              <>
              <div className={styles.contentTitle}>
                <div className={styles.titleColumn}>
                  <div>{quizTitle.title}</div>
                </div>
                <Link href={`/quiz/${category}/${nextTitle}`}><ArrowCircleRightIcon fontSize="small" color="primary" className={styles.navIcon} /></Link>
              </div>
              <div className={styles.contentBox}>
                <div className={styles.contentMessage}>
                {
                !startQuiz ?
                  <div className={styles.contentText}>
                    <div className={styles.contentDescription}><LongText content={quizTitle.description} limit={50} /></div>
                    <button className={styles.startButton} onClick={()=>setStartQuiz(true)}>Start the quiz</button>
                  </div>
                  :
                  <Quiz
                    category={category}
                    title={title}
                    getScore={(score) => setTotalScore(totalScore + score)} 
                    onTryAgain={resetTotalScore}
                  />            
                  }
                  <button
                    className={styles.startQuiz}
                    onClick={openPopup}
                  >
                  </button>
                </div>
              </div>
              </>
            : 
            <>
              <div className={styles.contentTitle}>
                <div>Looks like you missed your way...</div>
              </div>
              <div className={styles.notFoundMessage}>No Quiz Found!</div>
            </>
            }
          </div>
        </div>
      </div>
      :
      <div className={styles.emptySection}><CircularProgress /></div>
      }
      {isPopupOpen && (
        <PortalPopup
          overlayColor="rgba(0, 0, 0, 0.9)"
          placement="Top left"
          onOutsideClick={false}
        >
          {
          popupPage === 'titles'
          ?  <CategoriesContent category={category} groupTitles={getGroupTitles(titles, selectedItem)} onClose={closePopup} popupTitle={`Choose from '${selectedItem}'`} />
          :  <Categories onClose={closePopup} popupTitle={'Choose a category'} />
          }
        </PortalPopup>
      )}
    </>
  );
};

export default QuizSection;