"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}
if(Utility.Game.UiElements == undefined)
{
	Utility.Game.UiElements = {}
}

Utility.Game.UiElements.Button = class
{
	// x = 0
	// y = 0
	// width = 0
	// height = 0
	// text = ""
	// colorActive = ""
	// colorInactive = ""
	// image = ""
	// tooltip = ""

	// screens = []
	// visible = true
	// enabled = true
	// unused = false

	// clickEvent = null

	constructor(initX, initY, initWidth, initHeight, initText, initColorActive, initColorInactive, initImage, initTooltip, initScreens, initVisible, initEnabled)
	{
		if(initColorActive == null) { initColorActive = "White"; }
		if(initColorInactive == null) { initColorInactive = "#606060"; }
		if(initImage == null) { initImage = ""; }
		if(initTooltip == null) { initTooltip = ""; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }
		if(initEnabled == null) { initEnabled = true; }

		this.x = initX
		this.y = initY
		this.width = initWidth
		this.height = initHeight
		this.text = initText
		this.colorActive = initColorActive
		this.colorInactive = initColorInactive
		this.image = initImage
		this.tooltip = initTooltip

		this.screens = initScreens
		this.visible = initVisible
		this.enabled = initEnabled
		
		this.unused = false

		this.clickEvent = new Utility.Event()
	}

	RegisterClickEventHandler(eventHandler)
	{
		return this.clickEvent.Register(eventHandler)
	}

	UnregisterClickEventHandler(eventId)
	{
		return this.clickEvent.Unregister(eventId)
	}

	RaiseClickEvent()
	{
		this.clickEvent.Raise()
	}

	Show()
	{
		this.visible = true
	}

	Hide()
	{
		this.visible = false
	}

	MarkUnused()
	{
		this.unused = true
	}

}
