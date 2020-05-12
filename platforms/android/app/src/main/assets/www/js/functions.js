/* this file contains all the functions that are required for authentication and data fetching from db

*/
// variables
var zones = [];
// function is to validate the email
function validateEmail(email){
    var validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return validate.test(email);
}

// this function is to validate password for following conditions
// 1. length
// 2. it should not be email
// 3. it should not be adhaar number
// 4. it should not be mobile number
// 5. at least one letter one number 
function validatePassword(password,email,adhaar,mobile,fullname){
    var validate = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if(password == email || password == adhaar || password == mobile || password == fullname){
        return 'previous_info';
    }else if(!validate.test(password)){
        return 'validation';
    }else{
        return 'validated';
    }
}

// this function is to authenticate the data that is entered in register fields 
function registerAuth(){
    // register variables
    // get user data by ids
    fullname = document.getElementById('registername').value;
    mobile = document.getElementById('registermobile').value;
    email = document.getElementById('registeremail').value;
    adhaar = document.getElementById('registeradhaar').value;
    password = document.getElementById('registerpassword').value;
    userzone = document.getElementById('registeruserzone').value;

    if(fullname=="" || mobile=="" || email=="" || adhaar=="" || password=="" || userzone==""){
        // first check if all empty or not
        return 'empty';
    }else if(mobile.length < 10 || mobile.length > 10){
        // checking if mobile number is less than 10 or greater than 10
        return 'mobile';
    }else if(!validateEmail(email)){
        // checking email id with regex
        return 'email';
    }else if(adhaar.length > 12 || adhaar.length < 12 ){
        // checking adhaar info 
        return 'adhaar';
    }else if(validatePassword(password,email,adhaar,mobile,fullname) != 'validated'){
        return 'password';
    }else{
        credentialObject = {
            fullname: fullname,
            mobile: mobile,
            email: email,
            adhaar: adhaar,
            password: password,
            userzone: userzone
        } ;
        return credentialObject;
    }
}

// this funcion is to verify the user
function verifyUser(){
    // first get all verification parameters
    email = document.getElementById('verifyemail').value;
    password = document.getElementById('verifypassword').value;
    vkey = document.getElementById('verifyvkey').value;  
    if(email=="" || password=="" || vkey==""){
        // first check if all empty or not
        return 'empty';
    }else if(!validateEmail(email)){
        // checking email id with regex
        return 'email';
    }else{
        credentialObject = {
            email: email,
            password: password,
            vkey: vkey
        } ;
        return credentialObject;
    }
}

// this funcion is to login the user
function loginUser(){
    // first get all login parameters
    email = document.getElementById('loginemail').value;
    password = document.getElementById('loginpassword').value;
    if(email=="" || password==""){
        // first check if all empty or not
        return 'empty';
    }else if(!validateEmail(email)){
        // checking email id with regex
        return 'email';
    }else{
        credentialObject = {
            email: email,
            password: password
        } ;
        return credentialObject;
    }
}

// function to authenticate send complaint form
function authenticateComplaint(){
    // get all complaint variables
    var description = document.getElementById('complaintdescription').value;
    var zone = document.getElementById('zone-picker').value;
    var imageurl = window.localStorage.getItem('selectedimage');
    var address = window.localStorage.getItem('selectedaddress');
    var lat = window.localStorage.getItem('selectedlat');
    var lng = window.localStorage.getItem('selectedlng');
    if(description == "" || zone == "" /*|| imageurl == null*/ || address == null || lat == null || lng == null){
        return 'empty';
    }else if(description.length < 50){
        return 'short_description';
    }else{
        complaintData = {
            description: description,
            zone: zone,
            imageurl: imageurl,
            address: address,
            lat: lat,
            lng: lng
        }
        return complaintData;
    }
}

