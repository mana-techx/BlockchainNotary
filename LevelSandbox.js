/* ===== Persist data with LevelDB ==================
|  Learn more: level: https://github.com/Level/level |
/===================================================*/

const level = require('level'); 
const chainDB = './chaindata';

class LevelSandbox {

    constructor() {
        this.db = level(chainDB);
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember un Promises you need to resolve() or reject()
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
            });
        });
    }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
        let self = this;
        return new Promise(function(resolve, reject) {
            // Add your code here, remember un Promises you need to resolve() or reject() 
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    // Method that return the height
    getBlocksCount() {
        let self = this;

        return new Promise(function(resolve, reject){
            // Add your code here, remember un Promises you need to resolve() or reject()
            let i = 0;
            self.db.createReadStream()
            .on('data', function(data) {
                  i++;
             })
            .on('error', function(err) {
                  reject(err);
             })
            .on('close', function() {
                    resolve(i);
             });
        });
    }
        

}

module.exports.LevelSandbox = LevelSandbox;