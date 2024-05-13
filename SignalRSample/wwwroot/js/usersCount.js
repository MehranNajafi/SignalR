//create connection
var connectionUserCount = new signalR.HubConnectionBuilder()
    //.configureLogging(LogLevel.Information)
    .withUrl("/hubs/userCount", signalR.HttpTransportType.WebSockets).build();

//connect to methods that hub invokes aka receive notifications from hub
connectionUserCount.on("updateTotalViews", (value) => {
    var totalValueSpan = document.getElementById("totalViewsCounter");
    totalValueSpan.innerText = value.toString();
});
connectionUserCount.on("updateTotalUsers", (value) => {
    var totalUsersSpan = document.getElementById("totalUsersCounter");
    totalUsersSpan.innerText = value.toString();
});
//invoke hub method aka send notification to hub
function newWindowsLoadedOnClient() {
    connectionUserCount.send("NewWindowsLoaded");
    //connectionUserCount.invoke("NewWindowsLoaded", "Mehran").then((value) => { console.log(value) });
}
//start connection
function fulfilled() {
    newWindowsLoadedOnClient();
    console.log("Successfull");
}
function logRejected() {
    console.log("Rejected");
}
connectionUserCount.start().then(fulfilled, logRejected);
