import React, { useState, useEffect, useRef } from "react";
import MapMeter from "../components/mapmeter";
import { calculateDistance, calculateScore } from "./utils";
import CountdownTimer from "../components/timer";
import styles from "../styles/map.module.css";

//var accumulated_distance = 0;
var current_name = '';
//var distance_from_guess = 0;
//var markers = [];
var guess_coordinates = [];
var curr_coordinates = [];
var check_count = 0;
//var guess_distances = []; // list of distances
var userStats = {'last_dist_cov': [], 'dist_to_dest': []};

const MultipleMarker = ({settings, title, timerStart, showAlert, getScore, getTime}) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [distanceValue, setDistanceValue] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);
    const [guessDistances, setGuessDistances] = useState([]);
    const [lastMile, setLastMile] = useState(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [startTimer, setStartTimer] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [count, setCount] = useState(-1);
    /*const coordinates = [
        title.coordinates._lat,
        title.coordinates._long
    ]*/
    const coordinates = [
        title.coordinates.latitude,
        title.coordinates.longitude
    ]
    const location = settings.location;
    const duration = settings.duration;
    const ref = useRef();

    var markers = [];
    var guess_distances = []; // list of distances
    var accumulated_distance = 0;
    var distance_from_guess = 0;
    //var check_count = 0;

    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    function clearMarkers() {
        setMapOnAll(null);
    }

    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
        }
    }

    function finish(map) {
        var true_coords = {lat: coordinates[0], lng: coordinates[1]};
        var true_marker = new google.maps.Marker({
            position: true_coords, 
            map: map,
            title: 'True Location',
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }
        });
        var infoWindow = new google.maps.InfoWindow({
            content: current_name
        })
        true_marker.addListener('click', function(){
            infoWindow.open(map, true_marker);
        });

        if (curr_coordinates.length) {
            var curr_coords = { lat: curr_coordinates[0], lng: curr_coordinates[1]};
            var last_guess_error = (calculateDistance(curr_coordinates[0],curr_coordinates[1],coordinates[0],coordinates[1],'K'));
            setLastMile(last_guess_error.toFixed(1));
            addDistanceLine(map, true_coords, curr_coords, true);
        }
        check_count = -1;
    }

    function getDistanceFromLocation(guess) {
        return calculateDistance(...guess, ...coordinates, 'K')
    }

    function check(map) {
        distance_from_guess = 0;
        var prevA = guess_coordinates[guess_coordinates.length-2][0];
        var prevB = guess_coordinates[guess_coordinates.length-2][1];
        var currA = guess_coordinates[guess_coordinates.length-1][0];
        var currB = guess_coordinates[guess_coordinates.length-1][1]
        var guess_error = (calculateDistance(prevA,prevB,currA,currB,'K'));
        accumulated_distance += parseFloat(guess_error);
        distance_from_guess = guess_error;

        var prev_coords = {lat: prevA,  lng: prevB};
        var guess_coords = {lat: currA, lng: currB};

        addDistanceLine(map, prev_coords, guess_coords);
        //setAttempts(prev => prev+1);
    }

    function addDistanceLine(map, coordsA, coordsB, final=false) {
        var flightPlanCoordinates = [
            coordsA, coordsB,
        ];

        var lineSymbol = {
            path: "M17.402,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759 c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713 v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336 h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
            strokeOpacity: 1,
            scale: 0.3,
            strokeWeight: 1,
            strokeColor: "#000",
            anchor: (1,0)
        };

        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeOpacity: 1,
            icons: [{
                icon: "",
                offset: '40%'
            }],
        });

        var finalPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeOpacity: 1,
            strokeColor: "#ff0000",
            icons: [{
                icon: lineSymbol,
                offset: '40%',
                //repeat: '105px'
            }],
        });

        if (!final) {
            flightPath.setMap(map);
        } else {
            finalPath.setMap(map);
        }
        animate(flightPath);
        getDistances();
    }

    function animate(line) {
        let count = 0;
        window.setInterval(() => {
          count = (count + 1) % 200;
          const icons = line.get("icons");
          icons[0].offset = count / 2 + "%";
          line.set("icons", icons);
        }, 20);
    }

    function getDistances(){
        const dfg = parseFloat(distance_from_guess.toFixed(2));
        setDistanceValue(distance_from_guess ? dfg : 0);
        setTotalDistance(accumulated_distance.toFixed(2));
        userStats['last_dist_cov'].push(dfg);
        userStats['dist_to_dest'] = guess_distances;
    }

    const finishing = () => {
        finish(mapInstance);
        setCompleted(true);
        showAlert();
        const final_score = parseFloat(calculateTotalScore(guessDistances).toFixed(2));
        //console.log(guessDistances)
        setScore(final_score);
        getScore(final_score, userStats); // lifted to parent component
    }

    const calculateTotalScore = (scores) => {
        const allscores = scores.map(score => {
            const val = parseFloat(calculateScore(settings, score));
            return val<0 ? 0 : val;
        });
        return allscores.reduce((a, b) => a + b, 0) / allscores.length;
    }

    useEffect(() => {
        check_count = 0;
    }, [])

    useEffect(() => {
        function placeMarker(location, map) {
            console.log(check_count)
            curr_coordinates = [];
            const marker = new google.maps.Marker({
                position: location, 
                map: map,
            });
            markers.push(marker);
            const pos = [marker.getPosition().lat(),marker.getPosition().lng()]
            guess_coordinates.push(pos);
            curr_coordinates.push(...pos);
            guess_distances.push(calculateDistance(...pos, ...coordinates, 'K'));
            if (markers.length > 1) {
                check(map);
                setLastMile(guess_distances[guess_distances.length-1].toFixed(1));
            }
            setAttempts(guess_distances.length);
            setGuessDistances(guess_distances);
            setResetTimer(prev => !prev);
        }
        
        const map = new window.google.maps.Map(ref.current, {
            center: { lat: location[0], lng: location[1] },
            zoom: settings.zoom,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false
        });

        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //setStartTimer(true);
        });
        
        window.google.maps.event.addListener(map, 'click', function(event) {
            if (check_count >= 0) placeMarker(event.latLng, map);
            if (check_count == 0) {
                //setCount((prevCount) => prevCount+1);
                check_count += 1;
            }
        });

        setMapInstance(map)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerStart]);

    useEffect(()=> {
        setStartTimer(timerStart);
    }, [timerStart])

    return (
        <div className={styles.container}>
            <MapMeter distance={distanceValue} lastMile={lastMile} totalDistance={totalDistance} attempts={attempts} type='multiple' />
            <div className={styles.timer}>
                <CountdownTimer initialSeconds={duration} start={startTimer} onComplete={finishing} reset={resetTimer} stop={stopTimer} getTime={getTime} />
            </div>
            <div className={styles.mapContainer}>
                <div ref={ref} className={styles.map} />
            </div>
            <div id='buttons' className={styles.guessButtonContainer}>
                <button 
                    type="button" 
                    className={completed ? `${styles.guessButton} ${styles.scoreBox}`: `${styles.guessButton}`} 
                    onClick={()=> setStopTimer(prev=>!prev)}
                    id="check" 
                    disabled={completed ? true : false}
                >
                    {completed ? `Your score: ${score}` : "Find in map"}
                </button>
            </div>
        </div>
    );
}

export { MultipleMarker }