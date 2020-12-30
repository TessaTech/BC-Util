"use strict";

if(BeepMessages == undefined)
{
	var BeepMessages = {}
}

BeepMessages.BeepConversation = class
{
	constructor(initMemberNumber)
	{
		this.memberNumber = initMemberNumber
		this.version = -2
		this.messageHistory = [ ]

	}

}

BeepMessages.BeepConversation.Message = class
{
	constructor(initSender, initMessage, initReceiveTime)
	{
		this.sender = initSender
		this.message = initMessage
		this.receiveTime = initReceiveTime
	}
}
