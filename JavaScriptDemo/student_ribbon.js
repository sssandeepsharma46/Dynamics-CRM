if (DotNetLittleBoy == undefined) {
    var DotNetLittleBoy = { __namespace: true };
}
if (DotNetLittleBoy.Student == undefined) {
    DotNetLittleBoy.Student = { __namespace: true };
}
if (DotNetLittleBoy.Student.Ribbon == undefined) {
    DotNetLittleBoy.Student.Ribbon = { __namespace: true };
}

DotNetLittleBoy.Student.Ribbon.Command = (function () {

    var createStudent = function () {
        var firstName = window.prompt("Enter the Student First Name");
        var parameters = {};
        parameters.First_Name = firstName;
        parameters.Last_Name = "Test";
        parameters.ContactNumber = "123456789";
        parameters.AddressLine1 = "Test";
        var courseappliedfor = {};
        courseappliedfor.dnlb_courseid = "d0fe39b2-72e7-ea11-a817-000d3a1a3603"; //Delete if creating new record 
        courseappliedfor["@odata.type"] = "Microsoft.Dynamics.CRM.dnlb_course";
        parameters.CourseAppliedFor = courseappliedfor;
        parameters.DateOfBirth = new Date("08/13/2020").toISOString();
        var country = {};
        country.dnlb_countryid = "737a9d78-75e7-ea11-a817-000d3a1a3603"; //Delete if creating new record 
        country["@odata.type"] = "Microsoft.Dynamics.CRM.dnlb_country";
        parameters.country = country;

        var req = new XMLHttpRequest();
        req.open("POST", Xrm.Page.context.getClientUrl() + "/api/data/v9.1/dnlb_CreateStudentFromApplication", false);
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.onreadystatechange = function () {
            if (this.readyState === 4) {
                req.onreadystatechange = null;
                if (this.status === 200) {
                    var results = JSON.parse(this.response);
                    Xrm.Utility.alertDialog("Student has been created");
                } else {
                    Xrm.Utility.alertDialog(this.statusText);
                }
            }
        };
        req.send(JSON.stringify(parameters));
    }

    return {
        CreateStudent: createStudent
    }
})();
//DotNetLittleBoy.Student.Ribbon.Command.CreateStudent
