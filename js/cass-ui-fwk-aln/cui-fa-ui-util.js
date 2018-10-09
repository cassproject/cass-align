//**************************************************************************************************
// CASS UI Framework Alignment UI Utility Functions
//**************************************************************************************************

//**************************************************************************************************
// Constants

const DEBUG_CONSOLE = true;
const DEBUG_ALERT = false;

// Various Page Element IDs
const CASSUI_MAIN_BUSY_CTR = "#cassUiMainBusyContainer";
const CASSUI_MAIN_BUSY_TXT = "#cassUiMainBusyText";
const CASSUI_MAIN_ERR_CTR = "#cassUiMainErrorContainer";
const CASSUI_MAIN_ERR_TXT = "#cassUiMainErrorText";
const CASSUI_HIGH_LVL_WARNING = ".cassUiHighLevelWarning";
const CASSUI_MAIN_CONTENTS_CTR = "#cassUiMainContentsContainer";

const CASSUI_MODAL_INPUT = ".cassUiModalInput";
const CASSUI_MODAL_BTN = ".cassUiModalButton";
const CASSUI_MODAL_BUSY_CTR = ".cassUiModalBusyCtr";
const CASSUI_MODAL_BUSY_TXT = ".cassUiModalBusyText";
const CASSUI_MODAL_ERROR_CTR = ".cassUiModalErrorCtr";
const CASSUI_MODAL_ERROR_TXT = ".cassUiModalErrorText";

const SHOW_ALM_EDIT_VIEW_BTN = "#showAlmEditBtn";
const SHOW_ALM_VIS_VIEW_BTN = "#showAlmVisBtn";

const FWK_ALN_HDR_NAME1 = "#frameworkHeaderAlignmentName1";
const FWK_ALN_HDR_NAME2 = "#frameworkHeaderAlignmentName2";
const FWK_ALN_NAME1 = "#frameworkAlignmentName1";
const FWK_ALN_NAME2 = "#frameworkAlignmentName2";

const FWK_ALN_PAGE_TOOLS = "#page-tools";
const FWK_ALN_FULL_TOOLSET = "#fwkAlnFullToolset";
const FWK_ALN_OPEN_ONLY_TOOLSET = "#fwkAlnOpenFwkOnlyToolset";

const FWK_ALN_VIS_SCREEN_SIMPLE = "alignment-visualize-screen";
const FWK_ALN_VIS_SCREEN = "#" + FWK_ALN_VIS_SCREEN_SIMPLE;
const FWK_ALN_EDIT_SCREEN_SIMPLE = "alignment-edit-screen";
const FWK_ALN_EDIT_SCREEN = "#" + FWK_ALN_EDIT_SCREEN_SIMPLE;

//**************************************************************************************************
// Variables
var currentScreen;

//**************************************************************************************************
// General UI Utility Functions
//**************************************************************************************************

queryParams = function () {
    if (window.document.location.search == null)
        return {};
    var hashSplit = (window.document.location.search.split("?"));
    if (hashSplit.length > 1) {
        var o = {};
        var paramString = hashSplit[1];
        var parts = (paramString).split("&");
        for (var i = 0; i < parts.length; i++)
            o[parts[i].split("=")[0]] = decodeURIComponent(parts[i].replace(parts[i].split("=")[0] + "=", ""));
        return o;
    }
    return {};
};

queryParams = queryParams();

function debugMessage(msg) {
    if (DEBUG_CONSOLE) console.log(msg);
    if (DEBUG_ALERT) alert(msg);
}

function showScreen(newScreen) {
    $('.screen:visible').fadeOut('fast', function () {
        $('#' + newScreen).fadeIn('fast');
    });
}

function showPageMainContentsContainer() {
    if (!$(CASSUI_MAIN_CONTENTS_CTR).is(":visible")) {
        $(CASSUI_MAIN_BUSY_CTR).hide();
        $(CASSUI_MAIN_ERR_CTR).hide();
        $(CASSUI_MAIN_CONTENTS_CTR).show();
    }
}

function hidePageMainContentsContainer() {
    $(CASSUI_MAIN_CONTENTS_CTR).hide();
}

function showPageAsBusy(text) {
    $(CASSUI_MAIN_ERR_CTR).hide();
    $(CASSUI_HIGH_LVL_WARNING).hide();
    hidePageMainContentsContainer();
    $(CASSUI_MAIN_BUSY_TXT).html(text);
    $(CASSUI_MAIN_BUSY_CTR).show();
}

function showPageError(text) {
    $(CASSUI_MAIN_BUSY_CTR).hide();
    $(CASSUI_HIGH_LVL_WARNING).hide();
    hidePageMainContentsContainer();
    $(CASSUI_MAIN_ERR_TXT).html(text);
    $(CASSUI_MAIN_ERR_CTR).show();
    disableViewToggleButtons();
    showOnlyOpenAlignTool();
}

