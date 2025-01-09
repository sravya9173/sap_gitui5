sap.ui.define([
    "sap/ui/core/mvc/Controller",
  "filtersort/model/formatter",
    "sap/m/MessageBox",
        "sap/ui/model/json/JSONModel",
        "sap/ui/unified/FileUploaderParameter",
  

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,formatter,MessageBox,JSONModel,FileUploaderParameter) {
        "use strict";

        return Controller.extend("filtersort.controller.View3", {
          
            onInit: function () {
              this.prjModel = new JSONModel();
        this.prjModel.setData({
          aProjects:
          [
                
                
          ]
        });
        this.getView().setModel(this.prjModel,"prjModel");
      },
      onAddRow:function(){
        this.prjModel.getData().aProjects.push({
          Employid: "",
          Prjcode:"",
          Clientname:"",
          Prjname:"",
          Prjdesc:""
       });
       this.prjModel.refresh(true);
      },
      onDeleteRow:function(oEvent){
        var index = oEvent.getSource().getParent().getBindingContextPath().split("/")[2];
        this.prjModel.getData().aProjects.splice(index,1);
        this.prjModel.refresh(true);
      },


            onNavBack: function () {
                history.go(-1);
            },
            onPressReset:function(){
              this.byId("idEmployId").setValue("");
              this.byId("idEmployname").setValue("");
              this.byId("idDesign").setValue("");
              this.byId("idempSkill").setValue("");
              this.byId("idEmail").setValue("");
              this.byId("idPhone").setValue("");
              this.byId("idempSalary").setValue("");
              this.byId("idStatus").setValue("");
              this.byId("idRating").setValue("");
              this.byId("idempDoj").setValue("");
  
              this.getOwnerComponent().readEmployees([],[]);//this is for json table
              //this.byId("idODataTable").getBinding("items").filter([]);
  
  
              // this.getOwnerComponent().readEmployees([]);//this is for json table
             
          },
          onFileSelect: function (oEvent) {
            this.fileName = oEvent.getParameter("files")[0].name;
            this.fileType = oEvent.getParameter("files")[0].type;
          },
      onUploadComplete: function (oEvent) {
        // var status = oEvent.getParameter("status");
        // if (status === 201) {
        //   MessageBox.success("Your profile picture uploadded successfully");
        // } else {
        //   MessageBox.error("File upload failed , Please check internet connectivty and try again");
        // }
      },
      onResumeUploadComplete: function (oEvent){
        // var status = oEvent.getParameter("status");
        // if (status === 501) {
        //   MessageBox.success("Your resume uploadded successfully");
        // } else {
        //   MessageBox.success("File upload failed , Please check internet connectivty and try again");
        // }
      },

      onUploadPhoto: function () {
        var oFileUploader = this.byId("idFileUploader");
        oFileUploader.destroyHeaderParameters();
        var empId = this.getView().byId("idEmployId").getValue();
        var slug = empId + "," + this.fileName;

        //1. add slug parameter
        oFileUploader.addHeaderParameter(new FileUploaderParameter({
          name: "slug",
          value: slug
        }));
        //2. add the File type parameter 
        oFileUploader.addHeaderParameter(new FileUploaderParameter({
          name: "Content-Type",
          value: this.fileType
        }));
        //3. add X-CSRF token
        this.getOwnerComponent().getModel().refreshSecurityToken();
        oFileUploader.addHeaderParameter(new FileUploaderParameter({
          name: "x-csrf-token",
          value: this.getOwnerComponent().getModel().getHeaders()['x-csrf-token']
        }));

        oFileUploader.upload();// to send the file content

      },
      onUploadResume:function(){
        var oUploadSet = this.byId("idUploadSet");
        var empId = this.getView().byId("idEmployId").getValue();

        var aInCompleteItems = oUploadSet.getIncompleteItems();

        for (var i = 0; i < aInCompleteItems.length; i++) {
          
          var fileName = aInCompleteItems[i].getFileName();
  
          //step1 construct slug 
          var slug = empId + "," + fileName;
          var oSlug = new sap.ui.core.Item({
            key: "SLUG",
            text: slug
          });
          oUploadSet.addHeaderField(oSlug);

          //step2 construct X csrf token
          this.getOwnerComponent().getModel().refreshSecurityToken();
          var oXCSRFToken = new sap.ui.core.Item({
            key: "X-CSRF-Token",
            text: this.getOwnerComponent().getModel().getSecurityToken()
          });
          oUploadSet.addHeaderField(oXCSRFToken);

          oUploadSet.uploadItem(aInCompleteItems[i]);
          
          oUploadSet.removeAllHeaderFields();

          //oUploadSet.addHeaderField(oSlug).addHeaderField(oXCSRFToken).uploadItem(aInCompletedItems[i]);
  
        }

      },

            onPressSave: function () {
                var empId = this.getView().byId("idEmployId").getValue();
                var name = this.getView().byId("idEmployname").getValue();
                var desig = this.getView().byId("idDesign").getValue();
                var skill = this.getView().byId("idempSkill").getValue();
                var email = this.getView().byId("idEmail").getValue();
                var phone = this.getView().byId("idPhone").getValue();
                var salary = this.getView().byId("idempSalary").getValue();        
                var status = this.getView().byId("idStatus").getValue();
                var rating = this.getView().byId("idRating").getValue();
                var doj = this.getView().byId("idempDoj").getDateValue();
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
                  Doj: doj,
                  toproject:    this.prjModel.getData().aProjects
                };
        
                var oModel = this.getOwnerComponent().getModel();
                oModel.create("/employeeSet",data,{
                  success:function(req,res){
                    this.getOwnerComponent().readEmployees([],[]);
                    MessageBox.success("Employee got created successfully");
                  }.bind(this),
                  error:function(oError){
                    MessageBox.error("OOps..! Some error occured please contact the support team");
                  }
                });
        
            },
            // onUploadResume:function(){
            //   var oUploadSet = this.byId("idUploadSet");
            //   var empId = this.getView().byId("idEmployId").getValue();
      
            //   var aInCompleteItems = oUploadSet.getIncompleteItems();
      
            //   for (var i = 0; i < aInCompleteItems.length; i++) {
          
            //     var fileName = aInCompleteItems[i].getFileName();
        
            //     //step1 construct slug 
            //     var slug = empId + "," + fileName;
            //     var oSlug = new sap.ui.core.Item({
            //       key: "SLUG",
            //       text: slug
            //     });
            //     oUploadSet.addHeaderField(oSlug);
      
            //     //step2 construct X csrf token
            //     this.getOwnerComponent().getModel().refreshSecurityToken();
            //     var oXCSRFToken = new sap.ui.core.Item({
            //       key: "X-CSRF-Token",
            //       text: this.getOwnerComponent().getModel().getSecurityToken()
            //     });
            //     oUploadSet.addHeaderField(oXCSRFToken);
      
            //     oUploadSet.uploadItem(aInCompleteItems[i]);
                
            //     oUploadSet.removeAllHeaderFields();
      
            //     //oUploadSet.addHeaderField(oSlug).addHeaderField(oXCSRFToken).uploadItem(aInCompletedItems[i]);
        
            //   }
      
            // }      
        });
      }
    );
    