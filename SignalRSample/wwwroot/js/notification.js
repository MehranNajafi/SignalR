var connectionNotification = new signalR.HubConnectionBuilder()
    .withUrl("/hubs/notification", signalR.HttpTransportType.WebSockets).build();

document.getElementById("sendButton").disabled = true;
connectionNotification.on("LoadNotification", function (messages, counter) {
    document.getElementById("messageList").innerHTML = "";
    var notificationCounter = document.getElementById("notificationCounter");
    notificationCounter.innerHTML = "<span>(" + counter + ")</span>";
    for (var i = 0; i < messages.length; i++) {
        var li = document.createElement("li");
        li.textContent = "notification : " + messages[i];
        document.getElementById("messageList").appendChild(li);
    }
})
document.getElementById("sendButton").addEventListener("click", function (event) {
    var message = document.getElementById("notificationInput").value;
    connectionNotification.send("SendMessage", message).then(function () {
        document.getElementById("notificationInput").value = "";
    });
    event.preventDefault();
})
connectionNotification.start().then(function () {
    connectionNotification.send("LoadMessages");
    document.getElementById("sendButton").disabled = false;
})
