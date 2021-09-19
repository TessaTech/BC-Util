"use strict";

window.addEventListener("load", onLoad, true)

function onLoad(event)
{
	function AddScriptFile(scriptFileName)
	{
		let retVar
		let ready
		let script
		function onReady(){ ready = true; }

		ready = false
		script = document.createElement("script")
		//script.type = 'text/javascript'
		script.src = chrome.runtime.getURL(scriptFileName)
		//script.src = browser.extension.getURL(scriptFileName)
		retVar = document.head.appendChild(script)

		retVar.onload = onReady()
		while(ready == false){}

		return retVar
	}
	
	function AddScript(scriptCode)
	{
		let script = document.createElement("script")
		//script.type = 'text/javascript'
		//script.appendChild(document.createTextNode(scriptCode))
		script.text = scriptCode
		return document.head.appendChild(script)
	}

	console.log("BC-Util: Injecting Extension...")
	
	AddScriptFile("Utility/Event.js")
	AddScriptFile("Utility/FunctionCallHook.js")
	AddScriptFile("Utility/Utility.js")
	
	AddScriptFile("Utility/Game/UiElements/Button.js")
	AddScriptFile("Utility/Game/UiElements/DropDown.js")
	AddScriptFile("Utility/Game/UiElements/TextLabel.js")
	AddScriptFile("Utility/Game/UiElements/TextArea.js")
	AddScriptFile("Utility/Game/UiElements/HtmlTextArea.js")
	AddScriptFile("Utility/Game/UiElements/TextField.js")
	
	AddScriptFile("Utility/Game/Assets.js")
	AddScriptFile("Utility/Game/Beeps.js")
	AddScriptFile("Utility/Game/Characters.js")
	AddScriptFile("Utility/Game/FriendList.js")
	AddScriptFile("Utility/Game/UserInterface.js")
	AddScriptFile("Utility/Game/Wardrobe.js")
	AddScriptFile("Utility/Game/ScreenProperties.js")
	AddScriptFile("Utility/Game/Server.js")
	
	AddScriptFile("Model/WardrobeUtilities/WardrobeUtilities.js")
	AddScriptFile("Model/AppearanceUtilities/AppearanceUtilities.js")
	AddScriptFile("Model/BeepMessages/BeepCommunicator.js")
	AddScriptFile("Model/BeepMessages/BeepConversation.js")
	AddScriptFile("Model/BeepMessages/BeepMessenger.js")
	
	AddScriptFile("View/Gui/WardrobeUtilities.js")
	AddScriptFile("View/Gui/AppearanceUtilities.js")
	AddScriptFile("View/Gui/DirectChat.js")

	AddScriptFile("Mod.js")
	
	let extPath = chrome.runtime.getURL("")
	console.log("ExtPath: " + extPath)
	let funcStartBcUtil =
		"var mod = null;"+
		"function StartBcUtil()\n"+
		"{\n"+
		"	try\n"+
		"	{\n"+
		"		mod = new Mod(\""+extPath+"\");\n"+
		"		mod.Run();\n"+
		"		console.log(\"BC-Util: Extension Injected\");\n"+
		"	}\n"+
		"	catch(ex)\n"+
		"	{\n"+
		"		console.log(\"BC-Util: Failed to start. Trying again...\");\n"+
		"		console.log(ex)\n"+
		"		if(mod != null)\n"+
		"		{\n"+
		"			mod = null;\n"+
		"		}\n"+
		"		setTimeout(function(){ StartBcUtil(); }, 25);\n"+
		"	}\n"+
		"}"
	console.log(funcStartBcUtil);

	let timeoutStartBcUtil = "setTimeout(function(){ StartBcUtil(); }, 25)"

	AddScript(funcStartBcUtil)
	AddScript(timeoutStartBcUtil)

}
