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

//ElementCreateInput
Utility.Game.UiElements.TextField = class
{
	constructor(initGameTextInputId, initX, initY, initWidth, initHeight, initFontSize, initMaxLength, initText, initScreens, initVisible)
	{
		if(initText == null) { initText = ""; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }

		this.gameTextInputId = initGameTextInputId
		this.gameTextInputExists = false

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
		
		this.eventTextChanged = new Utility.Event()
		
	}

	GetText()
	{
		let value = ElementValue(this.gameTextInputId)
		if(value != null)
		{
			this.text = value
		}
		return this.text
	}

	SetText(newText)
	{
		this.text = newText
		this.UpdateText()
	}

	UpdateText()
	{
		ElementValue(this.gameTextInputId, this.text)
	}

	RegisterEventTextChanged(eventHandler)
	{
		return this.eventTextChanged.Register(eventHandler)
	}

	UnregisterEventTextChanged(eventId)
	{
		return this.eventTextChanged.Unregister(eventId)
	}

	RaiseEventTextChanged(newText)
	{
		this.eventTextChanged.Raise(newText)
	}

	RaiseEventTextChangedIfTextChanged()
	{
		let text = this.GetText()
		if(text != this.lastText)
		{
			this.lastText = text
			this.RaiseEventTextChanged(text)
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
