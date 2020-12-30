"use strict";

if(BeepMessages == undefined)
{
	var BeepMessages = {}
}

BeepMessages.BeepCommunicator = class
{
	constructor(initBeeps)
	{
		this.gameBeeps = initBeeps

		this.supportedVersions =
		[
			{
				versionNumber: 0,
				beepTypes:
				{
					versionRequest: "BcuVersionRequest",
					versionResponse: "BcuVersionResponse",
					message: "BcuMessage"
				}
			}
		]
		this.latestVersion = this.supportedVersions[this.supportedVersions.length-1]

		this.eventReceivedMessage = new Utility.Event()
		this.eventReceivedVersion = new Utility.Event()

		let _this = this
		this.gameBeeps.RegisterEventReceivedBeep(function(memberNumber, memberName, beepType){ _this.OnGameBeepsReceivedBeep(memberNumber, memberName, beepType); })
		
	}

	RegisterEventReceivedMessage(eventHandler)
	{
		return this.eventReceivedMessage.Register(eventHandler)
	}

	UnregisterEventReceivedMessage(eventId)
	{
		return this.eventReceivedMessage.Unregister(eventId)
	}

	RegisterEventReceivedVersion(eventHandler)
	{
		return this.eventReceivedVersion.Register(eventHandler)
	}

	UnregisterEventReceivedVersion(eventId)
	{
		return this.eventReceivedVersion.Unregister(eventId)
	}

	OnGameBeepsReceivedBeep(memberNumber, memberName, beepType)
	{
		if(typeof beepType != "object" || beepType.version == null || typeof beepType.version != "number") // If received data is valid...
		{
			return;
		}
		let versionInfo = this.supportedVersions.find(x => x.versionNumber == beepType.version)
		if(versionInfo == null) // If the message's version is supported...
		{
			console.log("Beep Communicator: Received Beep for unsuported version " + beepType.version)
			return;
		}

		let success = false
		switch(versionInfo.versionNumber)
		{
			case 0: success = this.HandleMessageBeepVersion0(versionInfo, memberNumber, memberName, beepType); break;
			default:
				console.error("Beep Communicator: Version of received beep communication (v" + beepType.version + ") is marked as supported but has no handling");
				break;
		}

	}

	HandleMessageBeepVersion0(versionInfo, memberNumber, memberName, beepType)
	{
		if(beepType.type == null || typeof beepType.type != "string")
		{
			console.warn("Beep Communicator: Invalid Beep Type for version " + versionInfo.versionNumber)
			return false;
		}
		if(beepType.type == versionInfo.beepTypes.message) // If it's a message...
		{
			if(beepType.message == null || typeof beepType.message != "string")
			{
				console.warn("Beep Communicator: Invalid Message for Beep Type " + beepType.type + " at version " + versionInfo.versionNumber)
				return false;
			}
			console.log("Received Message - "+memberName+"("+memberNumber+"): "+beepType.message+"[v"+beepType.version+"]")
			this.eventReceivedMessage.Raise(memberNumber, memberName, beepType.version, beepType.message)
		}
		else if(beepType.type == versionInfo.beepTypes.versionRequest) // If it's a version request...
		{
			console.log("Received Version Request of "+memberName+"("+memberNumber+")")
			this.SendVersionResponse(memberNumber)
		}
		else if(beepType.type == versionInfo.beepTypes.versionResponse) // If it's a version response...
		{
			console.log("Received Version Response of "+memberName+"("+memberNumber+")")
			this.eventReceivedVersion.Raise(memberNumber, memberName, beepType.version)
		}
		else
		{
			console.warn("Beep Communicator: Unknown Beep Type " + beepType.type + " at version " + versionInfo.versionNumber)
		}

		return true;
	}

	SendVersionRequest(memberNumber)
	{
		let beepType =
		{
			version: this.latestVersion.versionNumber,
			type: this.latestVersion.beepTypes.versionRequest
		}
		console.log("Sending version request to "+memberNumber)
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

	SendVersionResponse(memberNumber)
	{
		let beepType =
		{
			version: this.latestVersion.versionNumber,
			type: this.latestVersion.beepTypes.versionResponse
		}
		console.log("Sending version response to "+memberNumber)
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

	SendMessage(memberNumber, version, message)
	{
		switch(version)
		{
			case 0: this.SendMessageVersion0(memberNumber, message); break;
			default: break;
		}
	}

	SendMessageVersion0(memberNumber, message)
	{
		let beepType =
		{
			version: this.latestVersion.versionNumber,
			type: this.latestVersion.beepTypes.message,
			message: message
		}
		console.log("Sending message to "+memberNumber+": "+message)
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

}
