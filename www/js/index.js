
var firstPageUrl = "index.html";
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    onDeviceReady: function() {   
        // store api_url in localstorage
        window.localStorage.setItem('API_URL','http://sweeperapi.kshitijskincare.com');
        // get uuid and store it in localstorage
        window.localStorage.setItem("uuid",device.uuid);
        // get lat long and store it in localstorage
        navigator.geolocation.getCurrentPosition(function(position){
        // store lat in localstorage
        window.localStorage.setItem('userlat',position.coords.latitude);
        // store lng in localstorage
        window.localStorage.setItem('userlng',position.coords.longitude);
        // get the zones from api
        $.get(window.localStorage.getItem('API_URL')+'/api/zone/readall.php',function(data){
          // zones
            count = data.count;
            // call function to extract zone
            assignZoneToRegisterChoice(data,data.count);
        }).fail(function(error){
            appAlert('Something went wrong!! please check your internet connection','Failed','Ok');                
        });
      },function(){

      },{enableHighAccuracy: true });

      // notification subscription
        // onesignal notifications
        var notificationOpenedCallback = function(jsonData) {
          console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
      };
      
      window.plugins.OneSignal
          .startInit("e8dbd8b6-5723-4729-bffe-c21e846d55be")
          .handleNotificationOpened(notificationOpenedCallback)
          .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
          .endInit();

    },
    
  };

