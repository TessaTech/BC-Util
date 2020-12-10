"use strict";

if(AppearanceUtilities == undefined)
{
	var AppearanceUtilities = {}
}

AppearanceUtilities.AppearanceUtilities = class
{
	constructor(initGameCharacters, initScreenProperties)
	{
		this.gameCharacters = initGameCharacters
		this.screenProperties = initScreenProperties

	}

	SetScreenAppearanceLayer(priority)
	{
		let player = this.screenProperties.AppearanceCharacter()
		let assetGroup = this.screenProperties.AppearanceFocusGroup()

		this.gameCharacters.SetLayerPriority(player, assetGroup, priority, false)

	}

	GetScreenAppearanceLayer()
	{
		let player = this.screenProperties.AppearanceCharacter()
		let assetGroup = this.screenProperties.AppearanceFocusGroup()

		let retVar = this.gameCharacters.GetLayerPriority(player, assetGroup)

		return retVar

	}

}
