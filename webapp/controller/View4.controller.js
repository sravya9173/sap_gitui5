sap.ui.define([
    "sap/ui/core/mvc/Controller",
      "sap/ui/model/json/JSONModel",
  "filtersort/model/formatter",
    "sap/m/MessageBox"
  

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter,MessageBox) {
        "use strict";

        return Controller.extend("filtersort.controller.View4", {
          
          onInit: function () {
            this.editEmpModel = new JSONModel();
            this.getView().setModel(this.editEmpModel, "editEmpModel");
    
            this.getOwnerComponent().getRouter().getRoute("RouteView4").attachPatternMatched(this.onPatternMatched, this);
          },
          onPatternMatched: function (oEvent) {
            var empId = oEvent.getParameter("arguments").key;
            //this.getView().bindElement("/EmployeeSet('" + empId + "')");
    
            var oModel = this.getOwnerComponent().getModel();
            oModel.read("/employeeSet('" + empId + "')", {
              success: function (data) {
                this.editEmpModel.setData(data);
              }.bind(this)
            });
          },
    
            onNavBack: function () {
                history.go(-1);
            },
            onPressSave: function () {
                var empId = this.getView().byId("idEmployeeId").getValue();
                var name = this.getView().byId("idEmployeename").getValue();
                var desig = this.getView().byId("idemployeeDesign").getValue();
                var skill = this.getView().byId("idemployeeSkill").getValue();
                var email = this.getView().byId("idemployeeEmail").getValue();
                var phone = this.getView().byId("idemployeePhone").getValue();
                var salary = this.getView().byId("idemployeeSalary").getValue();        
                var status = this.getView().byId("idemployeeStatus").getValue();
                var rating = this.getView().byId("idemployeeRating").getValue();
                var doj = this.getView().byId("idemployeeDoj").getDateValue();
                doj = formatter.formatDateForCreateNUpdate(doj);
        
                var data = {
                  Employid: empId,
                  Employname: name,
                  Jobdesgn: desig,
                  Skill: skill,
                  Emailid: email,
                  Phone: phone,
                  Salary: salary,
                  Status: status,
                  Rating:parseInt(rating),
                  Doj: doj
                };
        
                var oModel = this.getOwnerComponent().getModel();
                oModel.update("/employeeSet('" + empId + "')",data,{

                  success:function(){
                    this.getOwnerComponent().readEmployees([],[]);
                    MessageBox.success("Employee got Updated successfully");
                  }.bind(this),
                  error:function(oError){
                    MessageBox.error("OOps..! Some error occured please contact the support team");
                  }
                });
        

         
           
          
            }
        });
      }
    );
    