"use strict";

if(Utility == undefined)
{
	var Utility = {}
}
if(Utility.Game == undefined)
{
	Utility.Game = {}
}

Utility.Game.UserInterface = class
{
	// functionCallHooks = {}
	// buttons = []
	// textAreas = []
	// deletedTextAreaIds = []

	constructor(initGameScreenProperties)
	{
		this.gameScreenProperties = initGameScreenProperties

		this.functionCallHooks = {}
		this.buttons = []
		this.textLabels = []
		this.textAreas = []
		this.deletedTextAreaIds = []
		this.textFields = []
		this.deletedTextFieldIds = []
		this.dropDowns = []
		this.deletedDropDownIds = []

		this.functionCallHooks.DrawProcess = new Utility.FunctionCallHook('DrawProcess')
		this.functionCallHooks.CommonClick = new Utility.FunctionCallHook('CommonClick')
		this.functionCallHooks.CommonKeyDown = new Utility.FunctionCallHook('CommonKeyDown')

		let _this = this
		this.functionCallHooks.DrawProcess.RegisterEventAfter(function(){ _this.OnDrawProcess(); })
		this.functionCallHooks.CommonClick.RegisterEventBefore(function(){ _this.OnClick(); })
		this.functionCallHooks.CommonKeyDown.RegisterEventBefore(function(){ _this.OnKeyDown(); })

	}

	BlockGameClick()
	{
		this.functionCallHooks.CommonClick.BlockHookedFunction()
	}

	BlockNextGameClick()
	{
		this.functionCallHooks.CommonClick.BlockHookedFunctionOnce()
	}

	AllowGameClick()
	{
		this.functionCallHooks.CommonClick.AllowHookedFunction()
	}

	BlockGameKeyDown()
	{
		this.functionCallHooks.CommonKeyDown.BlockHookedFunction()
	}

	AllowGameKeyDown()
	{
		this.functionCallHooks.CommonKeyDown.AllowHookedFunction()
	}

	AddButton(x, y, width, height, text, activeColor, inactiveColor, image, tooltip, activeScreens, visible, enabled)
	{
		let newButton = new Utility.Game.UiElements.Button(x, y, width, height, text, activeColor, inactiveColor, image, tooltip, activeScreens, visible, enabled)
		
		this.buttons.push(newButton)

		return newButton
	}

	//initX, initY, initWidth, initHeight, initText, initColorForeground, initColorBackground, initMode, initScreens, initVisible
	AddTextLabel(x, y, width, height, text, foregroundColor, backgroundColor, mode, screens, visible)
	{
		let newTextLabel = new Utility.Game.UiElements.TextLabel(x, y, width, height, text, foregroundColor, backgroundColor, mode, screens, visible)

		this.textLabels.push(newTextLabel)

		return newTextLabel
	}

	AddTextArea(x, y, width, height, fontSize, maxLength, text, screens, visible, scrollToEndOnShow)
	{
		let newGameTextAreaId = "Utility.Game.UserInterface.TextArea_"

		if(this.deletedTextAreaIds.length > 0)
		{
			newGameTextAreaId = this.deletedTextAreaIds.pop()
		}
		else
		{
			newGameTextAreaId = "Utility.Game.UserInterface.TextArea_" + this.textAreas.length.toString()
		}

		let newTextArea = new Utility.Game.UiElements.TextArea(newGameTextAreaId, x, y, width, height, fontSize, maxLength, text, screens, visible, scrollToEndOnShow)
		this.textAreas.push(newTextArea)

		return newTextArea
	}

	AddHtmlTextArea(x, y, width, height, fontSize, maxLength, text, screens, visible, scrollToEndOnShow)
	{
		let newGameTextAreaId = "Utility.Game.UserInterface.TextArea_"

		if(this.deletedTextAreaIds.length > 0)
		{
			newGameTextAreaId = this.deletedTextAreaIds.pop()
		}
		else
		{
			newGameTextAreaId = "Utility.Game.UserInterface.TextArea_" + this.textAreas.length.toString()
		}

		let newTextArea = new Utility.Game.UiElements.HtmlTextArea(newGameTextAreaId, x, y, width, height, fontSize, maxLength, text, screens, visible, scrollToEndOnShow)
		this.textAreas.push(newTextArea)

		return newTextArea
	}

	AddTextField(x, y, width, height, fontSize, maxLength, text, screens, visible)
	{
		let newGameTextFieldId = "Utility.Game.UserInterface.TextField_"
		
		if(this.deletedTextFieldIds.length > 0)
		{
			newGameTextFieldId = this.deletedTextFieldIds.pop()
		}
		else
		{
			newGameTextFieldId = "Utility.Game.UserInterface.TextField_" + this.textFields.length.toString()
		}

		let newTextField = new Utility.Game.UiElements.TextField(newGameTextFieldId, x, y, width, height, fontSize, maxLength, text, screens, visible)
		
		this.textFields.push(newTextField)

		return newTextField
	}

	AddDropDown(x, y, width, height, fontSize, objects, selectedIndex, screens, visible)
	{
		let newGameDropDownId = "Utility.Game.UserInterface.DropDown_"
		
		if(this.deletedDropDownIds.length > 0)
		{
			newGameDropDownId = this.deletedDropDownIds.pop()
		}
		else
		{
			newGameDropDownId = "Utility.Game.UserInterface.DropDown_" + this.textFields.length.toString()
		}

		let newDropDown = new Utility.Game.UiElements.DropDown(newGameDropDownId, x, y, width, height, fontSize, objects, selectedIndex, screens, visible)
		this.dropDowns.push(newDropDown)

		return newDropDown
	}

	//Internal
	GetMousePosition()
	{
		return { x:MouseX, y:MouseY }
	}

	IsMouseInSquare(x, y, width, height)
	{
		var mousePos = {}
		
		mousePos = this.GetMousePosition()
		return (mousePos.x >= x) && (mousePos.x <= x + width) && (mousePos.y >= y) && (mousePos.y <= y + height);
	}

	//Event Handlers
	OnDrawProcess()
	{
		let currentScreen = this.gameScreenProperties.GetCurrentScreen()
		
		//Buttons
		for(let i=0; i<this.buttons.length; i++) // For each button...
		{
			let button = this.buttons[i]
			if(button.unused == true) // If button is marked as unused...
			{
				//Remove it from handling
				this.buttons.splice(i, 1)
				i = i - 1;
				continue;
			}
			button.Draw(currentScreen)
		}

		//Text Labels
		for(let i=0; i<this.textLabels.length; i++) // For each button...
		{
			let textLabel = this.textLabels[i]
			if(textLabel.unused == true) // If text label is marked as unused...
			{
				//Remove it from handling
				this.textLabel.splice(i, 1)
				i = i - 1;
				continue;
			}
			textLabel.Draw(currentScreen)
		}

		//Text Areas
		for(let i=0; i<this.textAreas.length; i++) // For each text area...
		{
			let textArea = this.textAreas[i]
			if(textArea.unused == true) // If button is marked as unused...
			{
				//Remove it from handling
				textArea.exists = false
				this.deletedTextAreaIds.push(textArea.gameTextAreaId)
				ElementRemove(textArea.gameTextAreaId)
				this.textAreas.splice(i, 1)
				i = i - 1;
				continue;
			}
			textArea.Draw(currentScreen)
		}

		//Text Fields
		for(let i=0; i<this.textFields.length; i++) // For each text area...
		{
			let textField = this.textFields[i]
			if(textField.unused == true) // If button is marked as unused...
			{
				//Remove it from handling
				textField.exists = false
				this.deletedTextFieldIds.push(textField.gameTextInputId)
				ElementRemove(textField.gameTextInputId)
				this.textFields.splice(i, 1)
				i = i - 1;
				continue;
			}
			textField.Draw(currentScreen)
		}

		//Drop Downs
		for(let i=0; i<this.dropDowns.length; i++) // For each text area...
		{
			let dropDown = this.dropDowns[i]
			if(dropDown.unused == true) // If button is marked as unused...
			{
				//Remove it from handling
				dropDown.exists = false
				this.deletedDropDownIds.push(dropDown.gameDropDownId)
				ElementRemove(dropDown.gameDropDownId)
				this.dropDowns.splice(i, 1)
				i = i - 1;
				continue;
			}
			dropDown.Draw(currentScreen)
		}
	}

	OnClick()
	{
		let currentScreen = this.gameScreenProperties.GetCurrentScreen()
		for(let i=0; i<this.buttons.length; i++) // For each button...
		{
			let button = this.buttons[i]
			if(button.visible == true && button.enabled == true && button.IsElementOnScreen(currentScreen) == true) // If button is visible, enabled and the current screen is it's active screen...
			{
				if(this.IsMouseInSquare(button.x, button.y, button.width, button.height)) // If mouse cursor is within the button's boundaries during the click...
				{
					//Raise the button's click event
					button.RaiseEventClicked()
				}
				
			}
		}
	}

	OnKeyDown()
	{

	}

}
