/**
 * User: Calvin
 * Date: 13-1-17
 * Time: 下午10:57
 */
var cz_location = {
    Gmap: null,
    init: function(){
        //cz_location.locate(36.0757117,120.4128609,'Alcatel-lucent');
        //cz_location.geoLocate();
        try{
            var latlng = new google.maps.LatLng(36.0757117,120.4128609);
            var myOptions = {
                zoom: 8,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var map = new google.maps.Map(document.getElementById("map_canvas"),
                myOptions);
            cz_location.Gmap = map;
        }catch (err){
            cz_location.msg('Google map loads failed');
        }
        $("#bt_times").click(function(){
            $(this).parent('div').hide();
        });
    },
    mark: function(latlng, map, title){
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: title
        });
    },
    msg: function(text){
        var $msg = $("#msg_box");
        var $text = $msg.find('strong').first();
        $text.text(text);
        $msg.slideDown();
    },
    locate: function(map, latitude, longitude){
        try{
            var latlng = new google.maps.LatLng(latitude, longitude);
            var myOptions = {
                zoom: 12,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            //map.setCenter(latlng);
            map.setOptions(myOptions);
            //var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            cz_location.mark(latlng, map, 'Mobile location');
        }catch (err){
            cz_location.msg('Google map loads failed');
        }
    },
    get: function(){
        var $addr = $("#cz_addr");
        var $search = $("#cz_search");
        //var rest = 'http://135.252.143.226:8080/ParlayREST/1.0/location/queries/location';
        /*var data = {
            acceptableAccuracy: 1000,
            maximumAge: 180,
            requestedAccuracy: 1000,
            responseTime: 300,
            tolerance: 'LowDelay'
        }*/
        function check(){
            var sip = /sip(s?)\:[\w\.\-\+]+@([\w\-]+\.)+[a-zA-Z]/;
            var tel = /^\+?\d{4,32}$/;
            var valid = true;
            if(!$addr.val()){
                cz_location.msg('SIP URL or telephone number is required');
                valid = false;
            }else if(!sip.test($addr.val()) && !tel.test($addr.val())){
                cz_location.msg('Input is invalid');
                valid = false;
            }
            return valid;
        }
        $search.click(function(){
            $("#cz_search").button('loading');
            $("#msg_box").hide();
            if (check()){
                var url = 'cgi-bin/get.cgi'
                /*$.get(url, { address: $addr.val() }, function(data){
                    alert(data);
                    if(data){
                        var latitude = data.latitude;
                        var longitude = data.longitude;
                        alert('latitude: '+latitude+', longitude: '+longitude);
                    }else{
                        alert('Ops, server no response, please try later!');
                    }
                });*/
                var method = window.WebSocket? 'POST':'GET'
                $.ajax({
                    url: url,
                    data: { address: $addr.val(), method: method },
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){
                        if(data){
                            if(data.code){
                                cz_location.msg('code: '+data.code);
                                $("#cz_search").button('reset');
                            }else{
                                var latitude = data.latitude;
                                var longitude = data.longitude;
                                cz_location.msg('latitude: '+latitude+', longitude: '+longitude);
                                cz_location.locate(cz_location.Gmap, latitude,longitude);
                                $("#cz_search").button('reset');
                            }
                        }else{
                            cz_location.msg('Oops, server no response, please try later!');
                            $("#cz_search").button('reset');
                        }
                    },
                    error: function(data){
                        cz_location.msg('Oops, server is sleeping, or your number is not found, please try later!');
                        $("#cz_search").button('reset');
                    }
                });

                /*$.ajax({
                    url: rest,
                    data: data,
                    type: 'POST',
                    dataType: 'script',
                    success: function(data){
                        *//*if(data.length>10){
                            alert('hello');
                            var $curr = $(data).find('currentLocation');
                            var latitude = $curr.children('latitude').first().text();
                            var longitude = $curr.children('longitude').first().text();
                            alert('latitude: '+latitude+', longitude: :'+longitude);
                        }else{
                            alert('Ops, server no response, please try later!');
                        }*//*
                        alert(data);
                    },
                    error: function(data){
                        alert(data.getAllResponseHeaders());
                    }
                });*/

            }
        });
    },
    geoLocate: function(){
        try{
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
                    cz_location.msg('Geolocation service failed.');
                    initialLocation = qingdao;
                } else {
                    cz_location.msg("Your browser doesn't support geolocation. We've placed you in Qingdao.");
                    initialLocation = qingdao;
                }
                map.setCenter(initialLocation);
            }
        }catch(err){
            cz_location.msg(err);
        }
    },
    resize: function(){
        availWidth = parseInt(document.body.clientWidth);
        availHeight = parseInt(document.body.clientHeight);
        document.getElementById("map_canvas").style.width = availWidth+'px';
        document.getElementById("map_canvas").style.height = availHeight+'px';
    }
}