// this function is to reset the fields from send complaint page
function resetSendComplaintPage(){
    window.localStorage.removeItem('selectedaddress');
    window.localStorage.removeItem('selectedimage');
    window.localStorage.removeItem('selectedlat');
    window.localStorage.removeItem('selectedlng');
    window.localStorage.removeItem('selectedaddress');
    document.getElementById('address-show-area').style.display = "none";
    document.getElementById('complaintdescription').value = "";
    var zone = document.getElementById('zone-picker').value = "";

    // reset camera options
    document.getElementById('open-camera-button').style.width = "100%";
    document.getElementById('open-camera-button').style.marginRight = "0%";
    // hide preview image button
    document.getElementById('preview-image-button').style.display = "none";
    
}

// this function is to get the formatable date
function formatDate(date){
    var mydate = new Date(date);
    var day = mydate.getDate();
    var month = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"][mydate.getMonth()];
    var formatedDate = month + ' '+day+',' + mydate.getFullYear();
    return formatedDate;
}

// this function is to get the formatable time
function formatTime(time){
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
  if (time.length > 1) { // If time format correct
    time = time.slice (1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join (''); // return adjusted time or original string
}

// function remove html tags
function removeTags(str)
{
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
    return str.replace( /(<([^>]+)>)/ig, '');
}

// function to print working complaint on page
function setWorkingComplaint(imageurl,description,address,zone,workingstatus,complaintdate,complainttime){
    var color = "";
    if(workingstatus == 'Underprocess'){
        color = "indianred";
    }else{
        color = "orange";
    }
    var set_working_complaint = `
    <div class="card demo-card-header-pic">
        <div style="background-image:url(https://sweeperapi.000webhostapp.com/api/complaint/uploads/${imageurl})" class="card-header align-items-flex-end">Area Image</div>
        <div class="card-content card-content-padding">
        <p class="date"><b>Requested On : </b> ${complaintdate} / ${complainttime}</p>
        <p><b>Description :</b></p>                     
        <p>${description} </p>
        <p><b>Address :</b></p>                     
        <p>${address}</p>
        <div class="extra-info-working-complaint">
            <p><b>Zone : </b>${zone}</p>
            <p><b>Status : </b><span style="background: ${color}">${workingstatus}</span></p>
        </div>       
        </div>
        <div class="card-footer">
        <p>Expected time rquired to clean is 24hrs we will notify you after cleaning</p>
        </div>
    </div>
    `
    // set the working complaint in div
    document.getElementById('working-complaint-content').innerHTML = set_working_complaint;
    // remove marginn from top
    document.getElementById('working-complaint-tab').style.marginTop = "0%";
    
}

// this function is to set error on page of working complaint
function setWorkingComplaintError(message){
    var set_working_complaint_error = `
        <div id="working-complaint-error">
            <p style="text-align: center;">${message}</p>
        </div>
    `;
    // set the working complaint error in div
    document.getElementById('working-complaint-content').innerHTML = set_working_complaint_error;
    // set margin from top
    document.getElementById('working-complaint-tab').style.marginTop = "50%";
    
}



// this function is to set all complaints tab 
function setAllComplaint(data,count){
    // build a html string to insert in all complaints tab
    var set_all_complaints = '';
    
    for (let index = 0; index < count; index++) {
        // get data 
        sweeperuuid = data.data[index].sweeper_uuid;
        adminid = data.data[index].admin_id;
        complaintid = data.data[index].complaint_id;
        imageurl = data.data[index].image_url;
        description = data.data[index].placename;
        zone = data.data[index].zone;
        address = data.data[index].address;
        complaintdate = formatDate(data.data[index].complaint_date);
        complainttime = formatTime(data.data[index].complaint_time);
        complaintfinishdate = formatDate(data.data[index].complaint_finish_date);
        complaintfinishtime = formatTime(data.data[index].complaint_finish_time);

        // concatinate string html
        set_all_complaints = set_all_complaints + `
            <div class="card demo-card-header-pic"> 
                <div class="card-content card-content-padding">
                <p class="date"><b>Requested On : </b> ${complaintdate} / ${complainttime}</p>
                <p><b>Description :</b></p>                     
                <p>${description}</p>      
                </div>
                <div class="card-footer">
                <a class="button button-fill popup-open" href="#" data-popup=".popup-all-complaints-id-${complaintid}">View More info</a>
                </div>
            </div>
        `;
        
    }
    // set all complaints to all complaint tab
    document.getElementById('all-complaint-content').innerHTML = set_all_complaints;    

    // remove margin from top
    document.getElementById('all-complaints-tab').style.marginTop = "0%";
    

}

// this function is to set the error when no complaints are found
function setAllComplaintError(message){
    var set_all_complaints_error = `
        <div id="all-complaint-error">
            <p style="text-align: center;">${message}</p>
        </div>
    `;
    // set the working complaint error in div
    document.getElementById('all-complaint-content').innerHTML = set_all_complaints_error;
    // set margin from top
    document.getElementById('all-complaints-tab').style.marginTop = "50%";
}

// this function is to set the modal content based on button click
function addComplaintPopups(data,count){
    var add_complaint_popups = '';
    
    for (let index = 0; index < count; index++) {
        // get data 
        sweeperuuid = data.data[index].sweeper_uuid;
        adminid = data.data[index].admin_id;
        complaintid = data.data[index].complaint_id;
        imageurl = data.data[index].image_url;
        description = data.data[index].placename;
        zone = data.data[index].zone;
        address = data.data[index].address;
        complaintdate = formatDate(data.data[index].complaint_date);
        complainttime = formatTime(data.data[index].complaint_time);
        complaintfinishdate = formatDate(data.data[index].complaint_finish_date);
        complaintfinishtime = formatTime(data.data[index].complaint_finish_time);

        // concatinate string html
        add_complaint_popups = add_complaint_popups + `
            <div class="popup popup-all-complaints-id-${complaintid}" style="overflow-y: scroll">
                <div class="block">
                    <p style="display: flex;justify-content: flex-end;margin: 0;"><a class="link popup-close" href="#"><img src="../img/icons/close.png" alt=""></a></p>
                    <h2 style="margin-top: 0;">More Info</h2>
                    <div class="card demo-card-header-pic" style="box-shadow: none">
                        <div style="background-image:url(https://sweeperapi.000webhostapp.com/api/complaint/uploads/${imageurl})" class="card-header align-items-flex-end">Area Image</div>
                        <div class="card-content card-content-padding" style="padding: 0px; padding-top: 20px; padding-bottom: 10px;">
                            <p class="date"><b>Requested On : </b> ${complaintdate} / ${complainttime} </p>
                            <p class="date"><b>Finished On : </b> ${complaintfinishdate} / ${complaintfinishtime} </p>              
                            <p><b>Description :</b></p>                     
                            <p>${description}</p>
                            <p><b>Address :</b></p>                     
                            <p>${address}</p>
                            <div class="extra-info-working-complaint">
                            <p><b>Zone : </b>${zone}</p>
                            <p><b>Status : </b><span style="background: #4cd964;">Finished</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
    }
    // set all complaints to all complaint tab
    document.getElementById('single-complaint-popups').innerHTML = add_complaint_popups;
}

// function to assign zone to fields 
function extractZone(data,count){
    // loop over count to make new array 
    for (let index = 0; index < count; index++) {
        zones[index] = removeTags(data.data[index].name).replace('\t','');
    }
}

// function is to assign the array of zone to the choice box
function assignZone(){
    return zones;
}

// function to assign the zone to register choice box
function assignZoneToRegisterChoice(data,count){
    var set_register_zone_choice = "<option value=''>Select Your Zone</option>";
    // loop over count to make new array 
    for (let index = 0; index < count; index++) {
        var zone = removeTags(data.data[index].name).replace('\t','');
        set_register_zone_choice = set_register_zone_choice + `
            <option value='${zone}'>${zone}</option>
        `;
    }

    // set zone to choice box 
    document.getElementById('registeruserzone').innerHTML = set_register_zone_choice;
}

// this function is to get the alert
function appAlert(message,title,button){
    navigator.notification.alert(message,function(){},title,button);
}
