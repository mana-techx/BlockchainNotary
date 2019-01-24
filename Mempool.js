const bitcoinMessage = require('bitcoinjs-message');
const TimeoutRequestsWindowTime = 1 * 60 * 1000;
class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
    }

    setTimeOut(request) {
        self.timeoutRequests[request.walletAddress] = setTimeout(function () {
            self.removeValidationRequest(request.walletAddress)
        }, TimeoutRequestsWindowTime);
    }

    addARequestValidation(request) {
        let response = this.mempool.find( element => element.walletAddress === request.walletAddress);
        if (typeof response === 'undefined' ) {
            this.mempool.push(request);
            request.validationWindow = 300;//5 minutes
            
            this.timeoutRequests[request] = setTimeout(() => self.removeValidationRequest(request), TimeoutRequestsWindowTime );
            let self = this;
            return request;
        } else {
            response.validationWindow = this.getTimeLeft(response);
            return response;
        }
    }

    
    getTimeLeft(reqValidation){
        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - reqValidation.requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
        return timeLeft;
    }
    
    removeValidationRequest(requestObject){
        this.mempool = this.mempool.filter(el => el.walletAddress != requestObject.walletAddress);
        this.timeoutRequests = this.timeoutRequests.filter(el => el.walletAddress != requestObject.walletAddress);
     }



    validateRequestByWallet(request) {
        // Find your request in the mempool array by wallet address.
        //Verify your windowTime.
        //Verify the signature

        let isValid = bitcoinMessage.verify(message, address, signature);
        //Create the new object and save it into the mempoolValid array
        this.registerStar = true;
        this.status = {
            address: walletAddress,
            requestTimeStamp: requestTimeStamp,
            message: message,
            validationWindow: validationWindow,
            messageSignature: valid
        };
        //If you have implemented a timeoutArray, make sure you clean it up before returning the object.
    }

    verifyAddressRequest(request) {

    }


}
module.exports.Mempool = Mempool;