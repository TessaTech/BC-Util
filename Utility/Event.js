"use strict";

if(Utility == undefined)
{
	var Utility = {}
}

Utility.EventEntry = class
{
	// id = -1
	// handler = null

	constructor(initId, initHandler)
	{
		this.id = initId
		this.handler = initHandler
	}

}

Utility.Event = class
{
	// eventNextId = 0
	// handlerList = []

	constructor()
	{
		this.eventNextId = 0
		this.handlerList = []
	}

	Register(eventHandler)
	{
		var eventId = 0
		
		eventId = this.eventNextId
		this.eventNextId = this.eventNextId + 1
		
		this.handlerList.push(new Utility.EventEntry(eventId, eventHandler))
		
		return eventId
	}

	Unregister(eventId)
	{
		var found = false
		for(var i=0; i<this.handlerList.length; i++)
		{
			if(this.handlerList[i].id == eventId)
			{
				this.handlerList.splice(i, 1)
				found = true
				break
			}
		}
		
		return found
	}

	Raise(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
	{
		for(var i=0; i<this.handlerList.length; i++)
		{
			//console.log("Executing ChatRoomMessageBeforeEvent with id="+ChatRoomMessageBeforeEvent[i].id)
			this.handlerList[i].handler(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
		}
	}

}
