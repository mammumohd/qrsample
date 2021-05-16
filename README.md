# qrsample
[4:31 PM] Risto Joseph (Guest)
    "hsclCertRequired": true,
        "verifiedHslCount": 0,
        "requiredHslCount": 2,
​[4:32 PM] Risto Joseph (Guest)
    flight level flags 
​[4:34 PM] Risto Joseph (Guest)


 1. Change for taking auto fightids 
 2.  as
  /* 
	** function- to enable and  disable submit verification button
	*/
    var changeVerifyBtn = function(count) {
        this.docCount += count;
        if(this.docCount > 0){
            this.disablesubmit = false;
        }else{
            this.disablesubmit = true;
        }
    }

3 
var getHealthCertData = function() {
        return {
            itinData: [],
            docCount:0,
            disablesubmit: true
        }
    };
    


4 


changeVerifyBtn: changeVerifyBtn


5, 

paxlength: Number,
                paxstatus: String,
                changeBtn: Function
                
                
                
6, 

certpaxscope.filename = fileobj.name + " (" + readableBytesText(fileobj.size) + ")";
                                    certpaxscope.status = "T";
                                    certpaxscope._props.changeBtn(1);
7,
var deleteAddedFile = function() {
        var current_input = $("#fileinput" + this._props.segindex + "" + this._props.index);
        this.status = "F";
        if (this.fileError != "") {
            this.fileError = "";
        }
        if (current_input.val() != "") {
            current_input.replaceWith(current_input.val('').clone(true));
        }
        this._props.changeBtn(-1);
        
        
8

<cert-pax
				v-for="(pax,pindex) in itin.paxData"
				:key="'paxi'+pindex"
				:index= "pindex"
				:segindex="itindex"
				:flightid = "pax.flightId"
				:firstname = "pax.firstName"
				:lastname = "pax.lastName"
				:paxType = "pax.paxType"
				:paxlength = "itin.paxData.length"
				:paxstatus = "pax.status"
				:changeBtn = "changeVerifyBtn"
			>
			</cert-pax>
                                    
                                    
    
    
    
    
