/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "filtersort/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("filtersort.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.readEmployees([],[]);
            },
            readEmployees:function(aFilters,aSorters){
                var empJson = this.getModel("empJson"); 
                var oModel = this.getModel(); //give odata Model Object 

    
             oModel.read("/employeeSet", {
                filters: aFilters,
                sorters:aSorters,
                success: function (data) {
    
                    for(var i=0;i<data.results.length;i++){
                        data.results[i].SNo = i+1;
                        if(data.results[i].Jobdesgn ==="ABAP"){
                            data.results[i].Jobdesgn = data.results[i].Jobdesgn + "(AB)";
                        }else if(data.results[i].Jobdesgn ==="SAPUI5"){
                            data.results[i].Jobdesgn = data.results[i].Jobdesgn + "(UI)";
                        }
                      } 
                       empJson.setData(data);
                  }
               });
         }
        });
    }
);