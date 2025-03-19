function makeRequest() {
    console.log ("making request")
    var username = document.getElementById("username").value 
    var password = document.getElementById("password").value

    console.log("Try to log in with " + username + " | " + password)

    var dataToSend = {
        "user": username,
        "pswrd": password
    }

    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4) {
            var data = JSON.parse(this.response)

            console.log(data)

            if (this.status == 200){
                window.location.href = "/game"
            }else{
                document.getElementById("message").innerHTML = data.message
            }
        }
    }
    request.open("POST", "/login", true); 

    request.setRequestHeader("Content-Type", "application/json"); 

    request.send(JSON.stringify(dataToSend));
}; 

function logout() {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200){
            window.location.href = "/logout"
        }
    }
    request.open("GET", "/lobby", true); 
    request.send()
}