sap.ui.define([
    "sap/ui/core/format/DateFormat",
], function (DateFormat) {
    "use strict";

    return {

        formatStatus: function (Status) {
            if (Status === "PERMANENT") {
                return "Success";
            } else {
                return "Error";
            }
        },

        formatDateDuringFilter: function(Doj) {
			var oDateFormatter = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-dd"
			}, sap.ui.getCore().getConfiguration().getLocale());

			return oDateFormatter.format(Doj);
		},
        formatDateForCreateNUpdate: function(Doj) {
			var oDateFormatter = DateFormat.getDateTimeInstance({
				pattern: "yyyy-MM-ddTHH:mm:ss"
			}, sap.ui.getCore().getConfiguration().getLocale());

			return oDateFormatter.format(Doj);
		},

        formatSkill: function (Skill) {
            if (Skill === "SAPUI5") {
                return "Success";
            } else if (Skill === "ABAP") {
                return "Warning";
            }
            else if (Skill === "UI5") {
                return "Error";
            }
        },

        formatDesig: function (Jobdesgn) {
            if (Jobdesgn === "ABAP") {
                return Jobdesgn + "(AB)";
            } else if (Jobdesgn === "SAPUI5") {
                return Jobdesgn + "(UI)";
            }
            else if (Jobdesgn === "UI5") {
                return Jobdesgn + "(UI)";
            }
           
        }

    };
});