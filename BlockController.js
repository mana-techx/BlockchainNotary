const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js');
const mempool = require('./Mempool.js');
const ro = require('./RequestObject.js');
const svo = require('./SignatureValidationObject.js');
const Joi = require('joi');
const Boom = require('Boom');


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
        this.test();
        this.status();

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
                //return h.response().code(200);
                try {
                    let requestObject = new ro.RequestObject(request.payload.address);
                    return h.response(this.mempool.addARequestValidation(requestObject));
                } catch (e) {
                    throw Boom.badRequest(e, request.payload);
                }

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
                try {
                    let signValidationObj = new svo.SignatureValidationObject(request.payload.address, request.payload.signature);
                    return this.mempool.validateRequestByWallet(signValidationObj);
                } catch (e) {
                    throw Boom.badRequest(e, request.payload);
                }
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
                try {
                    let result = '';
                    result = await this.blocks.getBlock(request.params.index);
                    return result;
                } catch (e) {
                    throw Boom.notFound(e);
                }
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
                        return result;
                    } catch (err) {
                        throw Boom.notFound(err);
                    }

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
            try {
                let result = await this.blocks.getBlockByHash(request.params.HASH);
                return result;
            } catch (e) {
                throw Boom.badRequest(e);
            }
        }

    });
}

test() {
    this.server.route({
        path: '/test',
        method: 'GET',
        handler: (request, h) => {
            //return h.response().code(200);
            throw Boom.notFound('Cannot find the requested page')
        }
    });
}

status() {
    this.server.route({
        path: '/status',
        method: 'GET',
        handler: (request, h) => {
            return h.response(this.mempool.status());
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
            try {
                let starInformation = JSON.parse(request.payload);
                if (this.mempool.verifyAddressRequest(starInformation)) {
                    let blockAux = new BlockClass.Block(starInformation);
                    blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                    let x = await this.blocks.addBlock(blockAux);
                    this.mempool.removeCheckedStatus(starInformation); //Remove after successful addition
                    return JSON.parse(x);
                } else {
                    throw Boom.badRequest("Validate your signed message first", request.payload);
                }
            } catch (e) {
                throw Boom.badRequest(e, request.payload);
            }
        }
    });
}

}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => {
    return new BlockController(server);
}