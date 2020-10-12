/*jslint node: true */
/*global ChatRoomMessage: true */

"use strict";

var ChatRoomMessageBeforeEventNextId = 0
var ChatRoomMessageBeforeEvent = []
var ChatRoomMessageAfterEventNextId = 0
var ChatRoomMessageAfterEvent = []

function ChatRoomMessageHookBeforeRegister(eventHandler)
{
	var eventId = 0
	
	eventId = ChatRoomMessageBeforeEventNextId
	ChatRoomMessageBeforeEventNextId = ChatRoomMessageBeforeEventNextId + 1
	
	ChatRoomMessageBeforeEvent.push({ id: eventId, handler: eventHandler })
	
	return eventId
}

function ChatRoomMessageHookBeforeUnregister(eventId)
{
	var found = false
	for(var i=0; i<ChatRoomMessageBeforeEvent.length; i++)
	{
		if(ChatRoomMessageBeforeEvent[i].id == eventId)
		{
			ChatRoomMessageBeforeEvent.splice(i, 1)
			found = true
			break
		}
	}
	
	return found
}

function ChatRoomMessageAfterEventRegister(eventHandler)
{
	var eventId = 0
	
	eventId = ChatRoomMessageAfterEventNextId
	ChatRoomMessageAfterEventNextId = ChatRoomMessageAfterEventNextId + 1
	
	ChatRoomMessageAfterEvent.push({ id: eventId, handler: eventHandler })
	
	return eventId
}

function ChatRoomMessageAfterEventUnregister(eventId)
{
	var found = false
	for(var i=0; i<ChatRoomMessageAfterEvent.length; i++)
	{
		if(ChatRoomMessageAfterEvent[i].id == eventId)
		{
			ChatRoomMessageAfterEvent.splice(i, 1)
			found = true
			break
		}
	}
	
	return found
}

function ChatRoomMessageHookBefore(data)
{
	for(var i=0; i<ChatRoomMessageBeforeEvent.length; i++)
	{
		//console.log("Executing ChatRoomMessageBeforeEvent with id="+ChatRoomMessageBeforeEvent[i].id)
		ChatRoomMessageBeforeEvent[i].handler(data)
	}
}

function ChatRoomMessageHookAfter(data)
{
	for(var i=0; i<ChatRoomMessageAfterEvent.length; i++)
	{
		//console.log("Executing ChatRoomMessageAfterEvent with id="+ChatRoomMessageAfterEvent[i].id)
		ChatRoomMessageAfterEvent[i].handler(data)
	}
}

var ChatRoomMessage_Original = ChatRoomMessage
ChatRoomMessage = function(data)
{
	ChatRoomMessageHookBefore(data)
	ChatRoomMessage_Original(data)
	ChatRoomMessageHookAfter(data)
}
