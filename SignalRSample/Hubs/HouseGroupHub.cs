using Microsoft.AspNetCore.SignalR;

namespace SignalRSample.Hubs
{
    public class HouseGroupHub : Hub
    {
        public static List<string> GroupsJoin { get; set; } = new List<string>();
        public async Task JoinHouse(string houseName)
        {
            if (!GroupsJoin.Contains(Context.ConnectionId + ":" + houseName))
            {
                GroupsJoin.Add(Context.ConnectionId + ":" + houseName);
                string houstList = string.Empty;
                foreach (string group in GroupsJoin)
                {
                    if (group.Contains(Context.ConnectionId))
                        houstList += group.Split(":")[1] + " ";
                }
                await Clients.Caller.SendAsync("subscriptionStatus", houstList, houseName.ToLower(), true);
                await Clients.Others.SendAsync("newMemberJoinedGroup", houseName.ToLower());  
                await Groups.AddToGroupAsync(Context.ConnectionId, houseName);
            }
        }
        public async Task LeaveHouse(string houseName)
        {
            if (GroupsJoin.Contains(Context.ConnectionId + ":" + houseName))
            {
                GroupsJoin.Remove(Context.ConnectionId + ":" + houseName);
                string houstList = string.Empty;
                foreach (string group in GroupsJoin)
                {
                    if (group.Contains(Context.ConnectionId))
                        houstList += group.Split(":")[1] + " ";
                }
                await Clients.Caller.SendAsync("subscriptionStatus", houstList, houseName.ToLower(), false);
                await Clients.Others.SendAsync("memberLeavedGroup", houseName.ToLower());
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, houseName);
            }
        }
        public async Task TriggerHouseNotify(string houseName)
        {
            await Clients.Group(houseName).SendAsync("triggerHouseNotify",houseName);
        }
    }
}
