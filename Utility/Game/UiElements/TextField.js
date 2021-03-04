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
		
		this.keyDown = false
		this.eventTextChanged = new Utility.Event()
		this.eventAccepted = new Utility.Event()
		
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
			if(this.gameTextInputExists == true) // If the underlying element exists...
			{
				//Remove it
				ElementRemove(this.gameTextInputId)
				this.gameTextInputExists = false
			}
			//Don't draw it
			return;
		}

		if(this.gameTextInputExists == false) // If the underlying element does not extis...
		{
			ElementCreateInput(this.gameTextInputId, "text", this.GetText(), this.maxLength)
			this.UpdateText()
			this.gameTextInputExists = true

			let _this = this
			let element = document.getElementById(this.gameTextInputId)
			element.addEventListener("keydown", function(eventData)
				{
					if(_this.keyDown == true) { return; }
					_this.keyDown = true
	
					let returnValues = { preventDefault: false }
					_this.OnElementKeyDown(eventData.key, returnValues)
					if(returnValues.preventDefault == true)
					{
						event.preventDefault();
					}
				});
			element.addEventListener("keyup", function(eventData)
				{
					if(_this.keyDown == false) { return; }
					_this.keyDown = false
					
					let returnValues = { preventDefault: false }
					_this.OnElementKeyUp(eventData.key, returnValues)
					if(returnValues.preventDefault == true)
					{
						event.preventDefault();
					}
				});
		}
		ElementPositionFix(this.gameTextInputId, this.fontSize, this.x, this.y, this.width, this.height)

	}

	GetText()
	{
		let value = ElementValue(this.gameTextInputId)
		if(value != null && (value.length != this.text.length || value != this.text))
		{
			this.text = value
			this.RaiseEventTextChanged(this.text)
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

	RegisterEventAccepted(eventHandler)
	{
		return this.eventAccepted.Register(eventHandler)
	}

	UnregisterEventAccepted(eventId)
	{
		return this.eventAccepted.Unregister(eventId)
	}

	RaiseEventAccepted(newText)
	{
		this.eventAccepted.Raise(newText)
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

	OnElementKeyDown(key, returnValues)
	{
		if (key == "Enter") // If enter was pressed...
		{
			returnValues.preventDefault = true
			this.RaiseEventAccepted(this.GetText())
		}
		this.GetText()
	}

	OnElementKeyUp(key, returnValues)
	{
		if (key == "Enter") // If enter was pressed...
		{
			returnValues.preventDefault = true
		}
		this.GetText()
	}

}
