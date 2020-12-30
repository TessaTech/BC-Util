"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.Beeps = class
{
	constructor()
	{
		this.functionCallHooks = {}
		this.functionCallHooks.ServerAccountBeep = new Utility.FunctionCallHook('ServerAccountBeep')
		this.eventReceivedBeep = new Utility.Event()

		let _this = this
		this.functionCallHooks.ServerAccountBeep.RegisterEventAfter(function(data) { _this.OnServerAccountBeepAfter(data); })

	}

	OnServerAccountBeepAfter(data)
	{
		let beepType = ""
		if(data.BeepType != null)
		{
			beepType = data.BeepType
		}
		this.eventReceivedBeep.Raise(data.MemberNumber, data.MemberName, beepType)
	}

	RegisterEventReceivedBeep(eventHandler)
	{
		return this.eventReceivedBeep.Register(eventHandler)
	}

	UnregisterEventReceivedBeep(eventId)
	{
		return this.eventReceivedBeep.Unregister(eventId)
	}

	SendFriendNotificationBeep(memberNumber, memberName)
	{
		SendGenericBeep(memberNumber, "")
	}

	SendLeashBeep(memberNumber)
	{
		SendGenericBeep(memberNumber, "Leash")
	}

	SendGenericBeep(memberNumber, type)
	{
		ServerSend("AccountBeep", { MemberNumber: memberNumber, BeepType: type });
	}

}
