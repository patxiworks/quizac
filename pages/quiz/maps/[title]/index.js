import { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import Image from 'next/image'
import Link from "next/link";
//import app from "@/firebase";
//import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useSWR from 'swr';

import MapGuess from "./maps/map";
import { getCategories, getCategory, getTitles } from "@/data/fetch";
import styles from "./styles/layout.module.css";
import mapbg from './images/map-bg.png'


const fetcher = (url) => fetch(url).then((res) => res.json());
const rawTitles = [{
  "id":"oAHFI58N8r97Cg",
  "group":"Aerial shots",
  "coordinates":{"latitude":6.473583,"longitude":3.370667},
  "description":"The Lagos State Development and Property Corporation (LSDPC) Housing Estate is one of the low-cost apartment buildings set up by the government for its workers in the 1990s to sustain and ease accommodation issues for them. It is located on Lagos Mainland, close to the Third Mainland Bridge, one of several roads that connect the Mainland to the Island. The orderly grid that characterises the Estate in contrast to the neighbouring buildings suggests that it was well-planned.",
  "quiz":"map",
  "thumbnail":"https://lh3.googleusercontent.com/ci/AA1T9HJn4SBuX5jNibLjnyDMGGZuLCDWWaVDOZNs_8Zy8PHUr6Rprk8aeO8OXNY1Ra0ksi37z3ncFQw=s70-ci",
  "image":"https://lh3.googleusercontent.com/KmfEy3lkQYBGTDVt8N2xbGI2CwjOqOVXYGoQhH6CjlptcJtuE8TwC0uJo4MVoPN8lA=s384",
  "title":"LSDPC Housing Estate"
}]

const QuizDashboard = () => {
  const [quizCategory, setQuizCategory] = useState('');
  const [quizCategoryNames, setQuizCategoryNames] = useState([]);
  const [quizTitle, setQuizTitle] = useState('');

  const [categories, setCategories] = useState([]);
  const [titles, setTitles] = useState(rawTitles);
  const [groupTitles, setGroupTitles] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [listTitles, setListTitles] = useState([]);
  const [nextTitle, setNextTitle] = useState('');
  const [prevTitle, setPrevTitle] = useState('');

  const [startQuiz, setStartQuiz] = useState(false);
  const { data, error } = useSWR('/api/quizdata', fetcher);
  const [objTitle, setObjTitle] = useState([]);
  const [user, setUser] = useState(null);
  //const auth = getAuth(app);
  const router = useRouter();
  const ref = useRef(null);
  const { category, title } = router.query;
  const [frameArrowActive, setFrameArrowActive] = useState(false);
  const [mapArrowActive, setMapArrowActive] = useState(false);
  
  const toggleFrame = () => {
    setFrameArrowActive(!frameArrowActive);
  };
  const toggleMap = () => {
    setMapArrowActive(!mapArrowActive);
  };
  if (frameArrowActive) {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  } 

  const hideMap = frameArrowActive ? styles.hideMap : '';
  const hideFrame = mapArrowActive ? styles.hideFrame : '';
  const showMeter = mapArrowActive ? styles.showMeter : '';
  const frameArrow = frameArrowActive ? styles.frameFilled : styles.frameNormal;
  const mapArrow = mapArrowActive ? styles.mapFilled : styles.mapNormal;
  const frameStyle = frameArrowActive ? styles.transformFrame : '';
  const boxStyle = frameArrowActive ? styles.transformBox : '';

  /*useEffect(() => {
    onAuthStateChanged(auth, (userInfo) => {
      if (userInfo) {
        setUser(userInfo)
      } else {
        router.push('/login');
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);*/

  useEffect(() => {
    setStartQuiz(false);
  }, [title?.id]);

  const quizStart = () => {
    setStartQuiz(true);
  }

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
  }, [quizTitle])

  useEffect(() => {
    const mTitle = titles.filter(t => t.id == title);
    const sTitles = titles.filter(item => item.group == mTitle[0]?.group);
    setObjTitle(mTitle[0]);
    console.log(mTitle[0])
    // set nextTitle
    const gTitles = sTitles.map(i => i.id);
    const current = gTitles.indexOf(title)
    const next = current+1 > gTitles.length-1 ? 0 : current+1;
    const prev = current-1 < 0 ? gTitles.length-1 : current-1;
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

  return (
    <>
    <div id="quiz" className={styles.quiz}>
      <div className={styles.topContainer}>
        {/*<TopBar content="fsds" />*/}
        <div className={styles.login}>
          <div className={styles.mainContainer}>
            <div className={`${styles.leftContent} ${hideFrame}`}>
              <div className={styles.logo}>
                <div className={styles.logoBox}>#GidiMaps</div>
              </div>
              <iframe className={styles.gacFrame} src={`https://embed.culturalspot.org/embedv2/asset/${title}`}></iframe>
              <div className={styles.imageFooter}></div>
              <div className={`${styles.gacFrameHandle} ${boxStyle}`}>
                <div className={styles.arrowBox} onClick={toggleFrame}><i className={`${styles.arrow} ${frameArrow}`}></i></div>
              </div>
            </div>
            <div className={`${styles.mainContent} ${hideMap} ${showMeter}`}>
              <MapGuess quizData={data} quizDataError={error} category={category} title={objTitle} />
              <div className={`${styles.mapHandle} ${boxStyle}`}>
                <div className={styles.arrowBox} onClick={toggleMap}><i className={`${styles.arrow} ${mapArrow}`}></i></div>
              </div>
            </div>
          </div>
        </div>
        {/*<div className={styles.gameInfo}></div>*/}
      </div>
    </div>
    {/*<div className={styles.footer}>
      <div className={styles.copyright}>© 2023 Some rights reserved</div>
    </div>*/}
  </>
  );
};

export default QuizDashboard;
