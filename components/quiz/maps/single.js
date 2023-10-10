import React, { useState, useEffect, useRef } from "react";
import MapMeter from "../components/mapmeter";
import { calculateDistance, calculateScore } from "./utils";
import CountdownTimer from "../components/timer";
import styles from "../styles/map.module.css";
import commonStyles from "../styles/common.module.css";

var accumulated_distance = 0;
var current_name = '';
var distance_from_guess = [];
var markers = [];
var guess_coordinates = [];
var check_count = 0;
var all_markers = [];
var new_marker = true;
var start_timer = false;

const SingleMarker = ({settings, title}) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [distanceValue, setDistanceValue] = useState(0);
    const [score, setScore] = useState(0);
    const [startTimer, setStartTimer] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [completed, setCompleted] = useState(false);
    const coordinates = [
        title.coordinates._lat,
        title.coordinates._long
    ]
    const location = settings.location;
    const duration = settings.duration;
    const ref = useRef();
    const result = useRef();

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

    function check(result_map){
        if (guess_coordinates.length) {
            distance_from_guess = [];
            var guess_error = (calculateDistance(guess_coordinates[0],guess_coordinates[1],coordinates[0], coordinates[1],'K'));
            accumulated_distance += parseFloat(guess_error);
            distance_from_guess = guess_error;

            var guess_coords = {lat: guess_coordinates[0], lng: guess_coordinates[1]};
        }
        var true_coords = {lat: coordinates[0], lng: coordinates[1]};

        var true_marker = new google.maps.Marker({
            position: true_coords, 
            map: result_map,
            title: 'True Location',
            icon: {
                url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
            }
        });
        var infoWindow = new google.maps.InfoWindow({
            content: current_name
        })

        true_marker.addListener('click', function(){
            infoWindow.open(result_map, true_marker);
        });

        if (guess_coordinates.length) {
            var flightPlanCoordinates = [
                true_coords, guess_coords,
            ];
            var lineSymbol = {
                path: "M17.402,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759 c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713 v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336 h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805z",
                strokeOpacity: 1,
                scale: 0.3,
                strokeWeight: 1,
                anchor: (1,0)
            };

            var flightPath = new google.maps.Polyline({
                path: flightPlanCoordinates,
                strokeOpacity: 1,
                icons: [{
                    icon: lineSymbol,
                    offset: '40%',
                    //repeat: '105px'
                }],
            });

            flightPath.setMap(result_map);
            animate(flightPath);
            display_location();
            //disableButton('check');
        }
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

    function display_location(){
        setDistanceValue(distance_from_guess ? distance_from_guess.toFixed(1) : 0);
        //setScore((1000 * Math.exp(-0.5 * (distanceValue/10)**2)).toFixed(2));
        setScore(calculateScore(settings, distance_from_guess));
    }

    const checking = () => {
        check(mapInstance);
        setCompleted(true);
        new_marker = false;
    }

    useEffect(() => {
        function placeMarker(location, map) {
            deleteMarkers();
            guess_coordinates = [];
            const marker = new google.maps.Marker({
                position: location,
                map: map,
            });
            markers.push(marker);
            all_markers.push(marker);
            guess_coordinates.push(marker.getPosition().lat(),marker.getPosition().lng());
        }
        
        const map = new window.google.maps.Map(ref.current, {
            center: { lat: location[0], lng: location[1] },
            zoom: settings.zoom,
            streetViewControl: false,
            mapTypeControl: false,
        });

        google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            setStartTimer(true);
        });

        window.google.maps.event.addListener(map, 'click', function(event) {
            if (new_marker) placeMarker(event.latLng, map);
            if (check_count == 0){
                check_count += 1;
            }
        });
        setMapInstance(map);
        
    }, []);

    function disableButton(id){
        document.getElementById(id).disabled = true;
    }

    return (
        <div className={`${styles.container} ${styles.single}`}>
            <MapMeter distance={distanceValue} type={'single'} />
            <div className={styles.timer}><CountdownTimer initialSeconds={duration} start={startTimer} onComplete={checking} stop={stopTimer} /></div>
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

export { SingleMarker }