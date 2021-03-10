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
	constructor(initGameTextAreaId, initX, initY, initWidth, initHeight, initFontSize, initMaxLength, initText, initScreens, initVisible, initScrollToEndOnShow)
	{
		if(initText == null) { initText = ""; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }
		if(initScrollToEndOnShow == null) { initScrollToEndOnShow = false; }
		
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
		
		this.scrollToEndOnShow = initScrollToEndOnShow

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
			if(this.scrollToEndOnShow == true)
			{
				this.ScrollToEnd()
			}
		}
		ElementPositionFix(this.gameTextAreaId, this.fontSize, this.x, this.y, this.width, this.height)

	}

	GetText()
	{
		let value = ElementContent(this.gameTextAreaId)
		if(value != null && (value.length != this.text.length || value != this.text))
		{
			this.text = value
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

	ScrollToEnd()
	{
		ElementScrollToEnd(this.gameTextAreaId)
	}

	UpdateText()
	{
		ElementContent(this.gameTextAreaId, this.text)
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
