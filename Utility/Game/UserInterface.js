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

		this.functionCallHooks.DrawProcess = new Utility.FunctionCallHook('DrawProcess')
		this.functionCallHooks.CommonClick = new Utility.FunctionCallHook('CommonClick')
		this.functionCallHooks.CommonKeyDown = new Utility.FunctionCallHook('CommonKeyDown')

		let _this = this
		this.functionCallHooks.DrawProcess.RegisterEventAfter(function(){ _this.OnDrawProcess(); })
		this.functionCallHooks.CommonClick.RegisterEventAfter(function(){ _this.OnClick(); })
		this.functionCallHooks.CommonKeyDown.RegisterEventAfter(function(){ _this.OnKeyDown(); })

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

	AddTextArea(x, y, width, height, fontSize, maxLength, text, screens, visible)
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

		let newTextArea = new Utility.Game.UiElements.TextArea(newGameTextAreaId, x, y, width, height, fontSize, maxLength, text, screens, visible)
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
	
	IsElementOnScreen(element)
	{
		let currentScreen = this.gameScreenProperties.GetCurrentScreen()
		if(currentScreen == null)
		{
			return false
		}

		return (element.screens.length == 0 || element.screens.includes(currentScreen) == true)
	}

	//Methods to Draw specific GUI Elements
	DrawButton(button)
	{
		if(button.visible == false || this.IsElementOnScreen(button) == false) // If button isn't visible or the current screen is not it's active screen...
		{
			//Don't draw it
			return;
		}

		if(button.enabled == true) // If button is enabled...
		{
			//Draw enabled button
			DrawButton(button.x, button.y, button.width, button.height, button.text, button.colorActive, button.image, button.tooltip)
		}
		else // If button is disabled...
		{
			//Draw disabled button
			DrawButton(button.x, button.y, button.width, button.height, button.text, button.colorInactive, button.image, button.tooltip)
		}

	}

	DrawTextLabel(textLabel)
	{
		if(textLabel.visible == false || this.IsElementOnScreen(textLabel) == false) // If text label isn't visible or the current screen is not it's active screen...
		{
			//Don't draw it
			return;
		}

		switch(textLabel.mode)
		{
			case "Wrap": //If the text label's mode is "Wrap"...
				DrawTextWrap(textLabel.text, textLabel.x+(textLabel.width/2), textLabel.y+(textLabel.height/2), textLabel.width, textLabel.height, textLabel.colorForeground, textLabel.colorBackground, null)
				break;

			case "Fit": //If the text label's mode is "Fit"...
				DrawTextFit(textLabel.text, textLabel.x+(textLabel.width/2), textLabel.y+(textLabel.height/2), textLabel.width, textLabel.colorForeground)
				break;

			case "Default": //If the text label's mode is "Default"...
			default: // Every unknown mode is regarded as "Default"
				DrawText(textLabel.text, textLabel.x+(textLabel.width/2), textLabel.y+(textLabel.height/2), textLabel.colorForeground, textLabel.colorBackground)
				break;
				
		}

	}

	DrawTextArea(textArea)
	{
		if(textArea.visible == false || this.IsElementOnScreen(textArea) == false) // If text area isn't visible or the current screen is not it's active screen...
		{
			if(textArea.gameTextAreaExists == true) // If the underlying element extist...
			{
				//Remove it
				ElementRemove(textArea.gameTextAreaId)
				textArea.gameTextAreaExists = false
			}
			//Don't draw it
			return;
		}

		if(textArea.gameTextAreaExists == false)
		{
			ElementCreateTextArea(textArea.gameTextAreaId)
			textArea.UpdateText()
			textArea.gameTextAreaExists = true
		}
		ElementPositionFix(textArea.gameTextAreaId, textArea.fontSize, textArea.x, textArea.y, textArea.width, textArea.height)
		textArea.RaiseEventTextChangedIfTextChanged()

	}

	DrawTextField(textField)
	{
		if(textField.visible == false || this.IsElementOnScreen(textField) == false) // If text area isn't visible or the current screen is not it's active screen...
		{
			if(textField.gameTextInputExists == true) // If the underlying element extist...
			{
				//Remove it
				ElementRemove(textField.gameTextInputId)
				textField.gameTextInputExists = false
			}
			//Don't draw it
			return;
		}

		if(textField.gameTextInputExists == false) // If the underlying element does not extis...
		{
			ElementCreateInput(textField.gameTextInputId, "text", textField.GetText(), textField.maxLength)
			textField.UpdateText()
			textField.gameTextInputExists = true
		}
		ElementPositionFix(textField.gameTextInputId, textField.fontSize, textField.x, textField.y, textField.width, textField.height)
		textField.RaiseEventTextChangedIfTextChanged()

	}

	//Event Handlers
	OnDrawProcess()
	{
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
			this.DrawButton(button)
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
			this.DrawTextLabel(textLabel)
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
			this.DrawTextArea(textArea)
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
			this.DrawTextField(textField)
		}
	}

	OnClick()
	{
		for(let i=0; i<this.buttons.length; i++) // For each button...
		{
			let button = this.buttons[i]
			if(button.visible == true && button.enabled == true && this.IsElementOnScreen(button) == true) // If button is visible, enabled and the current screen is it's active screen...
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
