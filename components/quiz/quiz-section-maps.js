import { useState, useEffect, useRef, useCallback } from "react";
import Link from 'next/link';
import { db, app } from '../../firebase';
import { doc, collection, getDoc } from 'firebase/firestore';
import { useRouter } from "next/router";
import { CircularProgress } from '@mui/material';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import Categories from "../dashboard/categories";
import CategoriesContent from "../dashboard/categories-content";
import PortalPopup from "../dashboard/portal-popup";
import QuizFrame from "./quiz-frame";
import QuizRender from "./quiz-render";
import { LongText } from "../utils";
import { getCategories, getCategory, getTitles } from "@/data/fetch";
//import styles from "./styles/quiz-section.module.css";*/

import SlideDrawer from "@/components/dashboard/drawer";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';

//import LogoArt from "../auth/logo-art";
import FormIntro from "../auth/form-intro";
import LoginForm from "../auth/login-form";
import ExternalLogin from "../auth/ext-login";
import styles from "./styles/quiz-section-maps.module.css";
import commonStyles from "./styles/common.module.css";
//import styles from "../../../index.module.css";


const MapSection = ({ category, title }) => {
  const [showForm, setShowForm] = useState(false);

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
  const [objTitle, setObjTitle] = useState([]);
  const [groupTitles, setGroupTitles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listTitles, setListTitles] = useState([]);
  const [nextTitle, setNextTitle] = useState('');
  const [prevTitle, setPrevTitle] = useState('');
  const mainContainer = "quiz";

  const buttonRef = useRef();
  
  useEffect(() => {
    if (category) {
      getCategories(setCategories); // get all categories
      getTitles(category, setTitles); // get titles
      getCategory(category, setQuizCategory); // set quizCategory
    }
  }, [category])

  useEffect(() => {
    getTitles(selectedItem, setListTitles); // listTitles are for display in drawer menu
  }, [selectedItem])

  useEffect(() => {
    if (titles.length) {
      setGroups([...new Set(titles.map(item => item.group))])
    }
  }, [titles, quizTitle?.group])

  useEffect(() => {
    setGroupTitles(getGroupTitles(titles, quizTitle?.group))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizTitle])

  useEffect(() => {
    const mTitle = titles.filter(t => t.id == title);
    const sTitles = titles.filter(item => item.group == mTitle[0]?.group);
    setObjTitle(mTitle[0]);
    //console.log(JSON.stringify(titles))
    // set nextTitle
    //setVisited(prev => [...prev, title]);
    const gTitles = sTitles.map(i => i.id);
    const current = gTitles.indexOf(title)
    const next = current+1 > gTitles.length-1 ? 0 : current+1;
    const prev = current-1 < 0 ? gTitles.length-1 : current-1;
    //let rem = sTitles?.filter(i => !visited.includes(i.id) && i.id !== title);
    //let rem = sTitles?.filter(i => i.id !== title);
    //if (!rem.length) { setVisited([]); rem = sTitles; }
    // get random item from titles array
    //const randTitle = rem[(Math.floor(Math.random() * rem.length))];
    //setNextTitle(randTitle?.id);
    setNextTitle(sTitles[next]?.id);
    setPrevTitle(sTitles[prev]?.id)

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

  const checkQuizStart = (e) => {
    setStartQuiz(e);
  }

  const openDrawer = (e) => {
    const value = e.target.value.split('_')
    setSelectedItem(value[0]);
    buttonRef.current.click();
    setPopupPage(value[1]);
  }

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

  const itemSelect = (items, item, type, popup) => {
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
          //autoFocus
          value={item}
          //open={open}
          //onOpen={()=>setOpen(true)}
          //onClose={()=>setOpen(false)}
          onChange={openDrawer}
          label=""
          inputProps={{
            name: 'dropdown',
            id: 'dropdown',
          }}
        >
          <MenuItem value={item}>{item}</MenuItem>
          
          {items.map((i,j) => {
            const val = type == 'category' ? i?.name : (type=='group' ? i : i)
            if (val !== item) {
              return (
                <MenuItem 
                  key={j} 
                  value={type=='group' ? `${i}_titles` : `${i?.id}_categories`}
                >
                  {type=='group' ? i : i?.name}
                </MenuItem>
              )
            }
          })}
        </Select>
    </>
    )
  }

  const resetTotalScore = () => {
    setTotalScore(0); // Reset the total score
    setStartQuiz(true); // Start the quiz again
  };

  const replaceNewLine = (string) => {
    //return string.replace(/\\n/g, "{\n}");
    return string
  }

  const LogoArt = ({ assetId }) => {
    return (
        <div className={styles.leftContent}>
          <div className={styles.logo}>Quizac</div>
          <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/asset/${assetId}`}></iframe>
          <div className={styles.imageFooter}></div>
        </div>
    )
}

  return (
    <div className={styles.login}>
      <div className={styles.mainContainer}>
        <div className={styles.leftContent}>
          <div className={styles.logo}>Quizac</div>
          <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/asset/hQFiKbLgmwYEpQ`}></iframe>
          <div className={styles.imageFooter}></div>
        </div>
        <div className={styles.mainContent}>
          {/*<div className={styles.homeContent}>
            <div className={styles.leftSide8Column}>
              <div className={styles.pageForm}>
                <div className={styles.mapPanel}></div>*/}
                <QuizRender category={category} title={objTitle} quizStarted={checkQuizStart} />
              {/*</div>
            </div>
          </div>*/}
          {/*<div className={styles.copyright}>© 2023 Some rights reserved</div>*/}
        </div>
      </div>
    </div>
  );
};

export default MapSection;