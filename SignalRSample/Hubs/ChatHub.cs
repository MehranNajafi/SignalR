﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using SignalRSample.Data;
using System.Security.Claims;

namespace SignalRSample.Hubs
{
    public class ChatHub : Hub
    {
        private ApplicationDbContext _db;

        public ChatHub(ApplicationDbContext db)
        {
            _db = db;
        }
        public override Task OnConnectedAsync()
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserConnected", userId, userName, HubConnections.HasUser(userId));
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnConnectedAsync();
        }
        public override Task OnDisconnectedAsync(Exception? exception)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (HubConnections.HasUserConnection(userId, Context.ConnectionId))
            {
                var userConnections = HubConnections.Users[userId];
                userConnections.Remove(Context.ConnectionId);
                HubConnections.Users.Remove(userId);
                if (userConnections.Any())
                    HubConnections.Users.Add(userId, userConnections);
            }
            if (!string.IsNullOrEmpty(userId))
            {
                var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;
                Clients.Users(HubConnections.OnlineUsers()).SendAsync("ReceiveUserDisconnected", userId, userName, HubConnections.HasUser(userId));
                HubConnections.AddUserConnection(userId, Context.ConnectionId);
            }
            return base.OnDisconnectedAsync(exception);
        }
        public async Task SendAddRoomMessage(int maxRoom, int roomId, string roomName)
        {
            var userId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == userId).UserName;
            await Clients.All.SendAsync("ReceiveAddRoomMessage", maxRoom, roomId, roomName, userId, userName);
        }
        public async Task SendDeleteRoomMessage(int deleted, int selected, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == UserId).UserName;

            await Clients.All.SendAsync("ReceiveDeleteRoomMessage", deleted, selected, roomName, userName);
        }
        public async Task SendPublicMessage(int roomId, string message, string roomName)
        {
            var UserId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var userName = _db.Users.FirstOrDefault(u => u.Id == UserId).UserName;

            await Clients.All.SendAsync("ReceivePublicMessage", roomId, UserId, userName, message, roomName);
        }
        public async Task SendPrivateMessage(string receiverId, string message, string receiverName)
        {
            var senderId = Context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            var senderName = _db.Users.FirstOrDefault(u => u.Id == senderId).UserName;
            var users = new string[] { senderId, receiverId };

            await Clients.Users(users).SendAsync("SendPrivateMessage", senderName, senderId, receiverId, message, Guid.NewGuid(), receiverName);
        }
        //public async Task SendMessageToAll(string user, string message)
        //{
        //    await Clients.All.SendAsync("MessageReceived", user, message);
        //}
        //[Authorize]
        //public async Task SendMessageToReceiver(string sender, string receiver, string message)
        //{
        //    var userId = _db.Users.FirstOrDefault(u => u.Email.ToLower() == receiver.ToLower()).Id;
        //    if (!string.IsNullOrEmpty(userId))
        //        await Clients.User(userId).SendAsync("MessageReceived", sender, message);
        //}
    }
}
