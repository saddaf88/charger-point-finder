import logo from './logo.svg';
import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {icon} from "leaflet";
import React, {useEffect, useState} from "react";


var cordinaties = [50.817041599999996, 12.9361783];

export default function App() {
  const [position, setPosition] = useState();
  const [maxDistance, setDistance] = useState();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }, []);

  function showPosition(position) {
    console.log(position);
    setPosition(position.coords);
    //alert("success" );
  }

  function showError(error) {
    alert("error");
  }

  return (

      <div>
        {!position &&
        <div>
          Loading. . .
        </div>
        }
        {position &&
        <div style={{padding: 10}}>
          <input type="text" name="name" placeholder={"max distance in km"}/>
          <label style={{paddingLeft:10}}>Connection Type:</label>

            <input type="checkbox" value="25" name="Type 2" /> Type 2
            <input type="checkbox" value="2" name="CHAdeMO" /> CHAdeMO
            <input type="checkbox" value="33" name="CCS" /> CCS

          {/*<label>*/}
          {/*  Is going:*/}
          {/*  <input*/}
          {/*      name="isGoing"*/}
          {/*      type="checkbox"*/}
          {/*      // checked={this.state.isGoing}*/}
          {/*      // onChange={this.handleInputChange}*/}
          {/*  />*/}
          {/*</label>*/}

        </div>}
        {position &&
        (
            <MapContainer center={[position.latitude, position.longitude]} zoom={14} scrollWheelZoom={false}>
              <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={cordinaties}>
                <Popup>
                  A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
              </Marker>
              <Marker position={[50.827847, 12.921370]}>
                <Popup>
                  A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
              </Marker>
              <Marker position={[50.829847, 12.921370]}>
                <Popup>
                  A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
              </Marker>
              <Marker position={[50.829847, 12.931371]}>
                <Popup>
                  A pretty CSS3 popup. <br/> Easily customizable.
                </Popup>
              </Marker>
            </MapContainer>)}
      </div>
  );

}

// export default App;
