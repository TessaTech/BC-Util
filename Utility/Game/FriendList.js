"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.FriendList = class
{
	constructor()
	{
		this.onlineFriends = []
		this.functionCallHooks = {}
		this.functionCallHooks.ServerAccountQueryResult = new Utility.FunctionCallHook('ServerAccountQueryResult')
		
		this.eventOnlineFriendsChanged = new Utility.Event()

		let _this = this
		
		return this.functionCallHooks.ServerAccountQueryResult.RegisterEventAfter(function(data){ _this.OnServerAccountQueryResultAfter(data); })

	}

	GetOnlineFriends()
	{
		return this.onlineFriends
	}

	OnServerAccountQueryResultAfter(data)
	{
		let onlineFriends = []

        if ((data == null) || (typeof data !== "object") || Array.isArray(data) == true || (data.Query == null) || (typeof data.Query !== "string") || (data.Result == null))
        {
            return;
        }
        if (data.Query != "OnlineFriends")
        {
            return;
        }

        for (let i = 0; i < data.Result.length; i++)
        {
            onlineFriends.push({ memberNumber : data.Result[i].MemberNumber, name : data.Result[i].MemberName, room : data.Result[i].ChatRoomName })
        }
		
		this.onlineFriends = onlineFriends

		this.eventOnlineFriendsChanged.Raise(this.onlineFriends)
	}

	RegisterEventOnlineFriendsChanged(eventHandler)
	{
		return this.eventOnlineFriendsChanged.Register(eventHandler)
	}

	UnregisterEventOnlineFriendsChanged(eventId)
	{
		returnthis.eventOnlineFriendsChanged.Unregister(eventId)
	}

	QuerryFriendlist()
	{
		ServerSend("AccountQuery", { Query: "OnlineFriends" });
	}

}
