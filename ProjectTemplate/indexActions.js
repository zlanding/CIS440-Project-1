//< !--YOUR OWN JAVASCRIPT CAN GO RIGHT HERE-- >
function TestButtonHandler() {
    var webMethod = "ProjectServices.asmx/TestConnection";
    var parameters = "{}";
//jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            alert(responseFromServer);
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

//This is the initial function that sets up the first page we see.
function SetUp() {
   showPanel('logonPanel');
}


//Method for Logging on
function Logon() {
    var id = document.getElementById("logonID").value;
    var pass = document.getElementById("logonPass").value;
    var webMethod = "ProjectServices.asmx/LogOn";
    var parameters = "{\"uid\":\"" + encodeURI(id) + "\", \"pass\":\"" + encodeURI(pass) + "\"}";

    //jQuery ajax method
    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var responseFromServer = msg.d;
            if (responseFromServer == true) {
            //Upon successful login attempt, erase username, password and uncheck checkbox for Show Pass
                document.getElementById("logonID").value = "";
                document.getElementById("logonPass").value = "";
                document.getElementById("showPasswordCheckBox").checked = false;
                //Hide all loggedOut elements
                showPanel('jobsPanel');
                //Display all loggedIn elements
                alert("Logged in!");
            }
            else {
                alert("Failed to log in - bad credentials... Re-Check Username and Password");
                //Upon failed login attempt set password to nothing but keep username
                document.getElementById("logonPass").value = "";
            }
        },
        error: function (e) {
            alert("this code will only execute if javascript is unable to access the webservice");
        }
    });
}

function CreateNewJob() {
    showPanel('newJobPanel');
}
//Functioned called for logging out which should end session and change visibility
function Logout() {
    //First step would be to change the visibility back to the Log On Screen
    showPanel('logonPanel');
    //****Next few steps are to disconnect client from server (GASPAR'S JOB)****
}   

//The function connected to the checkbox which shows Password
function ShowPassword() {
    var x = document.getElementById("logonPass");
    if (x.type === "password") {
        x.type = "text";
    }
    else {
        x.type = "password";
    }
}

//passes account info to the server, to create an account request
function CreateAccount(id, pass, fname, lname, phone, email, address, city, state, zip) {
    var webMethod = "ProjectServices.asmx/RequestAccount";
    var parameters = "{\"uid\":\"" + encodeURI(id) + "\",\"pass\":\"" + encodeURI(pass) + "\",\"firstName\":\"" + encodeURI(fname) + "\",\"lastName\":\"" +
        encodeURI(lname) + "\",\"phone\":\"" + encodeURI(phone) + "\",\"email\":\"" + encodeURI(email) + "\",\"address\":\"" + encodeURI(address) +
        "\",\"city\":\"" + encodeURI(city) + "\",\"state\":\"" + encodeURI(state) + "\",\"zip\":\"" + encodeURI(zip) + "\"}";

    $.ajax({
        type: "POST",
        url: webMethod,
        data: parameters,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            var response_from_server = msg.d;
            if (response_from_server == true) {
                alert("New Account Created");
            }
            else {
                alert("New Account Not Created For Some Reason..");
            }
            showPanel('logonPanel');
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

//we're using a stacked card approach for our main viewing area
//this array holds the ids of our cards and the method
//allows us to easly switch the interface from one to the other
var contentPanels = ['logonPanel', 'newAccountPanel', 'jobsPanel', 'newJobPanel'];
//this function toggles which panel is showing, and also clears data from all panels
function showPanel(panelId) {
    clearData();
    for (var i = 0; i < contentPanels.length; i++) {
        if (panelId == contentPanels[i]) {
            $("#" + contentPanels[i]).css("visibility", "visible");
        }
        else {
            $("#" + contentPanels[i]).css("visibility", "hidden");
        }
    }
}

//Function that gets all elements by ClassName and either hides or displays them.
/**
function HideOrDisplayElements(className, hideOrDisplay) {
    //Convert all letters to UpperCase (so it doesnt matter if the value passed is lowercase or uppercase)
    tempHorD = hideOrDisplay.toUpperCase();

    elements = document.getElementsByClassName(className);
    //Loop through every element with the class name
    for (var i = 0; i < elements.length; i++) {
        //DISPLAY all elements
        if (tempHorD == "DISPLAY") {
            elements[i].style.display = "block";
        }
        //HIDE all elements
        else if (tempHorD == "HIDE") {
            elements[i].style.display = "none";
        }
        //Some sort of catcher to let developer know they passed an incorrect value using this function
        else {
            alert("ALERT THE DEVELOPER THAT WHILE ATTEMPTING TO USE THE 'HideOrDisplayElements' FUNCTION THEY DID NOT PASS EITHER HIDE OR DISPLAY AS SECOND PARAMETER");
        }
    }
} */

//this function clears data from all panels
function clearData() {
    clearNewAccount();
    clearLogon();
}

//resets the new account inputs
function clearNewAccount() {
    $('#newLogonId').val("");
    $('#newLogonPassword').val("");
    $('#newLogonFName').val("");
    $('#newLogonLName').val("");
    $('#newLogonPhone').val("");
}

//resets the logon inputs
function clearLogon() {
    $('#logonID').val("");
    $('#logonPass').val("");
}

//this function grabs accounts and loads our account window
function LoadJobs() {
    var webMethod = "AccountServices.asmx/GetJobs";
    $.ajax({
        type: "POST",
        url: webMethod,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (msg) {
            if (msg.d.length > 0) {
                //let's put our accounts that we get from the
                //server into our accountsArray variable
                //so we can use them in other functions as well
                accountsArray = msg.d;
                //this clears out the div that will hold our account info
                $("#jobsBox").empty();
                //again, we assume we're not an admin unless we see data from the server
                //that we know only admins can see
                admin = false;
                for (var i = 0; i < accountsArray.length; i++) {
                    //we grab on to a specific html element in jQuery
                    //by using a  # followed by that element's id.
                    var acct;
                    //if they have access to admin-level info (like userid and password) then
                    //create output that has an edit option
                    if (accountsArray[i].userId != null) {
                        acct = "<div class='accountRow' id='acct" + accountsArray[i].id + "'>" +
                            "<a class='nameTag' href='mailto:" + accountsArray[i].email + "'>" +
                            accountsArray[i].firstName + " " + accountsArray[i].lastName +
                            "</a> <a href='#' onclick='LoadAccount(" + accountsArray[i].id + ")' class='optionsTag'>edit</a></div><hr>"
                        admin = true;
                    }
                    //if not, then they're not an admin so don't include the edit option
                    else {
                        acct = "<div class='accountRow' id='acct" + accountsArray[i].id + "'>" +
                            "<a class='nameTag' href='mailto:" + accountsArray[i].email + "'>" +
                            accountsArray[i].firstName + " " + accountsArray[i].lastName +
                            "</a></div><hr>"
                    }
                    $("#accountsBox").append(
                        //anything we throw at our panel in the form of text
                        //will be added to the contents of that panel.  Here
                        //we're putting together a div that holds info on the
                        //account as well as an edit link if the user is an admin
                        acct
                    );
                }
            }
            //we're showing the account window, so let's track that...
            accountWindowShowing = true;
            //...because the ShowMenu function behaves differently depending on
            //if the account window is showing or not
            ShowMenu();
        },
        error: function (e) {
            alert("boo...");
        }
    });
}

//END OF YOUR OWN JAVASCRIPt