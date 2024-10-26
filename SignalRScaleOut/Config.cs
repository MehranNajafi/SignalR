using Microsoft.AspNet.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SignalRScaleOut
{
    public static class Config
    {
        public static void SetConfig(string connectionString)
        {
            GlobalHost.DependencyResolver.UseSqlServer(connectionString);
        }
    }
}
