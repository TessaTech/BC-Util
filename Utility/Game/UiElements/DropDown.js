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
	constructor(initGameTextInputId, initX, initY, initWidth, initHeight, initColumnCount, initFontSize, initObjects, initSelectedObjectId, initScreens, initVisible)
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
		this.columnCount = initColumnCount
		this.fontSize = initFontSize
		
		this.objects = []
		this.selection = 0

		this.screens = initScreens
		this.visible = initVisible
		this.unused = false
		this.SetObjects(initObjects)
		this.SetSelection(initSelectedObjectId)

		this.updateOnDraw = false

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

	ElementCreateDropdown(elementId, elementOptions, clickEventListener)
	{
		let dropDown = document.createElement("div")
		let dropDownSelection = document.createElement("span")
		let dropDownList = document.createElement("ul")
		
		dropDown.setAttribute("Name", elementId)
		dropDown.setAttribute("ID", elementId)

		dropDown.style =	"position: absolute;"+
							"display: inline-block;"+
							"font-family: sans-serif;"+
							"font-size: 93%;"+
							"width: 100%;"+
							"height: 100%;"+
							"background-color: #FFFFFF;"+
							"color: #000000;"+
							"cursor: pointer;"+
							"padding: 0px;"+
							"border: 1px solid #000000;"+
							"margin: 0px;";

		dropDownSelection.style =	"position: relative;"+
									"display: block;"+
									"height: 100%;"+
									"color: #000000;"+
									"background-color: #C0C0C0;"+
									"box-sizing: border-box;"+
									"-moz-box-sizing: border-box;"+
									"-webkit-box-sizing: border-box;"+
									"padding-top: 0px;"+
									"padding-left: 0px;"+
									"padding-right: 0px;"+
									"padding-bottom: 0px;"+
									"border: 0px none;"+
									"border-bottom: 1px solid #000000;"+
									"margin: 0px;"+
									"cursor: pointer;";

		dropDownList.style =	"position: relative;"+
								"display: none;"+
								"width: 100%;"+
								"height: auto;"+
								"background-color: #FFFFFF;"+
								"color: #000000;"+
								"padding: 0px;"+
								"border: 0px none;"+
								"margin: 0px;"+
								"overflow-x: auto;"+
								"overflow-y: auto;";

		let dropDownListElementStyle =	"position: relative;"+
										"display: block;"+
										"height: auto;"+
										"width: 100%"
										"padding: 0px;"+
										"border: 0px;"+
										"margin: 0px;"+
										"cursor: pointer;"

		let dropDownLineEntryStyle =	"position: relative;"+
										"height: auto;"+
										"width: 100%;"+
										"padding: 0px;"+
										"border: 0px;"+
										"margin: 0px;";
		
		let dropDownColumnEntryStyle =	"position: relative;"+
										"float: left;"+
										"height: auto;"+
										"width: "+(100/this.columnCount)+"%;"+
										"padding: 0px;"+
										"border: 0px;"+
										"margin: 0px;";


		if(this.selection < elementOptions.length)
		{
			dropDownSelection.innerHTML = elementOptions[this.selection]
		}
		else
		{
			dropDownSelection.innerHTML = "<br/>"
		}

		let lineCount = Math.trunc(elementOptions.length / this.columnCount)
		if(elementOptions.length % this.columnCount > 0)
		{
			lineCount++;
		}
		let tmlLineElement = null
		let tmlColumnElement = null

		for (let iLine = 0; iLine < lineCount; iLine++)
		{
			tmlLineElement = document.createElement("div")
			tmlLineElement.style = dropDownLineEntryStyle

			let elementOffset = iLine * this.columnCount
			for(let iColumn=0; iColumn < this.columnCount; iColumn++)
			{
				if(elementOffset + iColumn >= elementOptions.length)
				{
					break;
				}
				tmlColumnElement = document.createElement("div")
				tmlColumnElement.style = dropDownColumnEntryStyle

				tmlColumnElement.innerHTML = elementOptions[elementOffset + iColumn]

				let _elementIndex = elementOffset + iColumn
				let _elementValue = tmlColumnElement
				tmlColumnElement.addEventListener("click", function(e)
				{
					e.stopPropagation()
					dropDownSelection.innerHTML = _elementValue.innerHTML
					dropDownList.style.display = "none"
					clickEventListener(_elementIndex)
				
				})

				tmlLineElement.appendChild(tmlColumnElement);
			}
			dropDownList.appendChild(tmlLineElement);
		}

		dropDownSelection.addEventListener("click", function(e)
		{
			e.stopPropagation()
			if(dropDownList.style.display == "none")
			{
				dropDownList.style.display = "inline-block"
			}
			else
			{
				dropDownList.style.display = "none"
			}
		
		})

		dropDown.append(dropDownSelection)
		dropDown.appendChild(dropDownList)
		document.body.appendChild(dropDown);

	}

	Draw(currentScreen)
	{
		if(this.visible == false || this.IsElementOnScreen(currentScreen) == false) // If text area isn't visible or the current screen is not it's active screen...
		{
			if(this.gameDropDownExists == true) // If the underlying element exists...
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
			this.ElementCreateDropdown(this.gameDropDownId, this.objects, function(eventData){ _this.OnElementClicked(eventData); })
			this.gameDropDownExists = true
		}
		ElementPositionFix(this.gameDropDownId, this.fontSize, this.x, this.y, this.width, this.height)
		if(this.updateOnDraw == true)
		{
			this.UpdateObjects()
			this.updateOnDraw = false
		}
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
		// console.log("SetObjects(...)")
		// console.log(newObjects)
		if(Array.isArray(newObjects) == false)
		{
			return;
		}
		this.objects = newObjects
		this.UpdateObjects()
	}

	SetSelection(selectedObjectId)
	{
		// console.log("SetSelection("+selectedObjectId+")")
		this.selection = selectedObjectId
		this.UpdateObjects()

	}

	UpdateObjects()
	{
		// console.log("visible="+this.visible+" gameDropDownExists="+this.gameDropDownExists)
		if(this.visible == true && this.gameDropDownExists == true)
		{
			let _this = this
			
			ElementRemove(this.gameDropDownId)
			this.ElementCreateDropdown(this.gameDropDownId, this.objects, function(eventData){ _this.OnElementClicked(eventData); })
			ElementPositionFix(this.gameDropDownId, this.fontSize, this.x, this.y, this.width, this.height)

			let element = document.getElementById(this.gameDropDownId)
			if(element == null)
			{
				return;
			}
	
			if(this.selection >= element.length)
			{
				element.Value = "Unknown Selection"
				return;
			}
			element.selectedIndex = this.selection
			// console.log("elementSelect.selectedIndex="+elementSelect.selectedIndex+" elementSelection.innerHTML="+elementSelection.innerHTML)
			
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
		this.updateOnDraw = true
	}

	Hide()
	{
		this.visible = false
	}

	MarkUnused()
	{
		this.unused = true
	}

	OnElementClicked(newSelectedIndex)
	{
		this.selection = newSelectedIndex
		this.RaiseEventSelectionChanged(this.selection)
	}

}
