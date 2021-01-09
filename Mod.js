"use strict";

if(Mod == undefined)
{
	var Mod = {}
}

Mod = class
{
	constructor(initBasePath)
	{
		this.basePath = initBasePath
		this.addonName = "BC-Util"
	
		//Game
		this.LogLoadSection("Game Interface")
		this.gameAssets = new Utility.Game.Assets()
		this.gameCharacters = new Utility.Game.Characters(this.gameAssets)
		this.gameBeeps = new Utility.Game.Beeps()
		this.gameFriendList = new Utility.Game.FriendList()
		this.gameScreenProperties = new Utility.Game.ScreenProperties()
		this.gameWardrobe = new Utility.Game.Wardrobe()
		this.gameUserInterface = new Utility.Game.UserInterface(this.gameScreenProperties)

		this.autoResponseEvents = {}

		//Other
		this.LogLoadSection("Wardrobe Utilities")
		this.wardrobeUtilities = new WardrobeUtilities.WardrobeUtilities(this.gameWardrobe, this.gameCharacters, 48)

		this.LogLoadSection("Appearance Utilities")
		this.appearanceUtilities = new AppearanceUtilities.AppearanceUtilities(this.gameCharacters, this.gameScreenProperties)

		this.LogLoadSection("Beep Messages")
		let beepCommunicator = new BeepMessages.BeepCommunicator(this.gameBeeps)
		this.beepMessenger = new BeepMessages.BeepMessenger(this.gameCharacters, this.gameFriendList, beepCommunicator)

		//Gui
		this.LogLoadSection("Graphical user Interfaces")
		this.guiWardrobeUtilities = new Gui.WardrobeUtilities(this.gameUserInterface, this.wardrobeUtilities)
		this.guiAppearanceUtilities = new Gui.AppearanceUtilities(this.gameUserInterface, this.gameScreenProperties, this.appearanceUtilities)
		this.guiDirectChat = new Gui.DirectChat(this.gameCharacters, this.gameUserInterface, this.gameFriendList, this.beepMessenger)

		this.LogFinishedLoading()

	}

	LogLoadSection(sectionName)
	{
		console.log(this.addonName + ": Loading " + sectionName)
	}

	LogFinishedLoading()
	{
		console.log(this.addonName + ": Finished loading")
	}

	LogStartSection(sectionName)
	{
		console.log(this.addonName + ": Starting " + sectionName)
	}
	
	LogFinishedStarting()
	{
		console.log(this.addonName + ": Finished startup")
	}

	LogPerformUnitTest(testName)
	{
		console.log(this.addonName + ": Performing Unit Tests for " + testName)
	}

	Run()
	{

	}

}

console.log("Mod Loaded")
