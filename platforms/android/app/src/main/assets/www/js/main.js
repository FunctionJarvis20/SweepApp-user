var app = new Framework7({
    // root
    root: '#mainapp',
    on: {
        init: function(){
            // initial tab name;
            document.getElementById('s-navbar-title').innerHTML="Send New Complaint";
            // remove all previous localstorage variables of data selected
            window.localStorage.removeItem('selectedlng');
            window.localStorage.removeItem('selectedlat');
            window.localStorage.removeItem('selectedaddress');
            window.localStorage.removeItem('selectedimage');

            // load working complaint on page load
            // api to get working complaint
            $.get('https://sweeperapi.000webhostapp.com/api/complaint/userworkingcomplaint.php',{
                user_uuid: window.localStorage.getItem('uuid')
            },function(data,status){
                if(data.status == 204){
                    setWorkingComplaintError(data.message);
                }else{
                    // get working status of complaint by making api request
                    $.get('https://sweeperapi.000webhostapp.com/api/complaint/workingstatus.php',{
                        complaint_id: data.id
                    },function(result,status){
                        if(status == 'success'){
                            // call working complaint method to show the complaint on main page
                            var workingstatus = result.message;
                            // complaint details
                            var imageurl = data.image_url;
                            var description = removeTags(data.place_name);
                            var address = data.address;
                            var zone = data.zone;
                            var complaintdate = formatDate(data.complaint_date);
                            var complainttime = formatTime(data.complaint_time);
                            // calling set working complaint method to structure it
                            setWorkingComplaint(imageurl,description,address,zone,workingstatus,complaintdate,complainttime); 
                        }
                    }).fail(function(error){
                        appAlert('Something went wrong!! please check your internet connection','Failed','Ok');
                    });
                }
                console.log(data);
            }).fail(function(error){
                appAlert('Something went wrong!! please check your internet connection','Failed','Ok');
            });

            // all complaint initial load
            $.get('https://sweeperapi.000webhostapp.com/api/complaint/getfinishedcomplaints.php',{
                user_uuid: window.localStorage.getItem('uuid')
            },function(data,status){

                if(data.status == 204){
                    // if status is 204 then 
                    setAllComplaintError(data.message);
                }else{
                    // first set all the popup windows
                    addComplaintPopups(data,data.count);
                    // pass the data and data count variable top setAllComplaint() function
                    setAllComplaint(data,data.count);
                }

            }).fail(function(){
                appAlert('Something went wrong!! please check your internet connection','Failed','Ok');                
            });

            // get all the zones from database
            $.get('https://sweeperapi.000webhostapp.com/api/zone/readall.php',function(data){
                // zones
                count = data.count;
                // call function to extract zone
                extractZone(data,count);
            }).fail(function(error){
                appAlert('Something went wrong!! please check your internet connection','Failed','Ok');                
            });
        },
        pageInit: function(){
            
        }
    }
});
// image preview variable
var previewImageHolder = "";

// initializing zone picker
var zonePicker = app.picker.create({
    inputEl: '#zone-picker',
    cols: [
      {
        textAlign: 'center',
        values: zones
      }
    ]
});

// this function is to change the navbar title when clicked on tab 
function navbarNameChanger(name){
    document.getElementById('s-navbar-title').innerHTML=name;
} 

