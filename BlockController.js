const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const mempool = require('./Mempool.js');
const ro = require('./RequestObject.js');
const svo = require('./SignatureValidationObject.js');
const Joi = require('joi');

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController
     * @param {*} server 
     */
    constructor(server) {
        this.server = server;
        this.blocks = new BlockChain.Blockchain();
        this.getBlockByIndex();
        this.postNewBlock();
        this.postRequestValidation();
        this.postMessageSignatureValidate();
        this.getStarsByAddress();
        this.getStarsByHash();
        
        this.mempool = new mempool.Mempool();
    }


    /**
     * Implement a POST endpoint to validate request with JSON response
     */
    postRequestValidation() {
        this.server.route({
            method: 'POST',
            path: '/requestValidation',
            options: {
                validate: {
                    payload: {
                        address: Joi.string().min(1).required() 
                    }
                }
            },
            handler: (request, h) => {
                let requestObject = new ro.RequestObject(request.payload.address);
                return this.mempool.addARequestValidation(requestObject);
            }
        });
    }

    /**
     * Implement a POST endpoint to validate message signature with JSON response
     */
    postMessageSignatureValidate() {
        this.server.route({
            method: 'POST',
            path: '/message-signature/validate',
            options: {
                validate: {
                    payload: {
                        address: Joi.string().min(1).required(), 
                        signature: Joi.string().min(1).required() 
                    }
                }
            },
            handler: (request, h) => {
                let signValidationObj = new svo.SignatureValidationObject(request.payload.address,request.payload.signature);
                return this.mempool.validateRequestByWallet(signValidationObj);
            }
        });
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.server.route({
            method: 'GET',
            path: '/block/{index}',
            
            options: {
                validate: {
                        params: {
                            index: Joi.number().integer().min(0).required()
                    }
                }
            },
            handler: async (request, h) => {
                let result = '';
                try {
                    result = await this.blocks.getBlock(request.params.index);
                }
                catch (err)
                {
                    result =err.toString();
                }
                return result;
            }
        })
    }

    //http://localhost:8000/stars/address:[ADDRESS]
    getStarsByAddress() {
        this.server.route({
            method: 'GET',
            path: '/stars/address:{ADDRESS}',
            options: {
                validate: {
                        params: {
                            ADDRESS: Joi.string().min(1).required()
                    }
                }
            },
            handler: async (request, h) => {
                let result = '';
                try {
                    result = await this.blocks.getBlockByWallet(request.params.ADDRESS);
                }
                catch (err)
                {
                    result =err.toString();
                }
                return result;                
            }

        });
    }

    //http://localhost:8000/stars/address:[HASH]
    getStarsByHash() {
        this.server.route({
            method: 'GET',
            path: '/stars/hash:{HASH}',
            options: {
                validate: {
                        params: {
                            HASH: Joi.string().min(1).required()
                    }
                }
            },
            handler: async (request, h) => {
                let result = '';
                try {
                    result = await this.blocks.getBlockByHash(request.params.HASH);
                }
                catch (err)
                {
                    result =err.toString();
                }
                return result;                
            }

        });
    }


    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
              /*options: {
                validate: {
                    payload: {
                        data: Joi.string().min(1).required() 
                    }
                }
            },*/
            handler: async (request, h) => {
                let starInformation = JSON.parse(request.payload);
                if (this.mempool.verifyAddressRequest(starInformation)) {
                    let a = 1;//FIXME
                }
                let blockAux = new BlockClass.Block(starInformation);
                
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                let x = await this.blocks.addBlock(blockAux); 
                return JSON.parse(x);
            }
        });
    }

}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}