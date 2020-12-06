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

Utility.Game.UiElements.TextLabel = class
{
	//initMode = "Default", "Wrap" and "Fit"
	constructor(initX, initY, initWidth, initHeight, initText, initColorForeground, initColorBackground, initMode, initScreens, initVisible)
	{
		if(initColorForeground == null) { initColorForeground = "Black"; }
		if(initColorBackground == null) { initColorBackground = "White"; }
		if(initMode == null || initMode != "Wrap" || initMode != "Fit") { initMode = "Default"; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }

		this.x = initX
		this.y = initY
		this.width = initWidth
		this.height = initHeight
		this.text = initText
		this.colorForeground = initColorForeground
		this.colorBackground = initColorBackground
		this.mode = initMode

		this.screens = initScreens
		this.visible = initVisible
		
		this.unused = false

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
