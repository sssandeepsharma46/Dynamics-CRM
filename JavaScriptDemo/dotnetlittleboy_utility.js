if (typeof (dotNetLittleBoy) == 'undefined') {
    dotNetLittleBoy = {}
}
if (typeof (dotNetLittleBoy.crmDemo) == 'undefined') {
    dotNetLittleBoy.crmDemo = {}
}

dotNetLittleBoy.crmDemo.Utility = (function () {
    var getSingleRetrieve = function (entitySchema, recrodId,selectAttribute) {
        var result=null;
        var req = new XMLHttpRequest();
        req.open("GET", Xrm.Page.context.getClientUrl() + 
        "/XRMServices/2011/OrganizationData.svc/"+entitySchema+"Set(guid'"+recrodId+"')?$select="+selectAttribute,false);
        //"/XRMServices/2011/OrganizationData.svc/dnlb_postalcodeSet(guid'23a77e36-57a9-ea11-a812-000d3a569338')?$select=dnlb_cityid,dnlb_countryid,dnlb_name,dnlb_region,dnlb_stateid", false);
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                this.onreadystatechange = null;
                if (this.status === 200) {
                    result = JSON.parse(this.responseText).d;
                    // var dnlb_cityid = result.dnlb_cityid;
                    // var dnlb_countryid = result.dnlb_countryid;
                    // var dnlb_name = result.dnlb_name;
                    // var dnlb_region = result.dnlb_region;
                    // var dnlb_stateid = result.dnlb_stateid;
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send();
        return result;
    }

    return {
        //return function
        GetSingleRetrieve:getSingleRetrieve
    }
})()

