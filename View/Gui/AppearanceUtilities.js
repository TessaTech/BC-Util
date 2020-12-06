"use strict";

if(Gui == undefined)
{
	var Gui = class {}
}

Gui.AppearanceUtilities = class
{
	constructor(initGameUserInterface, initGameScreenProperties, initAppearanceUtilities)
	{
		this.gameUserInterface = initGameUserInterface
		this.gameScreenProperties = initGameScreenProperties
		this.appearanceUtilities = initAppearanceUtilities

		this.appearanceLayerOverrideScreens = ["AppearanceCloth"]

		this.textLabelAppearanceLayer = this.gameUserInterface.AddTextLabel(1175, 35, 90, 25, "Layer", "#000000", null, "text", this.appearanceLayerOverrideScreens, true)
		this.textFieldAppearanceLayer = this.gameUserInterface.AddTextField(1175, 70, 90, 25, 24, 3, "0", this.appearanceLayerOverrideScreens, true)
		
		let _this = this
		this.gameScreenProperties.RegisterEventAppearanceEnteredClothSelection(function(newText) { _this.OnAppearanceEnteredClothSelection(newText); })
		this.textFieldAppearanceLayer.RegisterEventTextChanged(function(newText) { _this.OnTextLabelAppearanceLayerChanged(newText); })

	}

	OnAppearanceEnteredClothSelection()
	{
		this.textFieldAppearanceLayer.SetText(this.appearanceUtilities.GetScreenAppearanceLayer())
	}

	OnTextLabelAppearanceLayerChanged()
	{
		let text = this.textFieldAppearanceLayer.GetText()
		if(isNaN(text) == true)
		{
			return;
		}
		this.appearanceUtilities.SetScreenAppearanceLayer(parseInt(text, 10))
	}

}
