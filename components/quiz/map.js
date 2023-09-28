import { useState, useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import styles from "./styles/map.module.css";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

var accumulated_distance = 0;
var current_name = '';
var distance_from_guess = [];
var markers = [];
var guess_coordinates = [];
var check_count = 0;

const MyMapComponent = ({center, zoom, locaton}) => {
    const [mapInstance, setMapInstance] = useState(false)
    const [checkGuess, setCheckGuess] = useState(null)
    const ref = useRef();
    const result = useRef();
    // var markers = [];
    // var guess_coordinates = [];
    // var check_count = 0;

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
        distance_from_guess = [];
        var guess_error = (distance(guess_coordinates[0],guess_coordinates[1],location[0], location[1],'K'));
        accumulated_distance += parseFloat(guess_error);
        distance_from_guess = guess_error;

        var true_coords = {lat: location[0], lng: location[1]};
        var guess_coords = {lat: guess_coordinates[0], lng: guess_coordinates[1]};

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

        var guess_marker = new google.maps.Marker({
            position: guess_coords,
            map: result_map,
            title: 'Guessing Location',
            icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
        });

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
        disableButton('check');
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

    function distance(lat1, lon1, lat2, lon2, unit) {
        if ((lat1 == lat2) && (lon1 == lon2)) {
            return 0;
        }
        else {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist.toFixed(1)
        ;
        }
    }

    function display_location(){
        document.getElementById("location").innerHTML = "Correct Location: " + current_name;
        document.getElementById("distance").innerHTML = "Your Guess was " + distance_from_guess + " kilometres away";
        document.getElementById("totaldistance").innerHTML = "Round Score: " + accumulated_distance.toFixed(1) + " kilometres";
    }

    const checking = () => {
        check(mapInstance)
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
            guess_coordinates.push(marker.getPosition().lat(),marker.getPosition().lng());
        }
        
        const map = new window.google.maps.Map(ref.current, {
            center,
            zoom,
        });

        window.google.maps.event.addListener(map, 'click', function(event) {
            placeMarker(event.latLng, map);
            if (check_count == 0){
            //enableButton('check');
            check_count += 1;
            }
        });
        setMapInstance(map)
        
    }, []);

    function disableButton(id){
        //document.getElementById(id).disabled = true;
    }

    return (
        <>
            <div className={styles.container}>
                <div ref={ref} className={styles.map} />
            </div>
            <div id = 'buttons' className="container" >
                <div >
                    <button type="button" className="btn btn-primary btn-lg btn btn-dark" onClick={checking} id="check">Guess!</button>
                </div>
            </div>
        </>
    );
}


const MapGuess = ({ quizData: data, quizDataError: error, item }) => {
    const location = [item.coordinates.latitude, item.coordinates.longitude]
    //const center = { lat: data.maplocation[0], lng: data.maplocation[1] };
    const zoom = 10;

    //Handle the quizDataError state
    if (error) return <div>Sorry, could not load the quiz</div>;
    //Handle the quizData loading state
    if (!data) return <div>Loading...</div>;

    return (
        <>
            <Wrapper apiKey="AIzaSyCfDcAwQpZwQFFftgsXsO5Kan9Xixsc7U0" render={render}>
                <MyMapComponent center={{ lat: data.maplocation[0], lng: data.maplocation[1] }} zoom={zoom} location={location} />
            </Wrapper>
            <div id = 'center' className="container">
                <div id="location"></div>
                <div id="distance"></div>
            </div>
            <div id = 'info'>
                <footer id="totaldistance"></footer>
            </div>
        </>
    )

}

export default MapGuess;
