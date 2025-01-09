sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "filtersort/model/formatter",
    "sap/ui/model/Filter",
    "sap/ui/model/Sorter",
      "sap/m/MessageBox"
],
function (Controller,formatter,Filter,Sorter,MessageBox) {
    "use strict";

    return Controller.extend("filtersort.controller.View1", {
        f: formatter,
        onInit: function () {

            this.mGroupFunctions = {
                Jobdesgn: function(oContext){
                    var desig =oContext.getProperty("Jobdesgn");
                    return{
                        key: desig,
                        text:desig
                    };
                },
                Skill: function (oContext) {
                    var skill = oContext.getProperty("Skill");
                    return {
                        key: skill,
                        text: skill
                    };
                }
            };
        },
        onPressGo: function () {
            var empId = this.byId("idEmpId").getValue();
            var name = this.byId("idName").getValue();
            var desig = this.byId("idDesig").getValue();
            var skill = this.byId("idSkill").getValue();
            var salary = this.byId("idSalary").getValue();
            var salaryOpr = this.byId("idSalaryOpr").getSelectedKey();
            var doj = this.byId("idDoj").getDateValue();// returns the data in an object format
            doj = formatter.formatDateDuringFilter(doj);

            var aFilters = [];

            if (empId !== "") {
                aFilters.push(new Filter("Employid", "EQ", empId));
            }
            if (name !== "") {
                aFilters.push(new Filter("Employname", "EQ", name));
            }
            if (desig !== "") {
                aFilters.push(new Filter("Jobdesgn", "EQ", desig));
            }
            if (skill !== "") {
                aFilters.push(new Filter("Skill", "EQ", skill));
            }
            if (salary !== "") {
                aFilters.push(new Filter("Salary", salaryOpr, salary));
            }
            if (doj !== "") {
                aFilters.push(new Filter("Doj", "EQ", doj));
            }

            var aSorters = [];
            var sortField = this.byId("idSortField").getSelectedKey();
            var softIndex =  this.byId("idSortOrder").getSelectedIndex();
            var sortOrder;
            if(softIndex === 0){
               sortOrder  = false;
            }else{
               sortOrder  = true;
            }
            if(sortField !=="" && softIndex!==-1){
               aSorters.push(new Sorter(sortField,sortOrder));//API take 2nd Org. true for descsing , false for ascending
            }


              this.getOwnerComponent().readEmployees(aFilters,aSorters);

              var aGroups = [];
              var groupField = this.byId("idGroupField").getSelectedKey();
              var groupIndex = this.byId("idGroupOrder").getSelectedIndex();
              var groupOrder;
              if(groupIndex === 0){
                groupOrder = false;
              }else{
                groupOrder = true;
              }
              if(groupField !=="" && groupIndex !== -1){
                aGroups.push(new Sorter(groupField,groupOrder,this.mGroupFunctions[groupField]));
              }
              this.byId("idTable").getBinding("items").sort(aGroups);
        },
        onPressReset:function(){
            this.byId("idEmpId").setValue("");
            this.byId("idName").setValue("");
            this.byId("idDesig").setValue("");
            this.byId("idSkill").setValue("");
            this.byId("idSalary").setValue("");
             this.byId("idSalaryOpr").setSelectedKey("EQ");
            this.byId("idDoj").setDateValue(null);
            this.byId("idSortField").setSelectedKey("");
            this.byId("idSortOrder").setSelectedIndex(-1);

            this.getOwnerComponent().readEmployees([],[]);//this is for json table
            //this.byId("idODataTable").getBinding("items").filter([]);


            // this.getOwnerComponent().readEmployees([]);//this is for json table
           
        },
        onPressRow:function(oEvent){
            var empId  = oEvent.getSource().getBindingContext("empJson").getProperty("Employid");
            this.getOwnerComponent().getRouter().navTo("RouteView2", {
                key : empId
            });
        },
        onPressCreate:function(){
            this.getOwnerComponent().getRouter().navTo("RouteView3");
        },
        onPressEdit: function () {
            var empId = this.byId("idTable").getSelectedItem().getBindingContext("empJson").getProperty("Employid");
            this.getOwnerComponent().getRouter().navTo("RouteView4",{
                key: empId
            });
        },
        onPressDelete:function(){
            var empId = this.byId("idTable").getSelectedItem().getBindingContext("empJson").getProperty("Employid");
           var oModel = this.getOwnerComponent().getModel();

           oModel.remove("/employeeSet('" + empId + "')",  {
            success: function () {
              this.getOwnerComponent().readEmployees([],[]);
              MessageBox.success("Employee deleted successfully");
            }.bind(this),
            error: function (oError) {
              MessageBox.error("OOps..! Some error occured please contact the support team");
            }
          });
        },
    });
});
