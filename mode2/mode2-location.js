// CYBER SHIELD MODE 2 - LOCATION - mode2-location.js
// GitHub Path: mode2/mode2-location.js
// Kaam: Login ke time Location lena - Lat/Lng + City/State (agar mile)
window.getCurrentLocation = function(){
  return new Promise(function(res){
    if(!navigator.geolocation) return res(null);
    navigator.geolocation.getCurrentPosition(function(p){
      res({lat:p.coords.latitude, lng:p.coords.longitude, accuracy:p.coords.accuracy});
    }, function(){ res(null); }, {timeout:8000});
  });
};
