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
	
	IsElementOnScreen(currentScreen)
	{
		if(currentScreen == null)
		{
			return false
		}

		return (this.screens.length == 0 || this.screens.includes(currentScreen) == true)
	}

	Draw(currentScreen)
	{
		if(this.visible == false || this.IsElementOnScreen(currentScreen) == false) // If text label isn't visible or the current screen is not it's active screen...
		{
			//Don't draw it
			return;
		}

		switch(this.mode)
		{
			case "Wrap": //If the text label's mode is "Wrap"...
				DrawTextWrap(this.text, this.x+(this.width/2), this.y+(this.height/2), this.width, this.height, this.colorForeground, this.colorBackground, null)
				break;

			case "Fit": //If the text label's mode is "Fit"...
				DrawTextFit(this.text, this.x+(this.width/2), this.y+(this.height/2), this.width, this.colorForeground)
				break;

			case "Default": //If the text label's mode is "Default"...
			default: // Every unknown mode is regarded as "Default"
				DrawText(this.text, this.x+(this.width/2), this.y+(this.height/2), this.colorForeground, this.colorBackground)
				break;
				
		}

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
