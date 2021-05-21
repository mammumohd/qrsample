# qrsample
[4:31 PM] Risto Joseph (Guest)
    "hsclCertRequired": true,
        "verifiedHslCount": 0,
        "requiredHslCount": 2,
​[4:32 PM] Risto Joseph (Guest)
    flight level flags 
​[4:34 PM] Risto Joseph (Guest)


var fData = new FormData();
        fData.append("flightID", this._props.flightid);
        
        $.ajax({
            url: "/icheckIN/qrcodeDelete.form",
            type: "POST",
            data: fData,
    
 /* 
    ** function- called after successfull scanning
    */
    function onScanSuccess(qrCodeMessage) {

        setTimeout(function(){

            if($$this.activeCamPax.scandata ==""){

                $$this.activeCamPax.scandata = qrCodeMessage;
                $$this.activeCamPax.showUploadLoader = true;
                $$this.activeCamPax.fileError = "";
    
                var formData = new FormData();
                formData.append("qrCode", qrCodeMessage);
                formData.append("flightID", $$this.activeCamPax._props.flightid);
    
                $.ajax({
                    url: "/icheckIN/qrcodeScan.form",
                    type: "POST",
                    data: formData,
                    method: "POST",
                    cache: false,
                    contentType: false,
                    processData: false,
                    success: function(response) {
    
                        if (response.toLowerCase() == "success" || response.toLowerCase() == "s") {
                            $$this.activeCamPax.status = "T";
                            $$this.activeCamPax._props.changeBtn(1);
                        } else {
                            $$this.activeCamPax.fileError = "3";
                            $$this.activeCamPax.status = "F";
                        }
                        $$this.activeCamPax.showUploadLoader = false;
                        closeScan();
    
                    },
                    error: function(jqxhr, textStatus, errThrown) {
    
                            $$this.activeCamPax.fileError = "3";
                            $$this.activeCamPax.status = "F";
                            $$this.activeCamPax.showUploadLoader = false;
                            closeScan();
    
                    }
                });
    
            }

        },100);
    }    
    
    
