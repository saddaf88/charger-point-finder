import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet";
import React, {useEffect, useState} from "react";

var cordinaties = [50.8170709, 12.96230];
var cords = [[50.829847, 12.931371], [50.817041599999996, 12.9213701], [50.817041599999996, 12.9361783], [50.827847, 12.921370], [50.829847, 12.921370], [50.829847, 12.941370]]

export default function App() {
  //Configuring the marker icon
  const LeafIcon = Icon.extend({
    options: {}
  })

  const blueIcon = new LeafIcon({
        iconUrl: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
      }),
      redIcon = new LeafIcon({
        iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

  const changeIconColor = (idx) => {
    if ((idx % 2) === 0) return blueIcon;
    else return redIcon;
  };

  //The states
  const [position, setPosition] = useState();
  const [maxDistance, setDistance] = useState(); // TODO for filter section
  const [isType2, setType2] = useState(true);
  const [isCHAdeMO, setCHAdeMO] = useState(true);
  const [isCCS, setCCS] = useState(true);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }, []);

  function showPosition(position) {
    console.log(position.coords)
    setPosition(position.coords);
  }

  function showError(error) {
    alert("error");
    console.warn(error.message)
  }

  const setMarker = () => {
    return cords.map((cord, idx) => {
      return (
          <Marker position={cord} key={`markerkey-${idx}`} icon={changeIconColor(idx)}>
            <Popup>
              <h1>Salt lake City</h1>
              <p>A pretty CSS3 popup. <br/> Easily customizable.</p>
              <button onClick={() => {
                console.log(`The position [${cord[0]}, ${cord[1]}] is clicked`)
              }}>
                Show Details
              </button>
            </Popup>
          </Marker>)
    });
  }

  function setConnectionType(event){
    var value = event.target.value;
    var isChecked = event.target.checked

    if(value === process.env.REACT_APP_CONNECTION_TYPE_TYPE2) setType2((current) =>(current = isChecked) );
    if(value === process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO) setCHAdeMO((current) =>(current = isChecked) );
    if(value === process.env.REACT_APP_CONNECTION_TYPE_CCS) setCCS((current) =>(current = isChecked) );
  }

  return (
      <div>
        {!position && <div> Loading. . . </div>}
        {position &&
        <div style={{padding: 10}}>
          <input type="text" name="name" placeholder={"max distance in km"}/>
          <label style={{paddingLeft: 10}}>Connection Type:</label>

          <input type="checkbox"
                 value={process.env.REACT_APP_CONNECTION_TYPE_TYPE2}
                 name="Type 2"
                 checked={isType2}
                 onChange={(e) => setConnectionType(e)}/> Type 2
          <input type="checkbox"
                 value={process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO}
                 name="CHAdeMO"
                 checked={isCHAdeMO}
                 onChange={(e) => setConnectionType(e)}/> CHAdeMO
          <input type="checkbox"
                 value={process.env.REACT_APP_CONNECTION_TYPE_CCS}
                 name="CCS"
                 checked={isCCS}
                 onChange={(e) => setConnectionType(e)}/> CCS

          <button style={{float:'right'}} onClick={()=>{}}>Find</button>

        </div>}
        {position &&
        (<MapContainer center={[position.latitude, position.longitude]} zoom={14} scrollWheelZoom={false}>
              <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={cordinaties}>
                <Popup>
                  A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
              </Marker>
              {setMarker()}
            </MapContainer>)
        }
      </div>
  );

}
