if(typeof(dotNetLittleBoy)=='undefined'){
    dotNetLittleBoy={
        __namespace:true
    }
}
if(typeof(dotNetLittleBoy.crmDemo)=='undefined'){
    dotNetLittleBoy.crmDemo={}
}
dotNetLittleBoy.crmDemo.student=(function(){

    var onChangePostalCode=function(formExecutionContext){
        var formContext=formExecutionContext.getFormContext();
        var postalCode=formContext.getAttribute("dnlb_postalcode").getValue();
        if(postalCode==null){
            formContext.getAttribute("dnlb_addresline3").setValue(null);
            formContext.getAttribute("dnlb_cityid").setValue(null);
            formContext.getAttribute("dnlb_stateid").setValue(null);
            formContext.getAttribute("dnlb_countryid").setValue(null);
            return;
        }

        var postalCodeId=postalCode[0].id;
        postalCodeId=postalCodeId.replace("{","").replace("}","");

        //retrieve
        var postalCodeResult=dotNetLittleBoy.crmDemo.Utility.GetSingleRetrieve("dnlb_postalcode",postalCodeId,"dnlb_cityid,dnlb_countryid,dnlb_name,dnlb_region,dnlb_stateid");
        if(postalCodeResult !=null){
            //country field
            var countryArr=new Array();
            var countryObj=new Object();
            countryObj.id=postalCodeResult.dnlb_countryid.Id;
            countryObj.name=postalCodeResult.dnlb_countryid.Name;
            countryObj.entityType="dnlb_country";
            countryArr[0]=countryObj;

            //state field
            var stateArr=new Array();
            var stateObj=new Object();
            stateObj.id=postalCodeResult.dnlb_stateid.Id;
            stateObj.name=postalCodeResult.dnlb_stateid.Name;
            stateObj.entityType="dnlb_state";
            stateArr[0]=stateObj;

            //city field
            var cityArr=new Array();
            var cityObj=new Object();
            cityObj.id=postalCodeResult.dnlb_cityid.Id;
            cityObj.name=postalCodeResult.dnlb_cityid.Name;
            cityObj.entityType="dnlb_city";
            cityArr[0]=cityObj;

            //set the value
           
            formContext.getAttribute("dnlb_addressline3").setValue(postalCodeResult.dnlb_region);
            formContext.getAttribute("dnlb_countryid").setValue(countryArr);
            formContext.getAttribute("dnlb_stateid").setValue(stateArr);
            formContext.getAttribute("dnlb_cityid").setValue(cityArr);
        }
    }

    return{
        //return;
        OnChangePostalCode:onChangePostalCode
    }
})()