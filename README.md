# qrsample
[4:31 PM] Risto Joseph (Guest)
    "hsclCertRequired": true,
        "verifiedHslCount": 0,
        "requiredHslCount": 2,
​[4:32 PM] Risto Joseph (Guest)
    flight level flags 
​[4:34 PM] Risto Joseph (Guest)

healthcertscope.itinData = [ { from: "Sydney", to: "Singapore", paxData: [ { flightId:"2301DF1D00027A77", firstName: "John", lastName: "Tan", paxType:"A", status: "F", fileName: "", decoded: null, certRequired: true, certPassed: false }, { flightId:"2301DF1D00027A77", firstName: "Rebecca", lastName: "Chin", paxType:"A", status: "F",  fileName: "", decoded: null, certRequired: true, certPassed: false } ] } ];



       var onCertPaxMount = function() {

        var certpaxscope = this;
        certpaxscope.fileid = this._props.segindex + " " + this._props.index;
        certpaxscope.status = this._props.paxstatus;
        

        $("#fileinput" + this._props.segindex + "" + this._props.index).on("change", function() {

            certpaxscope.showUploadLoader = true;
                
            if ($(this)[0].files.length) {

                certpaxscope.fileError = "";

                if ($(this)[0].files[0].size > certpaxscope.filesizelimit) {
                    certpaxscope.fileError = "1";
                    certpaxscope.status = "F";
                } else if (!checkIfFileSupported($(this)[0].files[0])) {
                    certpaxscope.fileError = "2";
                    certpaxscope.status = "F";
                }

                if (certpaxscope.fileError == "") {

                    var formData = new FormData();
                    formData.append("file", $(this)[0].files[0]);
                    formData.append("flightID", certpaxscope._props.flightid);
                    var fileobj = $(this)[0].files[0];                    
    
                    $.ajax({
                        url: "/icheckIN/qrcodeHandler.form",
                        type: "POST",
                        data: formData,
                        method: "POST",
                        cache: false,
                        contentType: false,
                        processData: false,
                        success: function(response) {
                            
                            setTimeout(function(){
                                if (response.toLowerCase() == "success") {
                                    certpaxscope.filename = fileobj.name + " (" + readableBytesText(fileobj.size) + ")";
                                    certpaxscope.status = "T";
                                } else {
                                    certpaxscope.fileError = "3";
                                    certpaxscope.status = "T";
                                }
                                certpaxscope.showUploadLoader = false;
                              },50);

                            
                            //tobe written
                        },
                        error: function(jqxhr, textStatus, errThrown) {
                            //temp error
                              setTimeout(function(){
                                certpaxscope.fileError = "3";
                                certpaxscope.status = "F";
                                certpaxscope.showUploadLoader = false;
                              },50);
                            
                        }
                    });

                }
            } else {
                certpaxscope.showUploadLoader = false;
            }

        });
    };
