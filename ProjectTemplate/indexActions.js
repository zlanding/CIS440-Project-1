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
                //Upon successful login attempt, erase username and password
                    document.getElementById("logonID").value = "";
                    document.getElementById("logonPass").value = "";
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