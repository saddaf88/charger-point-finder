import axios from "axios";

var baseURL = "https://api.openchargemap.io/v3/poi/?"

export async function getAllChargePoint(distance, latitude, longitude, connectiontypeid) {
  var output = "output=json";
  var camelcase = "&camelcase=true";
  var distance = "&distance="+ distance ;
  var distanceUnit = "&distanceunit=KM";
  var latitude = "&latitude="+ latitude ;
  var longitude = "&longitude="+ longitude;
  var connectiontypeid = connectiontypeid ? "&connectiontypeid="+ connectiontypeid : "";

  var url = baseURL + output + camelcase + distance + distanceUnit + latitude + longitude + connectiontypeid
  try {
    const response = await axios.get(url,{
      headers: {
        "X-API-Key": process.env.REACT_APP_API_KEY
      }
    });

    return response.data
  } catch (error) {
    console.error(error);
  }
}
