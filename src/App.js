import './App.css';
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {Icon} from "leaflet";
import React, {useEffect, useState, useCallback} from "react";
import {getAllChargePoint} from './Resources/API/api'

// var cordinaties = [50.8170709, 12.96230];

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
    return new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(res, rej);
    });
  }

  //The states for the app
  const [mapData, setMapData] = useState();
  const [position, setPosition] = useState();
  const [distance, setDistance] = useState();
  const [maxDistance, setMaxDistance] = useState();
  const [isType2, setType2] = useState(true);
  const [isCHAdeMO, setCHAdeMO] = useState(true);
  const [isCCS, setCCS] = useState(true);
  const [typeIDs, setTypeIDs] = useState();

  function getMapData(distance, latitude, longitude, connectiontypeid) {
    getAllChargePoint(distance, latitude, longitude, connectiontypeid).then(data => {
      setMapData(data);
    })
  }

  const creatConnnectionTypeIDs = useCallback(() => {
    var connectiontype;

    if (isType2) {
      connectiontype = process.env.REACT_APP_CONNECTION_TYPE_TYPE2;
    }
    if (isCHAdeMO) {
      if (connectiontype) connectiontype = connectiontype + "," + process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO
      else connectiontype = process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO;
    }
    if (isCCS) {
      if (connectiontype) connectiontype = connectiontype + "," + process.env.REACT_APP_CONNECTION_TYPE_CCS
      else connectiontype = process.env.REACT_APP_CONNECTION_TYPE_CCS;
    }
    setTypeIDs(connectiontype);
  },[isType2,isCHAdeMO,isCCS])

  useEffect(() => {

    getCurrentPosition().then((data) => {
      setPosition(data.coords);
      creatConnnectionTypeIDs();
      if(typeIDs)getMapData(distance ? distance : 100, data.coords.latitude, data.coords.longitude, typeIDs)
    });
  }, [distance, typeIDs, creatConnnectionTypeIDs]);



  const setPopup = (data, label) => {
    var info;

    if (label === "Latitude") {
      info = data.latitude.toFixed(2)
    } else if (label === "Longitude") {
      info = data.longitude.toFixed(2)
    } else if (label === "Distance") {
      info = data.distance ? (data.distance.toFixed(2) + (data.distanceUnit === 1 ? "km" : "")) : "";
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
        return (<div className='row' key={`connector-tbl-${idx}`}>
          <div className='column'>
            <label>{idx + 1}</label>
          </div>
          <div className='column'>
            <label>{data["connectionType"]["title"]}</label>
          </div>
          <div className='column'>
            <label>{data["powerKW"]}kW</label>
          </div>
        </div>)
      else return <div className='row' key={`connector-tbl-${idx}`}></div>
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

    setMapData();
    setTypeIDs();

    if (value === process.env.REACT_APP_CONNECTION_TYPE_TYPE2) setType2((current) => (current = isChecked));
    else if (value === process.env.REACT_APP_CONNECTION_TYPE_CHAdeMO) setCHAdeMO((current) => (current = isChecked));
    else if (value === process.env.REACT_APP_CONNECTION_TYPE_CCS) setCCS((current) => (current = isChecked));
  }

  function onKeyDown(e) {
    /// When enter button is pressed
    if (e.keyCode === 13) {
      setMapData();
      setDistance(maxDistance);
    }
  }

  function onChange(e) {
    setMaxDistance(e.target.value);
  }

  return (
      <div>
        {(!mapData) && <div> Loading. . . </div>}
        {mapData &&
        <div style={{padding: 10}}>
          <input type="text"
                 placeholder={"max distance in km"}
                 value={maxDistance}
                 onChange={(event) => {
                   onChange(event)
                 }}
                 onKeyDown={(event) => {
                   onKeyDown(event)
                 }}/>
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
        {mapData &&
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
