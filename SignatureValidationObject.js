/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Status {
	constructor(address,  message, validationWindow, messageSignature){
	this.address = address,
	this.requestTimeStamp = new Date().getTime().toString().slice(0,-3),
	this.message = message,
	this.validationWindow = validationWindow,
	this.messageSignature = messageSignature
	}
}


class SignatureValidationObject {
	constructor(address,signature){
		this.registerStar = '';
		this.status = new Status(address,1,1,signature)
	}
}

module.exports.SignatureValidationObject = SignatureValidationObject;