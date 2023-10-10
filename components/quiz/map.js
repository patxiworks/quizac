import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { CircularProgress } from '@mui/material';
import { SingleMarker } from './maps/single';
import { MultipleMarker } from './maps/multiple';
import { RestrictedMarker } from './maps/restricted';
import styles from "./styles/map.module.css";
import commonStyles from "./styles/common.module.css";

const render = (status) => {
  if (status === Status.LOADING) return <div style={{textAlign:'center'}}><CircularProgress /></div>;
  if (status === Status.FAILURE) return <div>{status}!</div>;
  return null;
};

const MapGuess = ({ quizData: data, quizDataError: error, title }) => {
    const [start, setStart] = useState(false);
    const [gameSettings, setGameSettings] = useState(null);

    const writeDescription = (item) => {
        let desc = ''
        desc = `${item.name}: In this level you can score a maximum of ${item.points} points (${item.points} per question). You have ${item.duration} seconds to answer each question. `;
        desc += item.deduction ? `Beware, if you fail a question, ${item.deduction > 1 ? item.deduction+' points' : item.deduction+' point'} will be deducted from your score. ` : '';
        desc += `Good luck!`;
        return desc;
    }

    const mapMaster = (settings) => {
        setGameSettings(settings);
        setStart(true)
    }

    //Handle the quizDataError state
    if (error) return <div>Sorry, could not load the quiz</div>;
    //Handle the quizData loading state
    if (!data) return <div>Loading...</div>;

    return (
        <>
        {!start ? (
            <div className={commonStyles.quizContainer}>
              <div className={commonStyles.quizTitle}>Choose a level</div>
              <div className={commonStyles.quizLevelContainer}>
                {data.maps.levels.map((item, i) => (
                  <React.Fragment key={i}>
                    {/*<div className={commonStyles.scoreBadge}>Score: 0</div>*/}
                    <div
                        className={`${commonStyles.quizLevel} ${styles[item.name]}`}
                        onClick={() => mapMaster(item)}
                    >
                        <div className={commonStyles.levelName}><Image src={`/levels/trophy-${item.id}.png`} width="64" height="64" alt={`Level-${item.id}`} /></div>
                        <div className={commonStyles.levelDescription}>{writeDescription(item)}</div>
                      </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          ) : (
            <Wrapper apiKey="AIzaSyCfDcAwQpZwQFFftgsXsO5Kan9Xixsc7U0" render={render}>
                {
                gameSettings.type === 'single'
                ? <SingleMarker settings={gameSettings} title={title} />
                : gameSettings.type === 'multiple'
                    ? <MultipleMarker settings={gameSettings} title={title} />
                    : <RestrictedMarker settings={gameSettings} title={title} />
                }
            </Wrapper>
          )}
        </>
    )
}

export default MapGuess;
