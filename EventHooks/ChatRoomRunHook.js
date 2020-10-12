/*jslint node: true */
/*global ChatRoomRun: true */

"use strict";

var ChatRoomRunBeforeEventNextId = 0
var ChatRoomRunBeforeEvent = []
var ChatRoomRunAfterEventNextId = 0
var ChatRoomRunAfterEvent = []

function ChatRoomRunHookBeforeRegister(eventHandler)
{
	var eventId = 0
	
	eventId = ChatRoomRunBeforeEventNextId
	ChatRoomRunBeforeEventNextId = ChatRoomRunBeforeEventNextId + 1
	
	ChatRoomRunBeforeEvent.push({ id: eventId, handler: eventHandler })
	
	return eventId
}

function ChatRoomRunHookBeforeUnregister(eventId)
{
	var found = false
	for(var i=0; i<ChatRoomRunBeforeEvent.length; i++)
	{
		if(ChatRoomRunBeforeEvent[i].id == eventId)
		{
			ChatRoomRunBeforeEvent.splice(i, 1)
			found = true
			break
		}
	}
	
	return found
}

function ChatRoomRunAfterEventRegister(eventHandler)
{
	var eventId = 0
	
	eventId = ChatRoomRunAfterEventNextId
	ChatRoomRunAfterEventNextId = ChatRoomRunAfterEventNextId + 1
	
	ChatRoomRunAfterEvent.push({ id: eventId, handler: eventHandler })
	
	return eventId
}

function ChatRoomRunAfterEventUnregister(eventId)
{
	var found = false
	for(var i=0; i<ChatRoomRunAfterEvent.length; i++)
	{
		if(ChatRoomRunAfterEvent[i].id == eventId)
		{
			ChatRoomRunAfterEvent.splice(i, 1)
			found = true
			break
		}
	}
	
	return found
}

function ChatRoomRunHookBefore()
{
	for(var i=0; i<ChatRoomRunBeforeEvent.length; i++)
	{
		//console.log("Executing ChatRoomRunBeforeEvent with id="+ChatRoomRunBeforeEvent[i].id)
		ChatRoomRunBeforeEvent[i].handler()
	}
}

function ChatRoomRunHookAfter()
{
	for(var i=0; i<ChatRoomRunAfterEvent.length; i++)
	{
		//console.log("Executing ChatRoomRunAfterEvent with id="+ChatRoomRunAfterEvent[i].id)
		ChatRoomRunAfterEvent[i].handler()
	}
}

var ChatRoomRun_Original = ChatRoomRun
ChatRoomRun = function()
{
	ChatRoomRunHookBefore()
	ChatRoomRun_Original()
	ChatRoomRunHookAfter()
}
