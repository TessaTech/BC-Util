"use strict";

if(Gui == undefined)
{
	var Gui = {}
}

Gui.WardrobeUtilities = class
{
	// gameUserInterface = null
	// wardrobeUtilities = null

	// state = ""

	// activeScreens = []

	// buttonImport = { }
	// buttonExport = { }
	// textAreaImportExport = { }
	// buttonImportAccept = { }
	// buttonImportExportCancel = { }

	constructor(initGameUserInterface, initWardrobeUtilities)
	{
		this.gameUserInterface = initGameUserInterface
		this.wardrobeUtilities = initWardrobeUtilities

		this.state = ""

		//CreateTextArea(this.importExportBoxName)

		this.importExportScreens = ["AppearanceWardrobe"]
		let _this = this

		this.buttonImport = this.gameUserInterface.AddButton(1415, 25, 90, 40,
			"Import", "White", "#808080", "", "Import a previously exported wardrobe",
			this.importExportScreens, true, true)
		this.buttonExport = this.gameUserInterface.AddButton(1415, 75, 90, 40,
			"Export", "White", "#808080", "", "Export then current wardrobe",
			this.importExportScreens, true, true)
		this.textAreaImportExport = this.gameUserInterface.AddTextArea(100, 160, 1790, 750, 12, -1, "", this.importExportScreens, false)
		this.buttonImportAccept = this.gameUserInterface.AddButton(200, 60, 90, 90,
			"", "White", "#808080", "Icons/Accept.png", "Import",
			this.importExportScreens, false, true)
		this.buttonImportExportCancel = this.gameUserInterface.AddButton(100, 60, 90, 90,
			"", "White", "#808080", "Icons/Cancel.png", "Back",
			this.importExportScreens, false, true)

		this.buttonImport.RegisterEventClicked(function(){ _this.OnButtonImportClick(); })
		this.buttonExport.RegisterEventClicked(function(){ _this.OnButtonExportClick(); })
		this.buttonImportAccept.RegisterEventClicked(function(){ _this.OnButtonImportAcceptClick(); })
		this.buttonImportExportCancel.RegisterEventClicked(function(){ _this.OnButtonImportExportCancelClick(); })

	}

	OnButtonImportClick()
	{
		if(this.state != "") // If another option is already active...
		{
			//Don't enter this option
			return;
		}

		this.state = "Import"

		this.textAreaImportExport.SetText("")
		this.textAreaImportExport.Show()
		this.buttonImportAccept.Show()
		this.buttonImportExportCancel.Show()

	}

	OnButtonExportClick()
	{
		let data
		let text
		
		if(this.state != "") // If another option is already active...
		{
			//Don't enter this option
			return;
		}

		this.state = "Export"

		data = this.wardrobeUtilities.PackAll()
		try
		{
			text = JSON.stringify(data)
		}
		catch(e)
		{
			text = "Error while exporting wardrobe to JSON: " + e.message
		}

		this.textAreaImportExport.SetText(text)
		this.textAreaImportExport.Show()
		this.buttonImportExportCancel.Show()

	}

	OnButtonImportAcceptClick()
	{
		if(this.state != "Import")
		{
			return;
		}

		let text = this.textAreaImportExport.GetText()
		let data

		try
		{
			data = JSON.parse(text)
		}
		catch (e)
		{
			data = null
			this.textAreaImportExport.SetText("Error while importing wardrobe from JSON: " + e.message)
		}

		if(data != null)
		{
			this.wardrobeUtilities.UnpackAll(data)
			this.wardrobeUtilities.Save()

			this.state = ""
	
			this.textAreaImportExport.Hide()
			this.buttonImportAccept.Hide()
			this.buttonImportExportCancel.Hide()
		}
	}

	OnButtonImportExportCancelClick()
	{
		this.state = ""

		this.textAreaImportExport.Hide()
		this.buttonImportAccept.Hide()
		this.buttonImportExportCancel.Hide()
	}

}
