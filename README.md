# qrsample
[4:31 PM] Risto Joseph (Guest)
    "hsclCertRequired": true,
        "verifiedHslCount": 0,
        "requiredHslCount": 2,
​[4:32 PM] Risto Joseph (Guest)
    flight level flags 
​[4:34 PM] Risto Joseph (Guest)

healthcertscope.itinData = [ { from: "Sydney", to: "Singapore", paxData: [ { flightId:"2301DF1D00027A77", firstName: "John", lastName: "Tan", paxType:"A", status: "F", fileName: "", decoded: null, certRequired: true, certPassed: false }, { flightId:"2301DF1D00027A77", firstName: "Rebecca", lastName: "Chin", paxType:"A", status: "F",  fileName: "", decoded: null, certRequired: true, certPassed: false } ] } ];



<span class="hc-ico" @click="deleteAddedFile()">
    
    deleteAddedFile: deleteAddedFile
    
    /* 
    ** function- delete added file
    */
    var deleteAddedFile = function() {
        
        var current_input = $("#fileinput"+this._props.segindex+""+this._props.index);
        this.status = "F";

        if (this.fileError != "") {
            this.fileError = "";	
        }
        if( current_input.val() != "" ) {
        	console.log("error");
            current_input.replaceWith(current_input.val('').clone(true));
        }
        
    }
