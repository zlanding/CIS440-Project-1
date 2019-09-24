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
    //Initially showing all of the "logged out" elements
    HideOrDisplayElements("loggedOut", "display");
    //Initially showing none of the "logged in" elements and only displaying the "logged Out elements"
    HideOrDisplayElements("loggedIn", "hide");
}

//Function that gets all elements by ClassName and either hides or displays them.
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
                HideOrDisplayElements("loggedOut", "hide");
                //Display all loggedIn elements
                HideOrDisplayElements("loggedIn", "display");
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

//Functioned called for logging out which should end session and change visibility
function Logout() {
    //First step would be to change the visibility back to the Log On Screen
    HideOrDisplayElements("loggedIn", "hide");
    HideOrDisplayElements("loggedOut", "Display");
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


//END OF YOUR OWN JAVASCRIPt