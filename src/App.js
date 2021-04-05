import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet";
import React, {useEffect, useState} from "react";

const mapData = require('./Resources/TestData.json');

var cordinaties = [51.905445, 4.466637];
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

  const changeIconColor = (connections) => {
    if (connections.length === 0) return redIcon;
    else return blueIcon;
  };

  //Getting user's current position
  function getCurrentPosition(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }

  function showPosition(position) {
    console.log(position.coords)
    setPosition(position.coords);
  }

  function showError(error) {
    alert("error");
    console.warn(error.message)
  }

  //The states for the app
  const [position, setPosition] = useState({latitude:cordinaties[0], longitude:cordinaties[1]}); //TODO remove this when current position has been called
  const [maxDistance, setDistance] = useState(); // TODO for filter section
  const [isType2, setType2] = useState(true);
  const [isCHAdeMO, setCHAdeMO] = useState(true);
  const [isCCS, setCCS] = useState(true);

  useEffect(() => {
   //getCurrentPosition();
  }, []);




  const setMarker = () => {

    return mapData.map((data, idx) => {
      var addressInfo = data.addressInfo;
      var connections = data.connections;
      var operatorInfo = data.operatorInfo;

       //debugger;


      return (
          <Marker position={[addressInfo.latitude, addressInfo.longitude]} key={`markerkey-${idx}`} icon={changeIconColor(connections)}>
            <Popup style={{}}>
              <h3>{addressInfo.addressLine1} {addressInfo.postcode} {addressInfo.town}</h3>
              <div className='row'>
                <div className='column'>
                  <div className='row'>
                     <label style={{fontWeight:'bold'}}>Operator</label>
                  </div>
                  <div className='row'>
                    <label>{operatorInfo ? operatorInfo.title : ""}</label>
                  </div>
                </div>
                <div className='column'>
                  <div className='row'>
                    <label style={{fontWeight:'bold',paddingRight:10 }}>Latitude</label>
                    <label>{addressInfo.latitude.toFixed(2)}</label>
                  </div>
                  <div className='row'>
                    <label style={{fontWeight:'bold',paddingRight:10 }}>Longitude</label>
                    <label>{addressInfo.longitude.toFixed(2)}</label>
                  </div>
                  <div className='row'>
                    <label style={{fontWeight:'bold',paddingRight:10 }}>Distance</label>
                    <label>{addressInfo.distance.toFixed(2)}{addressInfo.distanceUnit === 1 ? "km" :""}</label>
                  </div>
                </div>
              </div>
              <div className='row'>
                <label style={{fontWeight:"bold", paddingRight:10}}>Status:</label>
                <label>{connections.length ? "Available" : "Not Available"}</label>
              </div>
              <div className='row'>
                <label style={{fontWeight:"bold", paddingRight:10}}>Connectors</label>
                <label>{connections.length ? "Available" : "Not Available"}</label>
              </div>
              {/*<button onClick={() => {*/}
              {/*  // console.log(`The position [${cord[0]}, ${cord[1]}] is clicked`)*/}
              {/*}}>*/}
              {/*  Show Details*/}
              {/*</button>*/}
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
        (<MapContainer center={[position.latitude, position.longitude]} zoom={13} scrollWheelZoom={false}>
              <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/*<Marker position={cordinaties}>*/}
              {/*  <Popup>*/}
              {/*    A pretty CSS3 popup. <br/> Easily customizable.*/}
              {/*  </Popup>*/}
              {/*</Marker>*/}
              {setMarker()}
            </MapContainer>)
        }
      </div>
  );

}
