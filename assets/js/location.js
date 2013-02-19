/**
 * User: Calvin
 * Date: 13-1-17
 * Time: 下午10:57
 */
var cz_location = {
    Gmap: null,
    Gmark: null,
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
        $("#cz_search").button('reset');
    },
    mark: function(latlng, map, title){
        var marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: title
        });
        cz_location.Gmark = marker;
    },
    line: function(prev, curr){
        if(prev.latitude!=0 && prev.longitude!=0){
            var coordinates = [
                new google.maps.LatLng(prev.latitude, prev.longitude),
                new google.maps.LatLng(curr.latitude, curr.longitude)
            ];
            var flightPath = new google.maps.Polyline({
                path: coordinates,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2
            });
            flightPath.setMap(cz_location.Gmap);
        }
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
                zoom: 11,
                center: latlng,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            //map.setCenter(latlng);
            map.setOptions(myOptions);
            //var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            if(!cz_location.Gmark){
                cz_location.mark(latlng, map, 'Mobile location');
            }else{
                cz_location.Gmark.setPosition(latlng);
            }
        }catch (err){
            cz_location.msg('Google map loads failed');
        }
    },
    get: function(){
        var $addr = $("#cz_addr");
        var $search = $("#cz_search");
        var addr_change = false;
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
            $("#msg_box").hide();
            var $trace = $("#cb_trace").attr('checked');
            var info = {
                "latitude": 0,
                "longitude": 0
            }
            if (check()){
                $("#cz_search").button('loading');
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
                var method = $trace? 'POST':'GET';
                $.ajax({
                    url: url,
                    data: { address: $addr.val(), method: method },
                    type: 'GET',
                    dataType: 'json',
                    success: function(data){
                        if(data){
                            if(data.code){
                                if(data.code == 201){
                                    var count = 0;
                                    $("#bt_times").parent('div').hide();
                                    function update_info(){
                                        $.getJSON('cgi-bin/update.cgi', { address: $addr.val() }, function(jdata){
                                            if(jdata){
                                                var latitude = jdata.latitude;
                                                var longitude = jdata.longitude;
                                                if(latitude && longitude && (latitude!=info.latitude || longitude!=info.longitude)){
                                                    cz_location.locate(cz_location.Gmap, latitude,longitude);
                                                    var curr = { latitude:latitude, longitude:longitude }
                                                    cz_location.line(info, curr);
                                                    info.latitude = latitude;
                                                    info.longitude = longitude;
                                                }else{
                                                    count++;
                                                }
                                            }else{
                                                cz_location.msg('Oops, location info is lost!');
                                                $("#cz_search").button('reset');
                                                window.clearInterval(int);
                                            }
                                            if(count>=3000){
                                                $("#cz_search").button('reset');
                                                window.clearInterval(int);
                                                cz_location.msg('Location info is not changed over 15 minutes, request canceled!');
                                            }
                                        });
                                    }
                                    update_info();
                                    var int = setInterval(update_info, 3000);
                                }else{
                                    cz_location.msg(data.code +' '+ data.msg);
                                    $("#cz_search").button('reset');
                                }
                            }else{
                                var latitude = data.latitude;
                                var longitude = data.longitude;
                                //cz_location.msg('latitude: '+latitude+', longitude: '+longitude);
                                cz_location.locate(cz_location.Gmap, latitude,longitude);
                                $("#cz_search").button('reset');
                            }
                        }else{
                            cz_location.msg('Oops, your number is not found, please try again!');
                            $("#cz_search").button('reset');
                        }
                    },
                    error: function(data){
                        cz_location.msg('Oops, server no response, please try later!');
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

cz_qos = {
    init: function(){
        var $pag = $(".pag_num"),
            qosRank = 1,
            $addr = $("#in_addr");
        $("#bt_times").click(function(){
            $(this).parent('div').hide();
        });
        $pag.click(function(){
            $pag.removeClass('active');
            $pag.addClass('disabled');
            $(this).removeClass('disabled');
            $(this).addClass('active');
            qosRank = $(this).text();
        });
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
        $("#bt_send").click(function(){
            $("#bt_times").parent('div').hide();
            if(check()){
                $.getJSON('cgi-bin/qos.cgi', { address: $addr.val(), qosRank: qosRank }, function(data){
                    if(data){
                        cz_location.msg(data.code+' '+data.msg);
                    }else{
                        cz_location.msg('Oops, server no response, please try later!');
                    }
                });
            }
        });
    }
}