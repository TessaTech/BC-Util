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
		//Data Validity checks
		if(typeof beepType != "object") // If the beep type does not exist or is no object...
		{
			//It's no beep communicator message at all
			return;
		}
		if(typeof beepType.version != "number") // If the version does not exist or is no number...
		{
			//Maybe no beep communicator message, definitely not a valid one
			return;
		}
		let versionInfo = this.supportedVersions.find(x => x.versionNumber == beepType.version)
		if(versionInfo == null) // If the message's version is supported...
		{
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
		//Data Validity checks
		if(typeof beepType.type != "string") // If the type does not exist or is no string...
		{
			console.warn("Beep Communicator: Invalid Beep Type for version " + versionInfo.versionNumber)
			return false;
		}
		if(beepType.type == versionInfo.beepTypes.message) // If it's a message...
		{
			if(typeof beepType.message != "string") // If the message text does not exist or is no string...
			{
				console.warn("Beep Communicator: Invalid Message for Beep Type " + beepType.type + " at version " + versionInfo.versionNumber)
				return false;
			}
			if(typeof beepType.messageType != "string") // If the message type does not exist or is no string...
			{
				console.warn("Beep Communicator: Invalid Message for Beep Type " + beepType.type + " at version " + versionInfo.versionNumber)
				return false;
			}
			if(typeof beepType.messageColor != "string") // If the message color does not exist or is no string...
			{
				console.warn("Beep Communicator: Invalid Message Color for Beep Type " + beepType.type + " at version " + versionInfo.versionNumber + ". Default to Black!")
				beepType.messageColor = "Black";
			}
			//All type checks were successful. Pass received message upwards to listeners
			this.eventReceivedMessage.Raise(memberNumber, memberName, beepType.version, beepType.messageType, beepType.message, beepType.messageColor)
		}
		else if(beepType.type == versionInfo.beepTypes.versionRequest) // If it's a version request...
		{
			this.SendVersionResponse(memberNumber)
		}
		else if(beepType.type == versionInfo.beepTypes.versionResponse) // If it's a version response...
		{
			this.eventReceivedVersion.Raise(memberNumber, memberName, beepType.version)
		}
		else // If the beep type is unknown...
		{
			console.warn("Beep Communicator: Unknown Beep Type " + beepType.type + " at version " + versionInfo.versionNumber)
			return false;
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
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

	SendVersionResponse(memberNumber)
	{
		let beepType =
		{
			version: this.latestVersion.versionNumber,
			type: this.latestVersion.beepTypes.versionResponse
		}
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

	SendMessage(memberNumber, version, messageType, message, messageColor)
	{
		switch(version)
		{
			case 0: this.SendMessageVersion0(memberNumber, messageType, message, messageColor); break;
			default: break;
		}
	}

	SendMessageVersion0(memberNumber, messageType, message, messageColor)
	{
		let beepType =
		{
			version: this.latestVersion.versionNumber,
			type: this.latestVersion.beepTypes.message,
			messageType: messageType,
			message: message,
			messageColor: messageColor
		}
		this.gameBeeps.SendGenericBeep(memberNumber, beepType)
	}

}
