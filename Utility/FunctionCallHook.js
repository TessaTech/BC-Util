/*jslint node: true */
/*global ChatRoomMessage: true */

"use strict";

if(Utility == undefined)
{
	var Utility = {}
}

Utility.FunctionCallHook = class
{
	// eventBefore = {}
	// eventAfter = {}
	// originalFunction = function() { }

	constructor(functionName)
	{
		var _this = this
		this.eventBefore = new Utility.Event()
		this.eventAfter = new Utility.Event()

		this.originalFunction = window[functionName]
		window[functionName] = function(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
		{
			_this.EventHookBefore(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
			_this.originalFunction(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
			_this.EventHookAfter(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
		}

	}

	RegisterEventBefore(eventHandler)
	{
		return this.eventBefore.Register(eventHandler)
	}
	
	UnregisterEventBefore(eventId)
	{
		this.eventBefore.Unregister(eventId)
	}

	RegisterEventAfter(eventHandler)
	{
		return this.eventAfter.Register(eventHandler)
	}
	
	UnregisterEventAfter(eventId)
	{
		this.eventAfter.Unregister(eventId)
	}

	EventHookBefore(data)
	{
		this.eventBefore.Raise(data)
	}
	
	EventHookAfter(data)
	{
		this.eventAfter.Raise(data)
	}

}
