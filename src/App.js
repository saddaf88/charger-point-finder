import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet";
import React, {useEffect, useState} from "react";
import {getAllChargePoint} from './Resources/API/api'

export default function App() {
  //Configuring the marker icon
  const LeafIcon = Icon.extend({
    options: {}
  })

  const greenIcon = new LeafIcon({
        iconUrl: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
      }),
      redIcon = new LeafIcon({
        iconUrl: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      });

  const changeIconColor = (connections) => {
    if (connections.length === 0) return redIcon;
    else return greenIcon;
  };

  //Getting user's current position
  function getCurrentPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    }
  }

  function showPosition(position) {
    setPosition(position.coords);
  }

  function showError(error) {
    alert("error");
    console.warn(error.message)
  }

  //The states for the app
  const [mapData, setMapData] = useState();
  const [position, setPosition] = useState();
  const [maxDistance, setDistance] = useState();
  const [isType2, setType2] = useState(true);
  const [isCHAdeMO, setCHAdeMO] = useState(true);
  const [isCCS, setCCS] = useState(true);

  function getMapData(distance, latitude, longitude, connectiontypeid){
    getAllChargePoint(distance, latitude, longitude, connectiontypeid).then(data => {
      setMapData(data);
    })
  }

  useEffect(() => {
    getCurrentPosition();
    if(position) getMapData(maxDistance ? maxDistance : 100, position.latitude, position.longitude, creatConnnectionTypeIDs())
  }, [position, isType2, isCCS, isCHAdeMO]);

  const setPopup = (data, label) => {
    var info;

    if (label === "Latitude") {
      info = data.latitude.toFixed(2)
    } else if (label === "Longitude") {
      info = data.longitude.toFixed(2)
    } else if (label === "Distance") {
      info = data.distance.toFixed(2) + (data.distanceUnit === 1 ? "km" : "")
    } else if (label === "Status:") {
      info = data.length ? "Available" : "Occupied"
    } else if (label === "Connectors") {
    }

    return <div className='row'>
      <label style={{fontWeight: 'bold', paddingRight: 10}}>{label}</label>
      {info && <label>{info}</label>}
    </div>
  }

  const setConnectorTbl = (connector) => {
    return connector.map((data, idx) => {
      if (data["connectionType"]["id"].toString() === process.env.REACT_APP_CONNECTION_TYPE_TYPE2 ||
          data["connectionType"]["id"].toString() === process.env.REACT_APP_CONNECTION_TYPE_CCS ||
          data["connectionType"]["id"].toString() === process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO)
        return <div className='row'>
          <div className='column'>
            <label>{idx + 1}</label>
          </div>
          <div className='column'>
            <label>{data["connectionType"]["title"]}</label>
          </div>
          <div className='column'>
            <label>{data["powerKW"]}kW</label>
          </div>
        </div>
    })
  }

  const setMarker = () => {
    return mapData.map((data, idx) => {
      var addressInfo = data.addressInfo;
      var connections = data.connections;
      var operatorInfo = data.operatorInfo;

      return (
          <Marker position={[addressInfo.latitude, addressInfo.longitude]} key={`markerkey-${idx}`}
                  icon={changeIconColor(connections)}>
            <Popup>
              <h3>{addressInfo.addressLine1} {addressInfo.postcode} {addressInfo.town} ({addressInfo.country.title})</h3>
              <div className='row'>
                <div className='column'>
                  <div className='row'>
                    <label style={{fontWeight: 'bold'}}>Operator</label>
                  </div>
                  <div className='row'>
                    <label>{operatorInfo ? operatorInfo.title : ""}</label>
                  </div>
                </div>
                <div className='column'>
                  {setPopup(addressInfo, "Latitude")}
                  {setPopup(addressInfo, "Longitude")}
                  {setPopup(addressInfo, "Distance")}
                </div>
              </div>
              {setPopup(connections, "Status:")}
              {setPopup(connections, "Connectors")}
              {connections.length &&
              <div className='row'>
                <div className='column'><label style={{fontWeight: 'bold'}}>#</label></div>
                <div className='column'><label style={{fontWeight: 'bold'}}>plug type</label></div>
                <div className='column'><label style={{fontWeight: 'bold'}}>max power</label></div>
              </div>
              }
              {connections.length && setConnectorTbl(connections)}
            </Popup>
          </Marker>)
    });
  }

  function setConnectionType(event) {
    var value = event.target.value;
    var isChecked = event.target.checked

    if (value === process.env.REACT_APP_CONNECTION_TYPE_TYPE2) setType2((current) => (current = isChecked));
    else if (value === process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO) setCHAdeMO((current) => (current = isChecked));
    else if (value === process.env.REACT_APP_CONNECTION_TYPE_CCS) setCCS((current) => (current = isChecked));
  }

  function onKeyDown(e){
    if (e.keyCode === 13) {
      getMapData(maxDistance ? maxDistance : 100, position.latitude, position.longitude, creatConnnectionTypeIDs());
    }
  }

  function onChange(e){
    setDistance(e.target.value);
  }

  function creatConnnectionTypeIDs(){
    var connectiontype;
    if(isType2){
      connectiontype = process.env.REACT_APP_CONNECTION_TYPE_TYPE2;
    }
    if(isCHAdeMO){
      if(connectiontype) connectiontype = connectiontype + "," + process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO
      else connectiontype = process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO;
    }
    if(isCCS){
      if(connectiontype) connectiontype = connectiontype + "," + process.env.REACT_APP_CONNECTION_TYPE_CCS
      else connectiontype = process.env.REACT_APP_CONNECTION_TYPE_CCS;
    }
    return connectiontype;
  }

  return (
      <div>
        {(!mapData || !position) && <div> Loading. . . </div>}
        {mapData && position &&
        <div style={{padding: 10}}>
          <input type="text"
                 placeholder={"max distance in km"}
                 value={maxDistance}
                 onChange={(event) => {onChange(event)}}
                 onKeyDown={(event) => {onKeyDown(event)}}/>
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
        </div>}
        {mapData && position &&
        (<MapContainer center={[position.latitude, position.longitude]} zoom={13} scrollWheelZoom={false}>
          <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {setMarker()}
        </MapContainer>)
        }
      </div>
  );
}
