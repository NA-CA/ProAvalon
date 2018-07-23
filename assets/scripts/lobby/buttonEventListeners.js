
function redButtonFunction() {
    if (document.querySelector("#red-button").classList.contains("disabled") === false) {
        if (isSpectator === true) {

        }
        else if (gameStarted === false) {
            // Set the kick modal content
            var str = "<h4>Select the players you want to kick.</h4>";

            str += '<div class="btn-group-vertical" data-toggle="buttons">';

            for (var i = 0; i < roomPlayersData.length; i++) {
                str += '<label class="btn btn-mine">';

                str += '<input name="' + roomPlayersData[i].username + '" id="' + roomPlayersData[i].username + '" type="checkbox" autocomplete="off">' + roomPlayersData[i].username;

                str += "</label>";
                str += "<br>";
            }

            str += '</div>';

            $("#kickModalContent")[0].innerHTML = str;
        }
        else {
            if (gameData.phase === "voting") {
              // console.log("Voted reject");
                socket.emit("pickVote", "reject");
            }
            else if (gameData.phase === "missionVoting") {
              // console.log("Voted fail");


                if (gameData.alliance === "Resistance") {
                  // console.log("You aren't a spy! You cannot fail a mission!");
                    // socket.emit("missionVote", "succeed");
                    showDangerAlert("You are resistance. Surely you want to succeed!");
                } else {
                    socket.emit("missionVote", "fail");
                }

            }
        }
        $("#mainRoomBox div").removeClass("highlight-avatar");
    }
}

function greenButtonFunction() {
    //if button is not disabled: 
    if (document.querySelector("#green-button").classList.contains("disabled") === false) {
        if (isSpectator === true) {
            socket.emit("join-game", roomId);
        }
        else if (gameStarted === false) {
            socket.emit("startGame", getOptions());
        }
        else {
            if (gameData.phase === "picking") {
                var arr = getHighlightedAvatars();
              // console.log(arr);
                socket.emit("pickedTeam", arr);
            }
            else if (gameData.phase === "voting") {
              // console.log("Voted approve");
                socket.emit("pickVote", "approve");
            }
            else if (gameData.phase === "missionVoting") {
              // console.log("Voted succeed");
                socket.emit("missionVote", "succeed");
            }
            else if (gameData.phase === "assassination") {
              // console.log("Assasinate!!!");
                socket.emit("assassinate", getHighlightedAvatars());
            }
            else if (gameData.phase === "lady") {
              // console.log("Lady: " + getHighlightedAvatars()[0]);
                socket.emit("lady", getHighlightedAvatars()[0]);
            }

        }

        $("#mainRoomBox div").removeClass("highlight-avatar");
    }
}



//======================================
//BUTTON EVENT LISTENERS
//======================================
document.querySelector("#green-button").addEventListener("click", greenButtonFunction);
document.querySelector("#red-button").addEventListener("click", redButtonFunction);

//re-draw the game screen when the modal is closed to update the roles in the center well.
$('#roleOptionsModal').on('hidden.bs.modal', function (e) {
    draw();
    console.log("test");
})

// Set the event listener for the button
$("#kickButton")[0].addEventListener("click", function () {
    var players = getKickPlayers();

    //kick the selected players one by one
    for (var key in players) {
        if (players.hasOwnProperty(key)) {
            socket.emit("kickPlayer", key);
          // console.log("kick player: " + key);
        }
    }
});

//new ROOM CODE
document.querySelector("#newRoom").addEventListener("click", function () {
    if (inRoom === false) {
        socket.emit("newRoom");
      // console.log("RESET GAME DATA ON CREATE ROOM");
        resetAllGameData();
        inRoom = true;
    }
});

document.querySelector("#danger-alert-box-button").addEventListener("click", function () {

    if(document.querySelector("#danger-alert-box").classList.contains("disconnect")){

    }
    else{
        document.querySelector("#danger-alert-box").classList.add("inactive-window");
        document.querySelector("#danger-alert-box-button").classList.add("inactive-window");
    }
    
});

document.querySelector("#success-alert-box-button").addEventListener("click", function () {
    document.querySelector("#success-alert-box").classList.add("inactive-window");
    document.querySelector("#success-alert-box-button").classList.add("inactive-window");
});

document.querySelector("#backButton").addEventListener("click", function () {
    changeView();
    socket.emit("leave-room", "");

    console.log("LEAVE");
    resetAllGameData();
});

document.querySelector("#claimButton").addEventListener("click", function () {
    //INCOMPLETE
    socket.emit("claim", "");
});