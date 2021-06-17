"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.Server = class
{
	constructor()
	{
		this.functionCallHooks = {}
		this.functionCallHooks.ServerConnected = new Utility.FunctionCallHook('ServerConnect')
		this.functionCallHooks.ServerDisconnected = new Utility.FunctionCallHook('ServerDisconnect')
		this.functionCallHooks.ServerSend = new Utility.FunctionCallHook('ServerSend')
		this.eventServerConnected = new Utility.Event()
		this.eventServerDisconnected = new Utility.Event()
		this.eventSentChatMessage = new Utility.Event()

		let _this = this
		this.functionCallHooks.ServerConnected.RegisterEventAfter(function(data) { _this.OnServerConnected(data); })
		this.functionCallHooks.ServerDisconnected.RegisterEventAfter(function(data) { _this.OnServerDisconnected(data); })
		this.functionCallHooks.ServerSend.RegisterEventAfter(function(type, data) { _this.OnServerSend(type, data); })

	}

	OnServerConnected(data)
	{
		this.eventServerConnected.Raise(data)
	}

	OnServerDisconnected(data)
	{
		this.eventServerDisconnected.Raise(data)
	}

	OnServerSend(type, data)
	{
		switch(type)
		{
			case "ChatRoomChat": 
				this.eventSentChatMessage.Raise(data.Content, data.Type)
				break;

			default:
				break;
		}
	}

	RegisterEventConnected(eventHandler)
	{
		return this.eventServerConnected.Register(eventHandler)
	}

	UnregisterEventConnected(eventId)
	{
		return this.eventServerConnected.Unregister(eventId)
	}

	RegisterEventDisconnected(eventHandler)
	{
		return this.eventServerDisconnected.Register(eventHandler)
	}

	UnregisterEventDisconnected(eventId)
	{
		return this.eventServerDisconnected.Unregister(eventId)
	}
	
	RegisterEventSentChatMessage(eventHandler)
	{
		return this.eventSentChatMessage.Register(eventHandler)
	}

	UnregisterEventSendChatMessage(eventId)
	{
		return this.eventSentChatMessage.Unregister(eventId)
	}

}
