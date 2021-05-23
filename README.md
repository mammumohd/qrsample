# qrsample
[4:31 PM] Risto Joseph (Guest)
    "hsclCertRequired": true,
        "verifiedHslCount": 0,
        "requiredHslCount": 2,
​[4:32 PM] Risto Joseph (Guest)
    flight level flags 
​[4:34 PM] Risto Joseph (Guest)


//css

.scan-code-box.error{
    width: 90%;
    margin-top: 30px;
    background-color: #fff;
    text-align: right;
    padding: 0;
    box-sizing: border-box!important;
}

.scan-code-box.error .scantext {
    display: block;
    text-align: justify;
}

.scan-code-box.error .scan-btn{
    display: inline-block;
    margin: 20px 0px 0px 0px;
}


//js in accessCamera

$$this.activeCamPax.scanerror = true;

<div class="scan-code-title" v-if="!isCamEnableError()">Scan QR code</div>

div class="scan-code-box error" v-if="isCamEnableError()">
							<p class="scantext">No QR code detected. Try again. if the problem persists, you may proceed to the airport check-in counter for assistance</p>
							<button type="button" @click="closeScan()" class="scan-btn" >okay</button>
						</div>






    
    
