import React, { useState, useEffect, useRef } from "react";
import MapMeter from "../components/mapmeter";
import { calculateDistance, calculateDestinationCoordinates, calculateScore } from "./utils";
import CountdownTimer from "../components/timer";
import styles from "../styles/map.module.css";
import commonStyles from "../styles/common.module.css";

var accumulated_distance = 0;
var current_name = '';
var distance_from_guess = 0;
var startMarker = [];
var markers = [];
var guess_coordinates = [];
var curr_coordinates = [];
var check_count = 0;
var startmap = false;
var bearing = (Math.random()*(360-0)+0);
var userStats = {'last_dist_cov': [], 'dist_to_dest': []};

const RestrictedMarker = ({settings, title, timerStart, showAlert, getScore, getTime}) => {
    const [mapInstance, setMapInstance] = useState(null);
    const [distanceValue, setDistanceValue] = useState(null);
    const [totalDistance, setTotalDistance] = useState(null);
    const [lastMile, setLastMile] = useState(null);
    const [score, setScore] = useState(0);
    const [completed, setCompleted] = useState(false);
    const [startTimer, setStartTimer] = useState(false);
    const [resetTimer, setResetTimer] = useState(false);
    const [stopTimer, setStopTimer] = useState(false);
    const [attempts, setAttempts] = useState(0);
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
        //console.log(title, coordinates)
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
        setAttempts(prev => prev+1);
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
        var last_guess_error = (calculateDistance(coordsB.lat,coordsB.lng,coordinates[0],coordinates[1],'K'));
        //console.log(coordsB.lat)
        setLastMile(last_guess_error.toFixed(1));
        userStats['dist_to_dest'].push(last_guess_error)
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
    }

    const finishing = () => {
        finish(mapInstance);
        setCompleted(true);
        showAlert();
        const finalscore = getFinalScore()
        setScore(finalscore);
        getScore(finalscore, userStats);

        mapInstance.setRestriction({ latLngBounds: getBounds(coordinates, 200)});
        const zoomOut = setInterval(() => {
            const zoomTo = mapInstance.zoom - 1;
            if (zoomTo - 1 > 9) {
                mapInstance.setZoom(zoomTo)
            } else {
                clearInterval(zoomOut);
            }
        }, 80);
        mapInstance.panTo({lat: coordinates[0], lng: coordinates[1]})
        markers.forEach((marker, i)=>{
            marker.setVisible(false); // maps API hide call
        });
    }

    function getBounds(pos, dist) {
        return { 
            north: calculateDestinationCoordinates(...pos, dist, 0).lat, 
            east: calculateDestinationCoordinates(...pos, dist, 90).lng, 
            south: calculateDestinationCoordinates(...pos, dist, 180).lat, 
            west: calculateDestinationCoordinates(...pos, dist, 270).lng
        }
    }

    function getFinalScore() {
        // get optimal distance from starting point to final destination
        const optDistance = calculateDistance(startMarker?.getPosition().lat(), startMarker?.getPosition().lng(), coordinates[0], coordinates[1], "K");
        // split the distance into equal sections based on the number of steps taken.
        const sectionDistance = markers.length ? optDistance/(markers.length) : 0;
        // calculate the back bearing i.e. the bearing in the opposite direction
        const backBearing = bearing>180 ? parseFloat(bearing-180) : parseFloat(bearing+180)
        //console.log(bearing, backBearing)
        const sections = markers.map((marker, i)=> {
            const markerLat = marker?.getPosition().lat();
            const markerLng = marker?.getPosition().lng();
            const coords = calculateDestinationCoordinates(startMarker?.getPosition().lat(),startMarker?.getPosition().lng(),sectionDistance*(i+1),backBearing);
            //console.log(markerLat, markerLng, coords.lat, coords.lng)
            //addDistanceLine(mapInstance, {lat:markerLat,lng:markerLng}, coords)
            return calculateDistance(markerLat, markerLng, coords.lat, coords.lng, "K");
        });
        //console.log(sections, backBearing)
        sections.shift(); // remove the first element (which should always be 0)
        // calculate the average deviation and add to the optimal distance
        const avgDeviation = (sections.reduce((a, b) => a + b, 0)/sections.length);
        const pendingDistance = sections[sections.length-1]
        const dist = avgDeviation+optDistance+pendingDistance;
        //console.log(sections, dist, avgDeviation, optDistance, pendingDistance)
        return sections.length ? calculateScore(settings, dist) : 0;
    }

    useEffect(() => {
        function placeMarker(location, map, start=false) {
            curr_coordinates = [];
            const marker = new google.maps.Marker({
                position: location, 
                map: map,
            });
            if (start) {
                markers.push(marker);
            } else {
                startMarker = marker;
            }
            const pos = [marker.getPosition().lat(),marker.getPosition().lng()]
            guess_coordinates.push(pos);
            curr_coordinates.push(...pos);
            //console.log(start, startMarker, markers, markers.length)
            if (start) check(map);
            // check if maximum attempts has been reached
            if (markers.length === settings.maxattempts) {
                // and trigger the end of the game
                setStopTimer(prev=>!prev);
            } else {
                // If not, reset the timer
                setResetTimer(prev => !prev);
            }
            
            // set map restriction for the new coordinates
            map.setRestriction({ latLngBounds: getBounds(pos, settings.maxbound)});
            map.panTo({lat: pos[0], lng: pos[1]});
        }
        
        const map = new window.google.maps.Map(ref.current, {
            zoom: settings.zoom,
            streetViewControl: false,
            mapTypeControl: false,
            zoomControl: false,
            fullscreenControl: false,
            gestureHandling: "auto",
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            restriction: {
                latLngBounds: getBounds(location, settings.maxbound),
            },
        });

        function setMapCoordinates(map) {
            //console.log(bearing)
            // set starting coordinates (with a distance of x from the final coordinates, and a random bearing)
            const mapCenter = calculateDestinationCoordinates(...coordinates, settings.maxdistance, bearing)
            map.setCenter(mapCenter);
            // set restrictions in the four cardinal points
            map.setRestriction({ latLngBounds: getBounds([mapCenter.lat, mapCenter.lng], settings.maxbound)});
            // place a marker on the starting location
            placeMarker(mapCenter, map, startmap);
            setLastMile(settings.maxdistance)
            if (markers.length) startmap = true;
        }

        // start the timer only after all map tiles and controls have been loaded
        window.google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
            //setStartTimer(true);
        });

        window.google.maps.event.addListener(map, 'click', function(event) {
            if (check_count >= 0) placeMarker(event.latLng, map, true);
            if (check_count == 0) {
                check_count += 1;
            }
        });

        setMapCoordinates(map);
        setMapInstance(map)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [timerStart]);

    useEffect(()=> {
        setStartTimer(timerStart);
    }, [timerStart])

    return (
        <div className={styles.container}>
            <MapMeter distance={distanceValue} lastMile={lastMile} totalDistance={totalDistance} attempts={attempts} type='restricted' />
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

export { RestrictedMarker }