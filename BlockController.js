const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const BlockChain = require('./BlockChain.js')
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
        //this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
        this.initializeMockData();
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
    

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.server.route({
            method: 'POST',
            path: '/block',
            options: {
                validate: {
                    payload: {
                        data: Joi.string().min(1).required() 
                    }
                }
            },
            handler: async (request, h) => {
                let blockAux = new BlockClass.Block(request.payload.data);
                
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                let x = await this.blocks.addBlock(blockAux); 
                return JSON.parse(x);
            }
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */

     /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     */
    initializeMockData() {
        this.server.route({
            method: 'POST',
            path: '/blockchain/init',
    
            handler: (request, h) => {
                //initializeMockData();
            }
        })
    }
}

/**
 * Exporting the BlockController class
 * @param {*} server 
 */
module.exports = (server) => { return new BlockController(server);}