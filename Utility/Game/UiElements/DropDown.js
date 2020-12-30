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
Utility.Game.UiElements.DropDown = class
{
	constructor(initGameTextInputId, initX, initY, initWidth, initHeight, initFontSize, initObjects, initSelectedObjectId, initScreens, initVisible)
	{
		if(initObjects == null) { initObjects = []; }
		if(initScreens == null) { initScreens = []; }
		if(initVisible == null) { initVisible = true; }

		this.gameDropDownId = initGameTextInputId
		this.gameDropDownExists = false

		this.x = initX
		this.y = initY
		this.width = initWidth
		this.height = initHeight
		this.fontSize = initFontSize
		
		this.objects = []
		this.selection = 0

		this.screens = initScreens
		this.visible = initVisible
		this.unused = false
		this.SetObjects(initObjects)
		this.SetSelection(initSelectedObjectId)

		this.eventTextChanged = new Utility.Event()
		
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
			if(this.gameDropDownExists == true) // If the underlying element extist...
			{
				//Remove it
				ElementRemove(this.gameDropDownId)
				this.gameDropDownExists = false
			}
			//Don't draw it
			return;
		}

		if(this.gameDropDownExists == false) // If the underlying element does not extis...
		{
			let _this = this
			ElementCreateDropdown(this.gameDropDownId, this.objects, function(eventData){ _this.OnElementClicked(eventData); })
			this.gameDropDownExists = true
		}
		ElementPositionFix(this.gameDropDownId, this.fontSize, this.x, this.y, this.width, this.height)
	}

	GetObjects()
	{
		return this.objects
	}

	GetSelectedObject()
	{
		if(this.selection >= this.objects.length)
		{
			return null
		}
		return this.objects[this.selection]
	}

	GetSelectedIndex()
	{
		if(this.selection >= this.objects.length)
		{
			return -1
		}
		return this.selection
	}

	SetObjects(newObjects)
	{
		if(Array.isArray(newObjects) == false)
		{
			return;
		}
		this.objects = newObjects
		this.UpdateObjects()
	}

	SetSelection(selectedObjectId)
	{
		this.selection = selectedObjectId
		this.UpdateObjects()

	}

	UpdateObjects()
	{
		if(this.visible == true && this.gameDropDownExists == true)
		{
			let _this = this
			ElementRemove(this.gameDropDownId)
			ElementCreateDropdown(this.gameDropDownId, this.objects, function(eventData){ _this.OnElementClicked(eventData); })
			ElementPositionFix(this.gameDropDownId, this.fontSize, this.x, this.y, this.width, this.height)

			let element = document.getElementById(this.gameDropDownId)
			if(element == null)
			{
				return;
			}
			let elementSelect = element.children[0]
			let elementSelection = element.children[1]
	
			if(this.selection >= elementSelect.options.length)
			{
				elementSelection.innerHTML = "Unknown Selection"
				return;
			}
			elementSelect.selectedIndex = this.selection
			elementSelection.innerHTML = elementSelect.options[this.selection].innerHTML
			
		}
	}

	RegisterEventSelectionChanged(eventHandler)
	{
		return this.eventTextChanged.Register(eventHandler)
	}

	UnregisterEventSelectionChanged(eventId)
	{
		return this.eventTextChanged.Unregister(eventId)
	}

	RaiseEventSelectionChanged(newSelection)
	{
		this.eventTextChanged.Raise(newSelection)
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

	OnElementClicked(eventData)
	{
		let newSelection = eventData.srcElement.selectedIndex
		if(newSelection == null)
		{
			return;
		}
		this.selection = newSelection
		this.RaiseEventSelectionChanged(this.selection)
	}

}
