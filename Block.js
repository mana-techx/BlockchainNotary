/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block {
	constructor(data){
		// Add your Block properties
		this.height = 0;
		this.timeStamp = '';
		this.data = data;
		this.previousHash = '0x';
		this.hash = '';
	}
}

module.exports.Block = Block;