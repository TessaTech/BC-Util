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

		this.keyDown = false
		this.eventTextChanged = new Utility.Event()
		this.eventAccepted = new Utility.Event()
		this.lastText = this.text

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
			ElementCreateTextArea(this.gameTextAreaId)
			this.UpdateText()
			this.gameTextAreaExists = true

			let _this = this
			let element = document.getElementById(this.gameTextAreaId)
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

			if(this.scrollToEndOnShow == true)
			{
				this.ScrollToEnd()
			}
		}
		ElementPositionFix(this.gameTextAreaId, this.fontSize, this.x, this.y, this.width, this.height)
		this.GetText()

	}

	GetText()
	{
		let value = ElementValue(this.gameTextAreaId)
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

	ScrollToEnd()
	{
		ElementScrollToEnd(this.gameTextAreaId)
	}
	
	UpdateText()
	{
		ElementValue(this.gameTextAreaId, this.text)
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
