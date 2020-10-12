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

Utility.Game.UiElements.TextArea = class
{
	// gameTextAreaId = ""
	// gameTextAreaExists = false

	// x = 0
	// y = 0
	// width = 0
	// height = 0
	// fontSize = 0
	// text = ""

	// screens = []
	// visible = true
	// unused = false

	constructor(initGameTextAreaId, initX, initY, initWidth, initHeight, initFontSize, initText, initScreens, initVisible)
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
		this.text = initText

		this.screens = initScreens
		this.visible = initVisible
		this.unused = false
		
	}

	GetText()
	{
		this.text = ElementValue(this.gameTextAreaId)
		return this.text
	}

	SetText(newText)
	{
		this.text = newText
		this.UpdateText()
	}

	UpdateText()
	{
		ElementValue(this.gameTextAreaId, this.text)
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