// initialize map
mapboxgl.accessToken = 'pk.eyJ1IjoiZnVuY3Rpb25qYXJ2aXMyMCIsImEiOiJjazh0dDV0cWowMXNjM25rMjhuaG42aXdkIn0.-Zx7lvYRHE5PA5gdUV9M9w';
var map = new mapboxgl.Map({
container: 'location-map', // container id
style: 'mapbox://styles/mapbox/streets-v11?optimize=true',
center: [window.localStorage.getItem('userlng'), window.localStorage.getItem('userlat')], // starting position
zoom: 12 // starting zoom
});
// initializing marker
var marker = new mapboxgl.Marker();
map.on('click', function(e) {
    marker.remove();
    var lng = JSON.stringify(e.lngLat.wrap()['lng']);
    var lat = JSON.stringify(e.lngLat.wrap()['lat']);

    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=pk.eyJ1IjoiZnVuY3Rpb25qYXJ2aXMyMCIsImEiOiJjazh0dDV0cWowMXNjM25rMjhuaG42aXdkIn0.-Zx7lvYRHE5PA5gdUV9M9w`,function(result){
        var resultLen = result.features.length;
        var country = result.features[resultLen-1].place_name;
        console.log(result);
        if(country != "India"){
            appAlert('Please select the region from India Only!!','Warning!!','Ok');
        }else{
            var place = result.features[0].context[1].text;
            if(place  == "Thane" || place == "Mumbai" || place == "Navi Mumbai" || place=="Mumbai Suburban"){
                // set lat lng in localstorage to access it
                window.localStorage.setItem('selectedlng',lng);
                window.localStorage.setItem('selectedlat',lat);
                // set address in localstorage
                window.localStorage.setItem('selectedaddress',result.features[0].place_name)
                // add marker to show the user 
                marker.setLngLat([lng, lat])
                marker.addTo(map);
                document.getElementById('selected-address').innerHTML = `${result.features[0].place_name}`;
                document.getElementById('address-show-area').style.paddingTop = "3%";
                document.getElementById('address-show-area').style.paddingBottom = "3%";
                document.getElementById('address-show-area').style.display = "block";
            }else{
                document.getElementById('address-show-area').style.display = "none";
                appAlert('Please select the region from Mumbai, New-mumbai, Mumabi Suburban And Thane Only!!','Warning!!','Ok');
            }
        }
    })
});

// open camera and take picture
function openCamera(){
    // give width to open camera button 50% and then show preview button
    document.getElementById('open-camera-button').style.width = "50%";
    document.getElementById('open-camera-button').style.marginRight = "3%";
    // show preview image button
    document.getElementById('preview-image-button').style.display = "inline";
    var options ={
        quality: 50,
        sourceType: Camera.PictureSourceType.CAMERA,
        destinationType: Camera.DestinationType.FILE_URI,
        correctOrientation: true
    }
    navigator.camera.getPicture(saveImageToLocalstorage,function(msg){
        appAlert(msg,'something went wrong','Ok');
    },options);
     
}

// this function is to save image url in localstorage and set the preview image instance 
function saveImageToLocalstorage(data){
    // set localstorage variable currentAreaImage to image url
    window.localStorage.setItem('selectedimage',data);
    // creating preview image variable
    previewImageHolder = app.photoBrowser.create({
        photos : [
            {
                url: window.localStorage.getItem('selectedimage'),
                caption: 'please click on "open camera" button to reclick the image'
            }
        ],
        theme: 'light'
    });
}

// sending complaint 
function sendComplaint(){
    // first authenticate data
    var auth = authenticateComplaint();
    
    if(auth == 'empty'){
        // check for empty fields
        appAlert('Please fill all the fields!!','warning','Ok');
    }else if(auth == 'short_description'){
        // check for short description
        appAlert('Too short description (description will help us to proceed your request immediately)!!','warning','Ok');
    }else if(typeof(auth) == 'object'){
        $('#loading-gif').css("display","flex");
        // extracting data from object
        uuid = window.localStorage.getItem('uuid');
        description = auth.description;
        zone = auth.zone;
        imageurl = auth.imageurl;
        address = auth.address;
        lat = auth.lat;
        lng = auth.lng;
        
        // upload data to server 
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = imageurl.substr(imageurl.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.user_uuid = uuid;
        params.lat = lat;
        params.lng = lng;
        params.address = address;
        params.place_name = description;
        params.zone = zone;


        options.params = params;
        var ft = new FileTransfer();
        ft.upload(imageurl, "https://sweeperapi.000webhostapp.com/api/complaint/create.php",
            function(result) {
                $('#loading-gif').css("display","none");  
                var data = JSON.parse(result.response);       
                if(data.status == 204){
                    appAlert(data.message.toLowerCase(),'Warning!!','Ok');
                }else if(data.status == 200){ 
                    appAlert('Successfully submited the complaint!!','Complaint send','Ok');
                }else{
                    appAlert('Something went wrong','Try Again','Ok');
                }
                // reset the all fields
                resetSendComplaintPage();
                // remove marker 
                marker.remove();    
            },
            function(error) {
                $('#loading-gif').css("display","none");                  
                console.log(JSON.stringify(error));
                appAlert('Something went wrong!! please check your internet connection','Failed','Ok');  
                // reset the all fields
                resetSendComplaintPage();
                // remove marker 
                marker.remove();            
            }, options);
    }
}

// continues fetching of working complaint with interval of 20 seconds
window.setInterval(function(){
    // api to get working complaint
    $.get('https://sweeperapi.000webhostapp.com/api/complaint/userworkingcomplaint.php',{
        user_uuid: window.localStorage.getItem('uuid')
    },function(data,status){
        if(data.status == 204){
            setWorkingComplaintError(data.message);            
        }else{
            // get working status of complaint by making api request
            $.get('https://sweeperapi.000webhostapp.com/api/complaint/workingstatus.php',{
                complaint_id: data.id
            },function(result,status){
                if(status == 'success'){
                    // call working complaint method to show the complaint on main page
                    var workingstatus = result.message;
                    // complaint details
                    var imageurl = data.image_url;
                    var description = removeTags(data.place_name);
                    var address = data.address;
                    var zone = data.zone;
                    var complaintdate = formatDate(data.complaint_date);
                    var complainttime = formatTime(data.complaint_time);
                    // calling set working complaint method to structure it
                    setWorkingComplaint(imageurl,description,address,zone,workingstatus,complaintdate,complainttime); 
                }
            }).fail(function(error){
                appAlert('Something went wrong!! please check your internet connection','Failed','Ok');
            });
        }
        console.log(data);
    }).fail(function(error){
        appAlert('Something went wrong!! please check your internet connection','Failed','Ok');
    });
},20000);

// continues fetching of all complaints in interval of 1 minute
window.setInterval(function(){
 // all complaint initial load
    $.get('https://sweeperapi.000webhostapp.com/api/complaint/getfinishedcomplaints.php',{
        user_uuid: window.localStorage.getItem('uuid')
    },function(data,status){

        if(data.status == 204){
            // if status is 204 then 
            setAllComplaintError(data.message);
        }else{
            // first set all the popup windows
            addComplaintPopups(data,data.count);
            // pass the data and data count variable top setAllComplaint() function
            setAllComplaint(data,data.count);
        }

    }).fail(function(){
        appAlert('Something went wrong!! please check your internet connection','Failed','Ok');                
    });
},60000)


//  click to open notification menu
$(document).ready(function(){
    // click to open menu 
    $('body').click(function(event){
        var notification_btn_id = event.target.id;    
        console.log(notification_btn_id)     
        if(notification_btn_id == "notification-menu-btn"){
            $('#notification-context-menu').toggle('slide');
            $('#notification-context-menu').css("display","flex");                                
        }else if(notification_btn_id == "notification-context-menu" || notification_btn_id == "notification-transperent-body"){
            // do nothing
        }else{
            $('#notification-context-menu').css("display","none");       
        }
    })
});

// preview image popup
$('.pb-standalone-captions').on('click', function () {
    previewImageHolder.open();
});