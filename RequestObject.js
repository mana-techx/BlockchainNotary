/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class RequestObject {
	constructor(message){
		// Add your Block properties
		this.walletAddress = 0;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		this.message = message;
		this.validationWindow = 0;
	}
}

module.exports.RequestObject = RequestObject;