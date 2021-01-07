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

Utility.Game.UiElements.HtmlTextArea = class
{
	constructor(initGameTextAreaId, initX, initY, initWidth, initHeight, initFontSize, initMaxLength, initText, initScreens, initVisible)
	{
		if(initText == null) { initText = ""; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }

		this.gameTextAreaId = initGameTextAreaId
		this.gameTextAreaExists = false

		this.x = initX
		this.y = initY
		this.width = initWidth
		this.height = initHeight
		this.fontSize = initFontSize
		this.maxLength = initMaxLength
		this.SetText(initText)

		this.screens = initScreens
		this.visible = initVisible
		this.unused = false
		
		//this.eventTextChanged = new Utility.Event()

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
		if(this.visible == false || this.IsElementOnScreen(currentScreen) == false) // If text area isn't visible or the current screen is not it's active screen...
		{
			if(this.gameTextAreaExists == true) // If the underlying element exists...
			{
				//Remove it
				ElementRemove(this.gameTextAreaId)
				this.gameTextAreaExists = false
			}
			//Don't draw it
			return;
		}

		if(this.gameTextAreaExists == false)
		{
			ElementCreateDiv(this.gameTextAreaId)
			// document.getElementById(this.gameTextAreaId).style =
			// 	"width: "+this.width+"px;"+
			// 	"height: "+this.height+"px;"+
			// 	"font-size: "+this.fontSize+"px;"+
			// 	"font-family: Arial;"+
			// 	"display: inline;"+
			// 	// "white-space: pre-wrap;"+
			// 	"overflow-wrap: break-word;"+
			// 	"background-color: white;"+
			// 	"border-top-color: black;"+
			// 	"border-top-style: solid;"+
			// 	"border-top-width: 1px;"+
			// 	"border-right-color: black;"+
			// 	"border-right-style: solid;"+
			// 	"border-right-width: 1px;"+
			// 	"border-bottom-color: black;"+
			// 	"border-bottom-style: solid;"+
			// 	"border-bottom-width: 1px;"+
			// 	"border-left-color: black;"+
			// 	"border-left-style: solid;"+
			// 	"border-left-width: 1px;"+
			// 	"border-image-outset: 0;"+
			// 	"border-image-repeat: stretch;"+
			// 	"border-image-slice: 100%;"+
			// 	"border-image-source: none;"+
			// 	"border-image-width: 1;"+
			// 	"overflow-x: auto;"+
			// 	"overflow-y: auto;"+
			// 	"padding-top: 0px;"+
			// 	"padding-right: 0px;"+
			// 	"padding-bottom: 0px;"+
			// 	"padding-left: 0px;"
			document.getElementById(this.gameTextAreaId).style =
				"width: "+this.width+"px;"+
				"height: "+this.height+"px;"+
				"font-size: "+this.fontSize+"px;"+
				"font-family: Arial;"+
				"position: absolute;"+
				"display: inline;"+
				"background-color: white;"+
				"border: 1px solid black;"+
				"overflow: auto;"+
				"word-wrap: break-word;"+
				"padding: 0 !important;"
			this.UpdateText()
			this.gameTextAreaExists = true
		}
		ElementPositionFix(this.gameTextAreaId, this.fontSize, this.x, this.y, this.width, this.height)
		//this.GetText()

	}

	GetText()
	{
		let value = ElementContent(this.gameTextAreaId)
		if(value != null && (value.length != this.text.length || value != this.text))
		{
			this.text = value
			//this.RaiseEventTextChanged(this.text)
		}
		return this.text
	}

	SetText(newText)
	{
		let wasScrolledToEnd = ElementIsScrolledToEnd(this.gameTextAreaId)

		this.text = newText
		this.UpdateText()

		if (wasScrolledToEnd == true)
		{
			ElementScrollToEnd(this.gameTextAreaId)
		}
	}

	UpdateText()
	{
		ElementContent(this.gameTextAreaId, this.text)
	}

	// RegisterEventTextChanged(eventHandler)
	// {
	// 	return this.eventTextChanged.Register(eventHandler)
	// }

	// UnregisterEventTextChanged(eventId)
	// {
	// 	return this.eventTextChanged.Unregister(eventId)
	// }

	// RaiseEventTextChanged(newText)
	// {
	// 	this.eventTextChanged.Raise(newText)
	// }

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
