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
		this.executeHookedFunction = true
		this.blockOnce = false

		this.originalFunction = window[functionName]
		window[functionName] = function(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
		{
			_this.EventHookBefore(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
			if(_this.executeHookedFunction == true) // If executing the original function is desired...
			{
				//Execute it
				_this.originalFunction(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
			}
			else if(_this.blockOnce == true) // If executing the original function only should be blocked once...
			{
				//That just happened, so allow it again for next time
				_this.AllowHookedFunction()
			}
			_this.EventHookAfter(data1, data2, data3, data4, data5, data6, data7, data8, data9, data10)
		}

	}

	BlockHookedFunction()
	{
		this.executeHookedFunction = false
		this.blockOnce = false
	}

	BlockHookedFunctionOnce()
	{
		this.executeHookedFunction = false
		this.blockOnce = true
	}

	AllowHookedFunction()
	{
		this.executeHookedFunction = true
		this.blockOnce = false
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
