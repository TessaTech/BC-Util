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

	constructor()
	{
		this.functionCallHooks = {}
		this.buttons = []
		this.textAreas = []
		this.deletedTextAreaIds = []
		

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

	AddTextArea(x, y, width, height, fontSize, text, screens, visible)
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

		let newTextArea = new Utility.Game.UiElements.TextArea(newGameTextAreaId, x, y, width, height, fontSize, text, screens, visible)
		this.textAreas.push(newTextArea)

		return newTextArea
	}

	GetCurrentScreen()
	{
		return CurrentScreen
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
		let currentScreen = this.GetCurrentScreen()
		if(currentScreen == null)
		{
			return false
		}

		return (element.screens.length == 0 || element.screens.includes(currentScreen) == true)
	}

	OnDrawProcess()
	{
		for(let i=0; i<this.buttons.length; i++) // For each button...
		{
			let button = this.buttons[i]
			if(button.unused == true) // If button is marked as unused...
			{
				//Remove it from handling
				this.buttons.splice(i, 1)
				i = i - 1;
			}
			else if(button.visible == true && this.IsElementOnScreen(button) == true) // If button is visible and the current screen is it's active screen...
			{
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
		}

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
			}
			else if(textArea.visible == true && this.IsElementOnScreen(textArea) == true) // If button is visible and the current screen is it's active screen...
			{
				if(textArea.gameTextAreaExists == false)
				{
					ElementCreateTextArea(textArea.gameTextAreaId)
					textArea.UpdateText()
					textArea.gameTextAreaExists = true
				}
				ElementPositionFix(textArea.gameTextAreaId, textArea.fontSize, textArea.x, textArea.y, textArea.width, textArea.height)
			}
			else if(textArea.gameTextAreaExists == true)
			{
				ElementRemove(textArea.gameTextAreaId)
				textArea.gameTextAreaExists = false
			}
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
					button.RaiseClickEvent()
				}
				
			}
		}
	}

	OnKeyDown()
	{

	}

}
