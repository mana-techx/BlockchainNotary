/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/
/*
{
    "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
    "star": {
                "dec": "68° 52' 56.9",
                "ra": "16h 29m 1.0s",
                "story": "Found star using https://www.google.com/sky/"
            }
}
*/
class Star {
	constructor(dec = "default", ra= "default", story= "default") {
		this.dec = dec,
			this.ra = ra,
			this.story = story
	}
}


class StarInformationObject {
	constructor(address) {
		this.address = '';
		this.star = new star();
	}
}

module.exports.StarInformationObject = StarInformationObject;