// function is to signup 
function register(){
  // calling register auth function 
  auth = registerAuth();
  if(auth == 'empty'){
    appAlert('Please fill all the fields','Warning!!','Ok');
  }else if(auth == 'mobile'){
    appAlert('Invalid mobile number','Warning!!','Ok');
  }else if(auth == 'email'){
    appAlert('Invalid Email-id','Warning!!','Ok');
  }else if(auth == 'adhaar'){
    appAlert('Invalid Adhaar-Number','Warning!!','Ok');
  }else if(auth == 'password'){
    appAlert('Invalid Password(follow conditions)\n 1. It shouldn\'t be mobile,email,adhaar and name\n 2. it should contain (Minimum eight characters, at least one letter, one number and one special character) ','Warning!!','Ok');
  }else if(typeof(auth) == 'object'){
    $('#loading-gif').css("display","flex");
    // get uuid from localstorage
    var uuid = window.localStorage.getItem('uuid');
    // get lat lng from localstorage and seperate them by (,)
    var location = window.localStorage.getItem('userlat')+","+window.localStorage.getItem('userlng');
    // for testing purpose
    if(uuid == 'null'){
      uuid = Math.random();
    }
    // get address from api call
    $.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${window.localStorage.getItem('userlng')},${window.localStorage.getItem('userlat')}.json?access_token=pk.eyJ1IjoiZnVuY3Rpb25qYXJ2aXMyMCIsImEiOiJjazh0dDV0cWowMXNjM25rMjhuaG42aXdkIn0.-Zx7lvYRHE5PA5gdUV9M9w`,function(result){
      // store address in localstorage
      window.localStorage.setItem('address',result.features[0].place_name);
    });
    // first make api call and then set register == 1 in localstorage
    $.post(window.localStorage.getItem('API_URL')+'/api/user/create.php',{
      uuid: uuid,
      name: auth.fullname,
      mobile: auth.mobile,
      email: auth.email,
      address: window.localStorage.getItem('address'),
      adhaar: auth.adhaar,
      location: location,
      password: auth.password,
      zone: auth.userzone
    },function(data,status){
      if(status == 'success'){
        // get rid of spinner
        $('#loading-gif').css("display","none");
        // set register == 1 in localstorage 
        window.localStorage.setItem("register","1");
        // redirect to the verify page for verification 
        window.location.href="verify.html";
      }
    })
    .fail(function(error){
      // get rid of spinner
      $('#loading-gif').css("display","none");
      appAlert('You already have an account with us!!please login',error.responseJSON.message,'Ok');
    });
  }
}

// function is to verify user
function verify(){
  $('#loading-gif').css("display","flex");
  // verify user
  auth = verifyUser();
  if(auth == 'empty'){
    appAlert('Please fill all the fields','Warning!!','Ok');
  }else if(auth == 'email'){
    appAlert('Invalid email-id format','Warning!!','Ok');
  }else if(typeof(auth) == 'object'){
    // first get uuid from localstorage
    var uuid = window.localStorage.getItem('uuid');
    // send post request to verify the user
    $.post(window.localStorage.getItem('API_URL')+'/api/user/verify.php',{
      uuid: uuid,
      email: auth.email,
      password: auth.password,
      vkey: auth.vkey
    },function(data,status){
      if(status == 'success'){
        // get rid of spinner
        $('#loading-gif').css("display","none");
        // set verify == 1 in localstorage 
        window.localStorage.setItem("verify","1");
        // call function to register notificant
        window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
          $.get(window.localStorage.getItem('API_URL')+'/api/notification_auth/register.php',{
            notifier: 'user',
            uuid: window.localStorage.getItem('uuid'),
            notification_id: status.subscriptionStatus.userId
          },function(data){
              if(data.status == 204){   
                  console.log(status.subscriptionStatus.userId);                          
                  conosle.log(data.message);                
              }else{
                  conosle.log(status.subscriptionStatus.userId);
                  conosle.log(data.message);
              }
              window.localStorage.setItem('notification_id',status.subscriptionStatus.userId);
          }).fail(function(error){   
              alert('something went wrong please clear data and login again');    
          });
        });
        // redirect to the main page 
        window.location.href="main.html";
      }
    })
    .fail(function(error){
      // get rid of spinner
      $('#loading-gif').css("display","none");
      appAlert('You are not register with us!!','Please register!!','Ok');
    });
  }
}

// function is to login user
function login(){
  $('#loading-gif').css("display","flex");
  // login user
  auth = loginUser();
  if(auth == 'empty'){
    appAlert('Please fill all the fields','Warning!!','Ok');
  }else if(auth == 'email'){
    appAlert('Invalid email-id format','Warning!!','Ok');
  }else if(typeof(auth) == 'object'){
    // first get uuid from localstorage
    var uuid = window.localStorage.getItem('uuid');
    // send post request to login the user
    $.post(window.localStorage.getItem('API_URL')+'/api/user/login.php',{
      uuid: uuid,
      email: auth.email,
      password: auth.password
    },function(data,status){
      if(status == 'success'){
        // check if uuid is diffrent then store uuid from db
        if(window.localStorage.getItem('uuid')!=data.uuid){
          window.localStorage.setItem('uuid',data.uuid);
        }
        // get rid of spinner
        $('#loading-gif').css("display","none");
        // set login == 1 in localstorage 
        window.localStorage.setItem("login","1");

        // call function to register notificant
        window.plugins.OneSignal.getPermissionSubscriptionState(function(status) {
          $.get(window.localStorage.getItem('API_URL')+'/api/notification_auth/register.php',{
            notifier: 'user',
            uuid: window.localStorage.getItem('uuid'),
            notification_id: status.subscriptionStatus.userId
          },function(data){
              if(data.status == 204){   
                  console.log(status.subscriptionStatus.userId);                          
                  conosle.log(data.message);                
              }else{
                  conosle.log(status.subscriptionStatus.userId);
                  conosle.log(data.message);
              }
              window.localStorage.setItem('notification_id',status.subscriptionStatus.userId);
          }).fail(function(error){   
              alert('something went wrong please clear data and login again');    
          });
        });
        // redirect to the main page  
        window.location.href="main.html";
      }
    })
    .fail(function(error){
      // get rid of spinner
      $('#loading-gif').css("display","none");
      appAlert('You are not register with us!!','Please register','Ok');
    });
  }
}

// function for going to signup page
function gotoRegister($url){
  window.location.href = $url;
}
// function for going to signup page
function gotoLogin($url){
  window.location.href = $url;
}
