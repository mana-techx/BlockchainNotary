/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class RequestObject {
	constructor(walletAddress){
		this.walletAddress = walletAddress;
		this.requestTimeStamp = new Date().getTime().toString().slice(0,-3);
		
		this.message = this.walletAddress + ":" + this.requestTimeStamp + ":starRegistry" ;
		//this.message = this.walletAddress + ":starRegistry" ;
		this.validationWindow = 0;
	}
}

module.exports.RequestObject = RequestObject;