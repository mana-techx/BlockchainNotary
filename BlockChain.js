/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

const defaultHash = '0x';
class Blockchain {

    constructor() {
        this.db = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Auxiliar method to create a Genesis Block (always with height= 0)
    // You have two options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        // Add your code here

        let gb = new Block.Block("First block in the chain - Genesis block");

        this.db.getBlocksCount()
            .then(result => {
                if (result > 0) {
                    return;
                } else {
                    this.addBlock(gb);
                }
            }
            )

    }

    // Get block height, it is auxiliar method that return the height of the blockchain
    getBlockHeight() {
        // Add your code here
        let self = this;
        return new Promise(function (resolve, reject) {
            self.db.getBlocksCount()
                .then(result => resolve(result))
                .catch(err => reject(err));
        })
    }

    // Add new block
    addBlock(block) {
        // Add your code here
        let self = this;
        block.time = new Date().getTime().toString().slice(0, -3);
        return new Promise(function (resolve, reject) {
            //First Setup block height 
            self.getBlockHeight()
                .then(result => {
                    block.height = result;
                    if (result > 0)
                        return self.getBlock(result - 1);
                    else {
                        return new Promise(function (resolve) {
                            resolve(block);
                        }
                        )
                    }
                })
                //Get previous block's hash and set it up for this block's prevhash
                .then(async result => {
                    block.previousBlockHash = block === result ? '0x' : result.hash;  // 0x for genesis block or prev hash
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    try {
                        const x = await self.db.addLevelDBData(block.height, JSON.stringify(block).toString());
                        return resolve(x);
                    }
                    catch (err) {
                        return reject(err);
                    }
                })
        })
    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function (resolve, reject) {
            
            self.db.getLevelDBData(height)
                .then(result => typeof result !== 'undefined' ? resolve(JSON.parse(result)) : reject(new Error(`no block for that height specified ${height} `)))
                .catch(
                    err => reject(err)
                )
        })
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
        let self = this;
        return new Promise(function (resolve) {
            self.getBlock(height)
                .then(result => {
                    let thisBlock = result;
                    let hash = thisBlock.hash;
                    thisBlock.hash = '';
                    resolve(hash === SHA256(JSON.stringify(thisBlock)).toString() ? true : false);
                })
            .catch(err => console.log( `Error validating block ${err}`));
        })
    }

    // Validate Blockchain
    async validateChain() {
        // Add your code here
        var validationNotes = [];
        let self = this;
        //Get Chain Height
        try {
            var bestHeight = await self.getBlockHeight();
        }
        catch (err) {
            validationNotes.push(`Unsuccessful getting Best Block height ${err}`);
            Promise.reject(validationNotes);
        }

        let prevhash = defaultHash;
        for (let i = 0; i < bestHeight; i++) {
            let currBlkObj = await self.getBlock(i);
            //console.log(`validating Block #${JSON.stringify(currBlkObj).toString()}`);
            let valid = await self.validateBlock(currBlkObj.height);
            if (!valid ) {
                validationNotes.push(`Bad Block: Hash won't match in Block#${i} - hash is broken - ${JSON.stringify(currBlkObj).toString()}`);
            } else {
                if (currBlkObj.previousBlockHash != prevhash) {
                    validationNotes.push(`Bad Block: Previous Hash Mismatch in Block#${i} ${currBlkObj.previousBlockHash} <> ${prevhash}`);
                }
                prevhash = currBlkObj.hash;
            }
        }
        return new Promise((resolve, reject) => resolve(validationNotes));

        //Iterate and check Block Hash and Previous Hashes match, if not add Errors

    }
}

module.exports.Blockchain = Blockchain;