function disableModalInputsAndButtons() {
    $(CASSUI_MODAL_INPUT).attr("disabled", "true");
    $(CASSUI_MODAL_BTN).attr("disabled", "true");
}

function enableModalInputsAndButtons() {
    $(CASSUI_MODAL_INPUT).removeAttr("disabled");
    $(CASSUI_MODAL_BTN).removeAttr("disabled");
}

function showModalBusy(modalId,busyHtml) {
    hideModalError(modalId);
    disableModalInputsAndButtons();
    $(modalId + ' ' + CASSUI_MODAL_BUSY_TXT).html(busyHtml);
    $(modalId + ' ' + CASSUI_MODAL_BUSY_CTR).show();
}

function hideModalBusy(modalId) {
    $(modalId + ' ' + CASSUI_MODAL_BUSY_CTR).hide();
}

function showModalError(modalId,errorHtml) {
    hideModalBusy(modalId);
    enableModalInputsAndButtons();
    $(modalId + ' ' + CASSUI_MODAL_ERROR_TXT).html(errorHtml);
    $(modalId + ' ' + CASSUI_MODAL_ERROR_CTR).show();
}

function hideModalError(modalId) {
    $(modalId + ' ' + CASSUI_MODAL_ERROR_CTR).hide();
    $(CASSUI_MODAL_INPUT).removeClass("invalid");
}

function showModalInputAsInvalid(fieldId) {
    $(fieldId).addClass("invalid");
}

function generateAnchorLink(href, text, target) {
    return "<a href=\"" + href + "\" target=\"" + target + "\">" + escapeSingleQuote(text) + "</a>";
}

function buildFrameworkHyperlink(frameworkId,frameworkName) {
    return generateAnchorLink("https://cassproject.github.io/cass-editor/?frameworkId=" + frameworkId + "&view=true", frameworkName, frameworkName);
}

function buildFrameworkCompetencyHyperlink(frameworkId,competencyId,competencyName) {
    return generateAnchorLink("https://cassproject.github.io/cass-editor/?frameworkId=" + frameworkId + "&competencyId=" +  + "&view=true", competencyName, competencyName);
}

if ( typeof String.prototype.startsWith != 'function' ) {
    String.prototype.startsWith = function( str ) {
        return str.length > 0 && this.substring( 0, str.length ) === str;
    }
};

if ( typeof String.prototype.endsWith != 'function' ) {
    String.prototype.endsWith = function( str ) {
        return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
    }
};

//**************************************************************************************************
// Framework Alignment Page UI Functions
//**************************************************************************************************

function showOnlyOpenAlignTool() {
    $(FWK_ALN_FULL_TOOLSET).hide();
    $(FWK_ALN_OPEN_ONLY_TOOLSET).show();
    $(FWK_ALN_PAGE_TOOLS).show();
}

function hideFrameworkAlignmentTools() {
    $(FWK_ALN_PAGE_TOOLS).hide();
}

function showVisualViewMainContentsScreen() {
    showPageMainContentsContainer();
    showScreen(FWK_ALN_VIS_SCREEN_SIMPLE);
    currentScreen = FWK_ALN_VIS_SCREEN_SIMPLE;
}

function showEditViewMainContentsScreen() {
    showPageMainContentsContainer();
    showScreen(FWK_ALN_EDIT_SCREEN_SIMPLE);
    currentScreen = FWK_ALN_EDIT_SCREEN_SIMPLE;
}

function disableViewToggleButtons() {
    $(SHOW_ALM_EDIT_VIEW_BTN).attr("disabled", "true");
    $(SHOW_ALM_VIS_VIEW_BTN).attr("disabled", "true");
}

function enableViewToggleButtons() {
    $(SHOW_ALM_EDIT_VIEW_BTN).removeAttr("disabled");
    $(SHOW_ALM_VIS_VIEW_BTN).removeAttr("disabled");
}

function setFrameworkAlignmentNames(fw1Name,fw2Name,fw1Id,fw2Id) {
    $(FWK_ALN_HDR_NAME1).html(fw1Name);
    $(FWK_ALN_HDR_NAME2).html(fw2Name);
    $(FWK_ALN_NAME1).html(fw1Name);
    $(FWK_ALN_NAME2).html(fw2Name);
    if (fw1Id && fw1Id.trim().length > 0 && fw2Id && fw2Id.trim().length > 0) {
        $(FWK_ALN_HDR_NAME1).attr("title","Explore '" + escapeSingleQuote(fw1Name) + "'");
        $(FWK_ALN_HDR_NAME1).attr("onclick","loadAndOpenFramework('" + fw1Id + "')");
        $(FWK_ALN_HDR_NAME2).attr("title","Explore '" + escapeSingleQuote(fw2Name) + "'");
        $(FWK_ALN_HDR_NAME2).attr("onclick","loadAndOpenFramework('" + fw2Id + "')");
    }
}

//**************************************************************************************************
// Foundation
//**************************************************************************************************

$(document).foundation();
