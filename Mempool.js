const bitcoinMessage = require('bitcoinjs-message');
const TimeoutRequestsWindowTime = 5 * 60 * 1000;
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