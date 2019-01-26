const svo = require('./SignatureValidationObject.js');
const bitcoinMessage = require('bitcoinjs-message');
const TimeoutRequestsWindowTime = 5 * 60 * 1000;
class Mempool {
    constructor() {
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = new Map();
    }

    status() {
        let resp = { _mempool: this.mempool, _timeoutRequests : this.timeoutRequests, _mempoolValid : JSON.stringify(this.mempoolValid)};

        return resp;
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
        if ( !(typeof reqObject === 'undefined')) {
            var timeleft = this.getTimeLeft(reqObject.requestTimeStamp);
            resp.status.message = reqObject.message;
            resp.status.validationWindow = timeleft;
            let isValid = bitcoinMessage.verify(reqObject.message, resp.status.address, resp.status.messageSignature);
            if (isValid) {
               
                resp.registerStar = true;
                resp.status.requestTimeStamp = reqObject.requestTimeStamp;
                
                //If you have implemented a timeoutArray, make sure you clean it up before returning the object.
                //Save the object into the mempoolValid array
                this.mempoolValid.set(resp.status.address, resp);
                this.removeValidationRequest(reqObject);
            }
        }
        return resp;
    }


    verifyAddressRequest(starInformation) {
        return typeof this.mempoolValid.get(starInformation.address) === 'undefined' ? false : true;
    }

    removeCheckedStatus(starInformation) {
        return typeof this.mempoolValid.delete(starInformation.address);
    }


}
module.exports.Mempool = Mempool;