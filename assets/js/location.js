/**
 * User: Calvin
 * Date: 13-1-17
 * Time: 下午10:57
 */
var cz_location = {
    init: function(){
        var latlng = new google.maps.LatLng(36.0757117,120.4128609);
        var myOptions = {
            zoom: 8,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"),
            myOptions);
        //cz_location.mark(latlng, map);
    },
    mark: function(latlng, map){
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title:"Hello World!"
        });
    },
    get: function(){
        var rest = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location';
        var $addr = $("#cz_addr");
        var $search = $("#cz_search");
        var data = {
            acceptableAccuracy: 1000,
            maximumAge: 180,
            requestedAccuracy: 1000,
            responseTime: 300,
            tolerance: 'LowDelay'
        }
        $search.click(function(){
            if ($addr.val()!=''){
                data.address = $addr.val();
                data.rest = rest;
                var url = '/cgi-bin/get.cgi'
                $.get(url, data, function(data){
                    alert(data);
                    if(data){
                        var $curr = $(data).find('currentLocation');
                        var latitude = $curr.children('latitude').first().text();
                        var longitude = $curr.children('longitude').first().text();
                        alert('latitude: '+latitude+', longitude: :'+longitude);
                    }else{
                        alert('Ops, server no response, please try later!');
                    }
                });
                /*$.ajax({
                    url: rest,
                    data: data,
                    dataType: 'script',
                    success: function(data){
                        if(data.length>10){
                            alert('hello');
                            var $curr = $(data).find('currentLocation');
                            var latitude = $curr.children('latitude').first().text();
                            var longitude = $curr.children('longitude').first().text();
                            alert('latitude: '+latitude+', longitude: :'+longitude);
                        }else{
                            alert('Ops, server no response, please try later!');
                        }
                    },
                    error: function(data){
                        alert(data.getAllResponseHeaders());
                    }
                });*/
                /*$.get(rest, data, function(data){
                    alert(data);
                    if(data){
                        var $curr = $(data).find('currentLocation');
                        var latitude = $curr.children('latitude').first().text();
                        var longitude = $curr.children('longitude').first().text();
                        alert('latitude: '+latitude+', longitude: :'+longitude);
                    }else{
                        alert('Ops, server no response, please try later!');
                    }
                });*/
            }
        });
    },
    locate: function(){
        //cz_location.resize();
        var initialLocation;
        var qingdao = new google.maps.LatLng(36.0757117,120.4128609);
        var browserSupportFlag =  new Boolean();
        var myOptions = {
            zoom: 6,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

        // Try W3C Geolocation (Preferred)
        if(navigator.geolocation) {
            browserSupportFlag = true;
            navigator.geolocation.getCurrentPosition(function(position) {
                initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
                map.setCenter(initialLocation);
            }, function() {
                handleNoGeolocation(browserSupportFlag);
            });
            // Try Google Gears Geolocation
        } else if (google.gears) {
            browserSupportFlag = true;
            var geo = google.gears.factory.create('beta.geolocation');
            geo.getCurrentPosition(function(position) {
                initialLocation = new google.maps.LatLng(position.latitude,position.longitude);
                map.setCenter(initialLocation);
            }, function() {
                handleNoGeoLocation(browserSupportFlag);
            });
            // Browser doesn't support Geolocation
        } else {
            browserSupportFlag = false;
            handleNoGeolocation(browserSupportFlag);
        }

        function handleNoGeolocation(errorFlag) {
            if (errorFlag == true) {
                alert("Geolocation service failed.");
                initialLocation = qingdao;
            } else {
                alert("Your browser doesn't support geolocation. We've placed you in Qingdao.");
                initialLocation = qingdao;
            }
            map.setCenter(initialLocation);
        }
    },
    resize: function(){
        availWidth = parseInt(document.body.clientWidth);
        availHeight = parseInt(document.body.clientHeight);
        document.getElementById("map_canvas").style.width = availWidth+'px';
        document.getElementById("map_canvas").style.height = availHeight+'px';
    }
}