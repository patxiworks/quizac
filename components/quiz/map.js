import { useState, useEffect, useRef } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import styles from "./map.module.css";

const render = (status) => {
  if (status === Status.LOADING) return <h3>{status} ..</h3>;
  if (status === Status.FAILURE) return <h3>{status} ...</h3>;
  return null;
};

var true_location = [6.593589, 3.363337];
var us_city_set = [4699066, 5809844, 4164138, 4440906,4894465, 2562501];
var world_city_set =[3143244, 3599699, 1857910, 4853608, 323786];
var accumulated_distance = 0;
var current_name = '';
var distance_from_guess = [];
var markers = [];
var guess_coordinates = [];
var check_count = 0;

const MyMapComponent = ({center, zoom}) => {
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
        var guess_error = (distance(guess_coordinates[0],guess_coordinates[1],true_location[0], true_location[1],'K'));
        accumulated_distance += parseFloat(guess_error);
        distance_from_guess = guess_error;

        var true_coords = {lat: true_location[0], lng: true_location[1]};
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
            path: 'M 0,-1 0,1',
            strokeOpacity: 1,
            scale: 2
        };

        var flightPath = new google.maps.Polyline({
            path: flightPlanCoordinates,
            strokeOpacity: 0,
            icons: [{
                icon: lineSymbol,
                offset: '100%',
                repeat: '15px'
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


const MapGuess = () => {
    const center = { lat: 6.586854, lng: 3.3259993 };
    const zoom = 10;

    async function getData(url) {
        return fetch(url)
            .then(response => response.json())
            .catch(error => console.log(error));
    }

    return (
        <>
            <div id = "round"></div>
            <Wrapper apiKey="AIzaSyCfDcAwQpZwQFFftgsXsO5Kan9Xixsc7U0" render={render}>
                <MyMapComponent center={center} zoom={zoom} />
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
