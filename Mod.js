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
		this.gameUserInterface = new Utility.Game.UserInterface()
		this.gameWardrobe = new Utility.Game.Wardrobe()

		this.autoResponseEvents = {}

		//Other
		this.LogLoadSection("Wardrobe Utilities")
		this.wardrobeUtilities = new WardrobeUtilities.WardrobeUtilities(this.gameWardrobe, this.gameCharacters, 48)

		//Gui
		this.LogLoadSection("Graphical user Interfaces")
		this.guiWardrobeUtilities = new Gui.WardrobeUtilities(this.gameUserInterface, this.wardrobeUtilities)

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
