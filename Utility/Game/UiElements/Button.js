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

		this.eventClicked = new Utility.Event()
	}
	
	IsElementOnScreen(currentScreen)
	{
		if(currentScreen == null)
		{
			return false
		}

		return (this.screens.length == 0 || this.screens.includes(currentScreen) == true)
	}

	//Methods to Draw specific GUI Elements
	Draw(currentScreen)
	{
		if(this.visible == false || this.IsElementOnScreen(currentScreen) == false) // If button isn't visible or the current screen is not it's active screen...
		{
			//Don't draw it
			return;
		}

		if(this.enabled == true) // If button is enabled...
		{
			//Draw enabled button
			DrawButton(this.x, this.y, this.width, this.height, this.text, this.colorActive, this.image, this.tooltip)
		}
		else // If button is disabled...
		{
			//Draw disabled button
			DrawButton(this.x, this.y, this.width, this.height, this.text, this.colorInactive, this.image, this.tooltip)
		}

	}

	RegisterEventClicked(eventHandler)
	{
		return this.eventClicked.Register(eventHandler)
	}

	UnregisterEventClicked(eventId)
	{
		return this.eventClicked.Unregister(eventId)
	}

	RaiseEventClicked()
	{
		this.eventClicked.Raise()
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
