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
		window[functionName] = function(...data)
		{
			_this.EventHookBefore(...data)
			if(_this.executeHookedFunction == true) // If executing the original function is desired...
			{
				//Execute it
				_this.originalFunction(...data)
			}
			else if(_this.blockOnce == true) // If executing the original function only should be blocked once...
			{
				//That just happened, so allow it again for next time
				_this.AllowHookedFunction()
			}
			_this.EventHookAfter(...data)
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

	EventHookBefore(...data)
	{
		this.eventBefore.Raise(...data)
	}
	
	EventHookAfter(...data)
	{
		this.eventAfter.Raise(...data)
	}

}
