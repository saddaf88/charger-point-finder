import axios from "axios";

var baseURL = "https://api.openchargemap.io/v3/poi/?"

export async function getAllChargePoint(valDistance, valLatitude, valLongitude, valConnectiontypeid) {
  var output = "output=json";
  var camelcase = "&camelcase=true";
  var distance = "&distance="+ valDistance ;
  var distanceUnit = "&distanceunit=KM";
  var latitude = "&latitude="+ valLatitude ;
  var longitude = "&longitude="+ valLongitude;
  var connectiontypeid = valConnectiontypeid === process.env.REACT_APP_DEFAULT_CONNECTION_ID ? "" : "&connectiontypeid="+ valConnectiontypeid;

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
