var cloakCounterSpan = document.getElementById("cloakCounter");
var stoneCounterSpan = document.getElementById("stoneCounter");
var wandCounterSpan = document.getElementById("wandCounter");
//create connection
var connectionDeathlyHallows = new signalR.HubConnectionBuilder()
    //.configureLogging(LogLevel.Information)
    .withUrl("/hubs/deathlyhallows", signalR.HttpTransportType.WebSockets).build();

//connect to methods that hub invokes aka receive notifications from hub
connectionDeathlyHallows.on("updateDeathlyHallowsCount", (wand, stone, cloak) => {
    cloakCounterSpan.innerText = cloak.toString();
    wandCounterSpan.innerText = wand.toString();
    stoneCounterSpan.innerText = stone.toString();
});

//invoke hub method aka send notification to hub


//start connection
function fulfilled() {
    connectionDeathlyHallows.invoke("GetRace").then((dhCount) => {
        cloakCounterSpan.innerText = dhCount.cloak.toString();
        wandCounterSpan.innerText = dhCount.wand.toString();
        stoneCounterSpan.innerText = dhCount.stone.toString();
    });
    console.log("Successfull");
}
function logRejected() {
    console.log("Rejected");
}
connectionDeathlyHallows.start().then(fulfilled, logRejected);
