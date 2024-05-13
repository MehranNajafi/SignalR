let lbl_houseJoined = document.getElementById("lbl_houseJoined");

let btn_un_gryffindor = document.getElementById("btn_un_gryffindor");
let btn_un_slytherin = document.getElementById("btn_un_slytherin");
let btn_un_hufflepuff = document.getElementById("btn_un_hufflepuff");
let btn_un_ravenclaw = document.getElementById("btn_un_ravenclaw");
let btn_gryffindor = document.getElementById("btn_gryffindor");
let btn_slytherin = document.getElementById("btn_slytherin");
let btn_hufflepuff = document.getElementById("btn_hufflepuff");
let btn_ravenclaw = document.getElementById("btn_ravenclaw");

let trigger_gryffindor = document.getElementById("trigger_gryffindor");
let trigger_slytherin = document.getElementById("trigger_slytherin");
let trigger_hufflepuff = document.getElementById("trigger_hufflepuff");
let trigger_ravenclaw = document.getElementById("trigger_ravenclaw");
//create connection
var connectionhousegroup = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/housegroup", signalR.HttpTransportType.WebSockets).build();

//connect to methods that hub invokes aka receive notifications from hub
btn_gryffindor.addEventListener("click", function (event) {
    connectionhousegroup.invoke("JoinHouse", "Gryffindor")
    event.preventDefault();
});
btn_slytherin.addEventListener("click", function (event) {
    connectionhousegroup.invoke("JoinHouse", "Slytherin")
    event.preventDefault();
});
btn_hufflepuff.addEventListener("click", function (event) {
    connectionhousegroup.invoke("JoinHouse", "Hufflepuff")
    event.preventDefault();
});
btn_ravenclaw.addEventListener("click", function (event) {
    connectionhousegroup.invoke("JoinHouse", "Ravenclaw")
    event.preventDefault();
});
btn_un_gryffindor.addEventListener("click", function (event) {
    connectionhousegroup.invoke("LeaveHouse", "Gryffindor")
    event.preventDefault();
});
btn_un_slytherin.addEventListener("click", function (event) {
    connectionhousegroup.invoke("LeaveHouse", "Slytherin")
    event.preventDefault();
});
btn_un_hufflepuff.addEventListener("click", function (event) {
    connectionhousegroup.invoke("LeaveHouse", "Hufflepuff")
    event.preventDefault();
});
btn_un_ravenclaw.addEventListener("click", function (event) {
    connectionhousegroup.invoke("LeaveHouse", "Ravenclaw")
    event.preventDefault();
});
trigger_gryffindor.addEventListener("click", function (event) {
    connectionhousegroup.send("TriggerHouseNotify", "Gryffindor")
    event.preventDefault();
});
trigger_slytherin.addEventListener("click", function (event) {
    connectionhousegroup.invoke("TriggerHouseNotify", "Slytherin")
    event.preventDefault();
});
trigger_hufflepuff.addEventListener("click", function (event) {
    connectionhousegroup.invoke("TriggerHouseNotify", "Hufflepuff")
    event.preventDefault();
});
trigger_ravenclaw.addEventListener("click", function (event) {
    connectionhousegroup.invoke("TriggerHouseNotify", "Ravenclaw")
    event.preventDefault();
});



//invoke hub method aka send notification to hub
connectionhousegroup.on("newMemberJoinedGroup", (hostname) => {
    toastr.info(`someone subscribed to : ${hostname}`);
});
connectionhousegroup.on("memberLeavedGroup", (hostname) => {
    toastr.warning(`someone unsubscribed from : ${hostname}`);
});
connectionhousegroup.on("triggerHouseNotify", (hostname) => {
    toastr.info(`a notification send to : ${hostname}`);
});

connectionhousegroup.on("subscriptionStatus", (strGroupsJoind, hostname, hasSubscribed) => {
    lbl_houseJoined.innerText = strGroupsJoind;
    if (hasSubscribed) {
        switch (hostname) {
            case 'gryffindor':
                btn_gryffindor.style.display = "none";
                btn_un_gryffindor.style.display = "";
                break;
            case 'slytherin':
                btn_slytherin.style.display = "none";
                btn_un_slytherin.style.display = "";
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = "none";
                btn_un_hufflepuff.style.display = "";
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = "none";
                btn_un_ravenclaw.style.display = "";
                break;
            default:
                break;
        }
        toastr.success(`you have subscribed successfully. ${hostname}`);
    }
    else {
        switch (hostname) {
            case 'gryffindor':
                btn_gryffindor.style.display = "";
                btn_un_gryffindor.style.display = "none";
                break;
            case 'slytherin':
                btn_slytherin.style.display = "";
                btn_un_slytherin.style.display = "none";
                break;
            case 'hufflepuff':
                btn_hufflepuff.style.display = "";
                btn_un_hufflepuff.style.display = "none";
                break;
            case 'ravenclaw':
                btn_ravenclaw.style.display = "";
                btn_un_ravenclaw.style.display = "none";
                break;
            default:
                break;
        }
        toastr.success(`you have unsubscribed successfully. ${hostname}`);
    }

});

//start connection
function fulfilled() {
    console.log("Successfull");
}
function logRejected() {
    console.log("Rejected");
}
connectionhousegroup.start().then(fulfilled, logRejected);
