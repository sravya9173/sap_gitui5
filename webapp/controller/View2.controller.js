sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "filtersort/model/formatter"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,formatter) {
        "use strict";

        
        return Controller.extend("filtersort.controller.View2", {
            f:formatter,
            onInit: function () {
              this.singleEmpModel = new JSONModel();
              this.getView().setModel(this.singleEmpModel, "singleEmpModel");

              this.getOwnerComponent().getRouter().getRoute("RouteView2").attachPatternMatched(this.onPatternMatched,this);

            },

            onPatternMatched: function(oEvent){
                var empId = oEvent.getParameter("arguments").key;

                // this.getView().bindElement("/employeeSet('"+empId+"')");
                

                var oModel = this.getOwnerComponent().getModel();
                oModel.read("/employeeSet('" + empId + "')", {
                    urlParameters: {
                        $expand: 'toproject,toresume'
                    },
                    success: function (data) {
                        
                        this.singleEmpModel.setData(data);
                    }.bind(this)
                });


            },
           
            onNavBack: function () {
                history.go(-1);
            },
            onPressPhoto: function () {
                var empId = this.byId("idEmpid").getText();
                var url = "/sap/opu/odata/sap/ZEMPLOYEEDETAILS_SRV/photoSet('" + empId + "')/$value";
                sap.m.URLHelper.redirect(url, false);
            },
            onDowndloadResume: function (oEvent) {
                var empId = oEvent.getSource().getParent().getBindingContext("singleEmpModel").getProperty("Employid");
                var fileName = oEvent.getSource().getParent().getBindingContext("singleEmpModel").getProperty("Filename");
                var url = "/sap/opu/odata/sap/ZEMPLOYEEDETAILS_SRV/resumeSet(Employid='" + empId + "',Filename='" + fileName + "')/$value";
                sap.m.URLHelper.redirect(url, false);
            },


        });
    });