using Microsoft.AspNet.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using SignalRSample.Data;
using SignalRSample.Hubs;
using SignalRScaleOut;
var builder = WebApplication.CreateBuilder(args);
// Add services to the container.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

builder.Services.AddDefaultIdentity<IdentityUser>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddControllersWithViews();
Config.SetConfig(connectionString);
builder.Services.AddSignalR(conf => conf.EnableDetailedErrors = true);

var app = builder.Build();
app.UseCors("AllowAll");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();
app.MapHub<UserHub>("/hubs/userCount");
app.MapHub<DeathlyHallowsHub>("/hubs/deathlyhallows");
app.MapHub<HouseGroupHub>("/hubs/housegroup");
app.MapHub<NotificationHub>("/hubs/notification");
app.MapHub<BasicChatHub>("/hubs/basicchat");
app.MapHub<ChatHub>("/hubs/chat");
app.MapHub<OrderHub>("/hubs/order");
app.Run();
