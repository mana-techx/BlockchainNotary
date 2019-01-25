const svo = require('./SignatureValidationObject.js');
const bitcoinMessage = require('bitcoinjs-message');
const TimeoutRequestsWindowTime = 5 * 60 * 1000;
class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
    }

    setTimeOut(request) {
        self.timeoutRequests[request.walletAddress] = setTimeout(function () {
            self.removeValidationRequest(request.walletAddress)
        }, TimeoutRequestsWindowTime);
    }

    addARequestValidation(request) {
        let response = this.mempool.find(element => element.walletAddress === request.walletAddress);
        if (typeof response === 'undefined') {
            this.mempool.push(request);
            request.validationWindow = 300; //5 minutes

            this.timeoutRequests[request] = setTimeout(() => self.removeValidationRequest(request), TimeoutRequestsWindowTime);
            let self = this;
            return request;
        } else {
            response.validationWindow = this.getTimeLeft(response.requestTimeStamp);
            return response;
        }
    }


    getTimeLeft(requestTimeStamp) {
        let timeElapse = (new Date().getTime().toString().slice(0, -3)) - requestTimeStamp;
        let timeLeft = (TimeoutRequestsWindowTime / 1000) - timeElapse;
        return timeLeft;
    }

    removeValidationRequest(requestObject) {
        this.mempool = this.mempool.filter(el => el.walletAddress != requestObject.walletAddress);
        this.timeoutRequests = this.timeoutRequests.filter(el => el.walletAddress != requestObject.walletAddress);
    }



    validateRequestByWallet(resp) {
        // Find your request in the mempool array by wallet address.
        //Verify your windowTime.
       

        let reqObject = this.mempool.find(element => element.walletAddress === resp.status.address);
        resp.registerStar = false;
        if (typeof reqObject === 'undefined') {
            return resp;
         } else {
            var timeleft = this.getTimeLeft(reqObject.requestTimeStamp);
            resp.status.message = reqObject.message;
            resp.status.validationWindow = timeleft;
            let isValid = bitcoinMessage.verify(reqObject.message, resp.status.address, resp.status.messageSignature);
            if (isValid) {
                //Create the new object and save it into the mempoolValid array
                resp.registerStar = true;
                resp.status.requestTimeStamp = reqObject.requestTimeStamp;
                
                //If you have implemented a timeoutArray, make sure you clean it up before returning the object.
                this.mempoolValid[resp.status.address] = resp;
                this.removeValidationRequest(reqObject);
            }
        }
        return resp;
    }


    verifyAddressRequest(request) {

    }


}
module.exports.Mempool = Mempool;