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

	// ElementCreateDropdown(elementId, elementOptions, clickEventListener)
	// {
	// 	if (document.getElementById(elementId) == null) {
	// 		// Create the all enclosing <div>
	// 		let dropDownDiv = document.createElement("DIV")
	// 		dropDownDiv.style =	"position: relative;"+
	// 							"font-family: Arial, sans-serif;"+
	// 							"display: none;"+
	// 							"color: black;"+
	// 							"padding: 0.2em;"+
	// 							"cursor: pointer;"+
	// 							"user-select: none;"
	// 		dropDownDiv.setAttribute("ID", elementId)
	// 		// Create the <select> tag
	// 		let dropDownSelect = document.createElement("select")
	// 		dropDownSelect.style = "display: none;"
	// 		dropDownSelect.setAttribute("Name", elementId + "-select")
	// 		dropDownSelect.setAttribute("ID", elementId + "-select")
	// 		// Create the <div> for the options
	// 		let dropDownDivOptions = document.createElement("DIV")
	// 		dropDownDivOptions.style =	"position: absolute;"+
	// 									"background-color: white;"+
	// 									"top: 100%;"+
	// 									"left: 0;"+
	// 									"right: 0;"+
	// 									"z-index: 99;"+
	// 									"display: none;"+
	// 									"color: black;"+
	// 									"padding: 0.2em;"+
	// 									"cursor: pointer;"+
	// 									"user-select: none;"+
	// 									"position: absolute;"+
	// 									"background-color: white;"+
	// 									"top: 100%;"+
	// 									"left: 0;"+
	// 									"right: 0;"+
	// 									"z-index: 99;"+
	// 									"display: none;"
	// 		// Create <option> and inner <div> tags for all Options in the list
	// 		let tmpOption = null
	// 		let tmpInnerDiv = null
	// 		for (let i = 0; i < elementOptions.length; i++)
	// 		{
	// 			tmpOption = document.createElement("option");
	// 			tmpInnerDiv = document.createElement("DIV");
	
	// 			tmpOption.setAttribute("value", elementOptions[i]);
	// 			tmpOption.innerHTML = elementOptions[i];
	// 			tmpInnerDiv.innerHTML = elementOptions[i];
	// 			tmpInnerDiv.addEventListener("click", function (e)
	// 				{
	// 					// when an item is clicked, update the original select box, and the selected item:
	// 					let relatedSelect = this.parentNode.parentNode.getElementsByTagName("select")[0]; // Representation of the select tag
	// 					let relatedDropDown = this.parentNode.previousSibling; // Representation of the dropdown box
	// 					for (let j = 0; j < s.length; j++) {
	// 						if (relatedSelect.options[j].innerHTML == this.innerHTML) {
	// 							relatedSelect.selectedIndex = j; // Fake the selection of an option
	// 							relatedDropDown.innerHTML = this.innerHTML; // Update the drop down box
	// 							let y = this.parentNode.getElementsByClassName("same-as-selected");
	// 							for (let k = 0; k < y.length; k++) {
	// 								y[k].removeAttribute("class");
	// 							}
	// 							this.setAttribute("class", "same-as-selected");
	// 							break;
	// 						}
	// 					}
	// 					relatedDropDown.click(); // Evove a click events
	// 					relatedSelect.dispatchEvent(new Event("change")); // Evoke a onChange events
	// 				});
	// 			dropDownSelect.appendChild(tmpOption);
	// 			dropDownDivOptions.appendChild(tmpInnerDiv);
	// 		}
	// 		// Cretae the div for the selected item
	// 		let selectedItem = document.createElement("DIV");
	// 		selectedItem.style =	"background-color: white;"+
	// 								"color: black;"+
	// 								"background-image: url('../Icons/Dropdown.png');"+
	// 								"background-repeat: no-repeat, repeat;"+
	// 								"background-position: right .7em top 50%, 0 0;"+
	// 								"background-size: .65em auto, 100%;"+
	// 								"color: black;"+
	// 								"padding: 0.2em;"+
	// 								"cursor: pointer;"+
	// 								"user-select: none;"
	// 		selectedItem.innerHTML = dropDownSelect.options[0].innerHTML;
	// 		selectedItem.addEventListener("click", function (e) {
	// 			//when the select box is clicked, close any other select boxes, and open/close the current select box:
	// 			e.stopPropagation();
	// 			ElementCloseAllSelect(this);
	// 			this.nextSibling.classList.toggle("select-hide");
	// 		});
	// 		// add an event listener to the <select> tag
	// 		if (clickEventListener != null)
	// 		{
	// 			dropDownSelect.addEventListener("change", clickEventListener)
	// 		}
	// 		// Add alle the items to the enclosing <di>
	// 		dropDownDiv.appendChild(dropDownSelect);
	// 		dropDownDiv.appendChild(selectedItem);
	// 		dropDownDiv.appendChild(dropDownDivOptions);
	// 		document.body.appendChild(dropDownDiv);
	// 		document.addEventListener("click", ElementCloseAllSelect);
	// 	}
	// }

	// ElementCreateDropdown(elementId, elementOptions, clickEventListener)
	// {
	// 	if (document.getElementById(elementId) != null)
	// 	{
	// 		return;
	// 	}

	// 	// Create the <select> tag
	// 	let dropDown = document.createElement("select")
	// 	dropDown.style = ""
	// 	dropDown.setAttribute("Name", elementId)
	// 	dropDown.setAttribute("ID", elementId)
	// 	// Create <option> and inner <div> tags for all Options in the list
	// 	let tmpOption = null
	// 	for (let i = 0; i < elementOptions.length; i++)
	// 	{
	// 		tmpOption = document.createElement("option");
	// 		tmpOption.innerHTML = elementOptions[i]
	// 		dropDown.appendChild(tmpOption);
	// 	}
	// 	// add an event listener to the <select> tag
	// 	if (clickEventListener != null)
	// 	{
	// 		dropDown.addEventListener("change", function(eventData){ clickEventListener(eventData); })
	// 	}
		
	// 	document.body.appendChild(dropDown);
		
	// }

	ElementCreateDropdown(elementId, elementOptions, clickEventListener)
	{
		let dropDown = document.createElement("div")
		let dropDownSelection = document.createElement("span")
		let dropDownList = document.createElement("ul")
		
		dropDown.setAttribute("Name", elementId);
		dropDown.setAttribute("ID", elementId);

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
							"margin: 0px;"

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
									"cursor: pointer;"

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
								"overflow-y: auto;"

		let dropDownListElementStyle =	"position: relative;"+
										"display: block;"+
										"height: auto;"+
										"padding: 0px;"+
										"border: 0px;"+
										"margin: 0px;"+
										"cursor: pointer;"
		


		if(this.selection < elementOptions.length)
		{
			dropDownSelection.innerHTML = elementOptions[this.selection]
		}
		else
		{
			dropDownSelection.innerHTML = "<br/>"
		}

		let tmlListElement = null
		for (let i = 0; i < elementOptions.length; i++)
		{
			tmlListElement = document.createElement("li");

			tmlListElement.style = dropDownListElementStyle

			tmlListElement.innerHTML = elementOptions[i]

			let _elementIndex = i
			let _elementValue = tmlListElement
			tmlListElement.addEventListener("click", function(e)
			{
				e.stopPropagation()
				dropDownSelection.innerHTML = _elementValue.innerHTML
				dropDownList.style.display = "none"
				clickEventListener(_elementIndex)
			
			})

			dropDownList.appendChild(tmlListElement);
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
