//**************************************************************************************************
// CASS UI Framework Alignment Main Functions
//**************************************************************************************************

//TODO loadAndOpenFramework implement
//TODO openFrameworkAlignSetupModal implement
//TODO openFrameworkAutoAlignmentModal implement

//**************************************************************************************************
// Constants

const CREATE_IMPLIED_RELATIONS = true;

const ALLOW_MANY_TO_MANY_ALM_CARDS = false;

const FWK_ALM_VIS_CG_DIVIDED = "divided";
const FWK_ALM_VIS_CG_MERGED = "merged";

const FWK_ALM_MRG_VIS_UNION_MODE = "union";
const FWK_ALM_MRG_VIS_INTERSECT_MODE = "intersect";

//**************************************************************************************************
// Variables

var availableFrameworkList = [];
var frameworkIdFrameworkMap = {};
var frameworkNameFrameworkMap = {};

var framework1Id = null;
var framework1Name = null;
var framework1Full = null;
var framework1PacketGraph = null;
var framework1CompData = null;
var framework1Relations = null;
var framework1D3Node = null;
var framework1D3NodeString = null;

var framework2Id = null;
var framework2Name = null;
var framework2Full = null;
var framework2PacketGraph = null;
var framework2CompData = null;
var framework2Relations = null;
var framework2D3Node = null;
var framework2D3NodeString = null;

var prepFinishedSuccessCallback;
var prepFinishedFailureCallback;

var relevantAlignmentRelationshipsMap;
var relevantAlignmentRelationshipsLTR;
var relevantAlignmentRelationshipsRTL;

var initialAlignmentEquivalentToCadsLTR;
var initialAlignmentRelatedToCadsLTR;
var initialAlignmentNarrowsCadsLTR;
var initialAlignmentDesiresCadsLTR;
var initialAlignmentRequiresCadsLTR;

var initialAlignmentEquivalentToCadsRTL;
var initialAlignmentRelatedToCadsRTL;
var initialAlignmentNarrowsCadsRTL;
var initialAlignmentDesiresCadsRTL;
var initialAlignmentRequiresCadsRTL;

//d3 circle packing visualization
var currentAlmVisCgView = FWK_ALM_VIS_CG_DIVIDED;
var currentMergedCgMode = FWK_ALM_MRG_VIS_UNION_MODE;
var currentMergedCgHideLabels = true;
var mergedAlmVisD3Node;
var mergedCgNodeToCompMap;
var mergedCgUsedCompsList;
var almVisFw1UnalignedMap;
var almVisFw2UnalignedMap;
var almVisFw1EqMap;
var almVisFw1RelMap;
var almVisFw1BroadMap;
var almVisFw1DesMap;
var almVisFw1ReqMap;
var almVisFw2EqMap;
var almVisFw2RelMap;
var almVisFw2BroadMap;
var almVisFw2DesMap;
var almVisFw2ReqMap;
var mergedAdhList;
var mergedAdhListFw1;
var mergedAdhListFw2;
var mergedAlmVisCgIdToAdhMap;
var dividedAdhList;
var dividedAdhListFw1;
var dividedAdhListFw2;
var dividedRelPathToAdhMap;
var almVisDvdCgRootNodeX;
var almVisDvdCgRootNodeY;
var compIdToAlmVisCchMap;

//**************************************************************************************************
// Data Structures
//**************************************************************************************************
function customAlignmentData() {
    this.relationIds = [];
    this.sourceCpds = [];
    this.targetCpds = [];
    this.alignmentType = "isEquivalentTo";
    this.direction = "LTR";
    this.almCardId = "";
}

function customAlignmentDataSimple() {
    this.relationIds = [];
    this.sourceIds = [];
    this.targetIds = [];
    this.alignmentType = "isEquivalentTo";
    this.direction = "LTR";
}

// function alignmentDisplayHelper(sourceFrameworkName, sourceCompetencyName, alignmentType) {
//     this.sourceFrameworkName = sourceFrameworkName;
//     this.sourceCompetencyName = sourceCompetencyName;
//     this.alignmentType = alignmentType;
//     this.targetCompetencyNames = [];
//     this.elemId;
// }
//
// function competencyCircleCoordsHelper(transformedX, transformedY, transformedR) {
//     this.tX = transformedX;
//     this.tY = transformedY;
//     this.tR = transformedR;
// }

//**************************************************************************************************
// Utility Functions
//**************************************************************************************************

function parseRemoteLinkedDataArrayIntoRelations(rldaArray) {
    var relArray = [];
    if (!rldaArray || rldaArray.length == 0) return relArray;
    for (var i=0;i<rldaArray.length;i++) {
        var rld = rldaArray[i];
        if ("relation" == rld.type.toLowerCase()) {
            var rel = new EcAlignment();
            rel.copyFrom(rld);
            relArray.push(rel);
        }
    }
    return relArray;
}

function doesFrameworkHaveCircularDependency(fnpg) {
    for (var i=0;i<fnpg.getNodePacketList().length;i++) {
        var np = fnpg.getNodePacketList()[i];
        if (np.getNodeCount() > 1) return true;
    }
    return false;
}

function frameworkCollapsedCorrectly(fnpg) {
    if (!fnpg || fnpg == null || fnpg.getNodePacketList() == null || fnpg.getNodePacketList().length == 0) {
        return false;
    }
    return true;
}

function getFrameworkName(frameworkId) {
    var fw = frameworkIdFrameworkMap[frameworkId];
    if (fw) return fw.name;
    else return "Framework not found";
}

//TODO loadAndOpenFramework implement this for going to framework explorer
function loadAndOpenFramework() {
    alert("TODO implement loadAndOpenFramework");
}

//**************************************************************************************************
// Auto Alignment Modal
//**************************************************************************************************

//TODO openFrameworkAutoAlignmentModal implement
function openFrameworkAutoAlignmentModal() {
    alert("TODO implement openFrameworkAutoAlignmentModal");
}

//**************************************************************************************************
// Open Alignment Setup Modal
//**************************************************************************************************

//TODO openFrameworkAlignSetupModal implement
function openFrameworkAlignSetupModal() {
    alert("TODO implement openFrameworkAlignSetupModal");
}

//**************************************************************************************************
// Alignment Display Setup
//**************************************************************************************************
// function buildElementIdForAlignmentListItem(elemIdPrefix, parentIdList, childId) {
//     return elemIdPrefix + "_" + buildIDableString(parentIdList) + "_" + buildIDableString(childId);
// }
//
// function buildElementIdForAlignmentListItemLink(elemIdPrefix, childId) {
//     return elemIdPrefix + "_" + buildIDableString(childId) + "_lnk";
// }
//
// function buildAlignmentListItemHtml(cpd, hasChildren, elemId) {
//     var alignmentListItemLinkId = buildElementIdForAlignmentListItemLink(elemId, cpd.id);
//     if (!cpdToAlignmentListElemLinkMap[cpd.id]) cpdToAlignmentListElemLinkMap[cpd.id] = [];
//     cpdToAlignmentListElemLinkMap[cpd.id].push(alignmentListItemLinkId);
//     var retHtml = "";
//     if (hasChildren) retHtml += "<i class=\"fa fa-chevron-down\" aria-hidden=\"true\"></i>&nbsp;";
//     else retHtml += "<i class=\"fa fa-circle\" aria-hidden=\"true\"></i>&nbsp;";
//     retHtml += "<a id=\"" + alignmentListItemLinkId + "\" onclick=\"addCompetencyToAlignment('" + elemId + "');\" " +
//         " title=\" Add '" + cpd.name + "' to the selected alignment\" class=\"align-competency-title\">" +
//         cpd.name + "</a>";
//     return retHtml;
// }
//
// function addFrameworkChildToAlignmentListView(parentUl, childCpd, elemIdPrefix, parentIdList) {
//     var childLi = $("<li/>");
//     var childId = childCpd.id;
//     var elemId = buildElementIdForAlignmentListItem(elemIdPrefix, parentIdList, childId);
//     childLi.attr("id", elemId);
//     alignmentListElemToCpdMap[elemId] = childCpd;
//     if (!cpdToAlignmentListElemMap[childCpd.id]) cpdToAlignmentListElemMap[childCpd.id] = [];
//     cpdToAlignmentListElemMap[childCpd.id].push(elemId);
//     var childHasChildren = childCpd.children && childCpd.children.length > 0;
//     childLi.html(buildAlignmentListItemHtml(childCpd, childHasChildren, elemId));
//     if (childHasChildren) {
//         var childsChildUl = $("<ul/>");
//         childsChildUl.addClass("fa-ul");
//         $(childCpd.children).each(function (i, cc) {
//             addFrameworkChildToAlignmentListView(childsChildUl, cc, elemIdPrefix, parentIdList + "|" + childId);
//         });
//         childLi.append(childsChildUl);
//     }
//     parentUl.append(childLi);
// }
//
// function buildFrameworkListsForAlignment(fwListId, fwD3n, elemIdPrefix, parentIdList) {
//     $(fwListId).empty();
//     if (!fwD3n || fwD3n == null) return;
//     if (fwD3n.children && fwD3n.children.length > 0) {
//         fwD3n.children.sort(function (a, b) {
//             return a.name.localeCompare(b.name);
//         });
//         $(fwD3n.children).each(function (i, c) {
//             addFrameworkChildToAlignmentListView($(fwListId), c, elemIdPrefix, parentIdList);
//         });
//     }
// }
//
// function removeAllAlignmentCardsForPrep() {
//     if (alignmentCardList) {
//         for (var i = 0; i < alignmentCardList.length; i++) {
//             $("#" + alignmentCardList[i]).remove();
//         }
//     }
// }
//
// function buildAlignmentCardForCadList(cadList) {
//     if (cadList && cadList.length > 0) {
//         for (var i = 0; i < cadList.length; i++) {
//             createNewAlignmentCard(cadList[i], true);
//             unselectAllAlignmentCards();
//         }
//     }
// }
//
// function buildAlignmentCardsForExistingAlignments() {
//     buildAlignmentCardForCadList(initialAlignmentEquivalentToCadsRTL);
//     buildAlignmentCardForCadList(initialAlignmentRelatedToCadsRTL);
//     buildAlignmentCardForCadList(initialAlignmentNarrowsCadsRTL);
//     buildAlignmentCardForCadList(initialAlignmentDesiresCadsRTL);
//     buildAlignmentCardForCadList(initialAlignmentRequiresCadsRTL);
//     buildAlignmentCardForCadList(initialAlignmentEquivalentToCadsLTR);
//     buildAlignmentCardForCadList(initialAlignmentRelatedToCadsLTR);
//     buildAlignmentCardForCadList(initialAlignmentNarrowsCadsLTR);
//     buildAlignmentCardForCadList(initialAlignmentDesiresCadsLTR);
//     buildAlignmentCardForCadList(initialAlignmentRequiresCadsLTR);
//     // if (currentAlignmentCard != null) {
//     //     revealAlignmentColumn();
//     //     $("#" + currentAlignmentCard).trigger("click");
//     // }
//     if (alignmentCardList && alignmentCardList.length > 0) {
//         revealAlignmentColumn();
//     } else {
//         hideAlignmentColumn();
//     }
//     unselectAllAlignmentCards();
//     currentAlignmentCard = null;
//     updateAlignmentListItemFilterLinks();
// }

function prepAlignmentFrameworkInitialDisplay() {
    showPageAsBusy("Building framework alignment display...");
    // removeAllAlignmentCardsForPrep();
    // hideAlignmentColumn();
    // clearFrameworkAlignmentFilters();
    // alignmentListElemToCpdMap = {};
    // cpdToAlignmentListElemLinkMap = {};
    // cpdToAlignmentListElemMap = {};
    // alignmentCardList = [];
    // lastAlignmentCardIdx = 0;
    // currentAlignmentCard = null;
    // almCardIdToCadMap = {};
    // almCardCompToCpdMap = {};
    // almCardToCompNameMap = {};
    // cpdToCadMap = {};
    // buildFrameworkListsForAlignment(FWK_ALM_FW_LIST1, framework1D3n, FWK_ALM_FW1_SIDE_PREFIX, "ROOT");
    // buildFrameworkListsForAlignment(FWK_ALM_FW_LIST2, framework2D3n, FWK_ALM_FW2_SIDE_PREFIX, "ROOT");
    // registerAlignmentListToggles();
    // buildAlignmentCardsForExistingAlignments();
    // //showAlignmentEditViewMainContentsScreen();
    // showAlignmentEditViewMainContentsScreenInstant();
    // enableAlignmentViewToggleButtons();
}

//**************************************************************************************************
// Initial Custom Alignment Data (CAD) Generation and Rollup
//**************************************************************************************************

function generateSimpleCadFromRelation(rel, dir) {
    var scad = new customAlignmentDataSimple();
    scad.relationIds.push(rel.shortId());
    scad.sourceIds.push(rel.source);
    scad.targetIds.push(rel.target);
    scad.alignmentType = rel.relationType;
    scad.direction = dir;
    return scad;
}

//TODO LEFT OFF HERE

function getAlignmentSourceCpd(sourceId, dir) {
    if (dir == "LTR") return framework1Cnd.competencyClusterNodeMap[sourceId];
    else return framework2Cnd.competencyClusterNodeMap[sourceId];
}

function getAlignmentTargetCpd(targetId, dir) {
    if (dir == "LTR") return framework2Cnd.competencyClusterNodeMap[targetId];
    else return framework1Cnd.competencyClusterNodeMap[targetId];
}

function generateCadFromRelation(rel, dir) {
    var cad = new customAlignmentData();
    cad.relationIds.push(rel.shortId());
    cad.sourceCpds.push(getAlignmentSourceCpd(rel.source, dir));
    cad.targetCpds.push(getAlignmentTargetCpd(rel.target, dir));
    cad.alignmentType = rel.relationType;
    cad.direction = dir;
    return cad;
}

function generateCadFromSimpleCad(scad, dir) {
    var cad = new customAlignmentData();
    cad.relationIds = scad.relationIds.slice(0);
    for (var i = 0; i < scad.sourceIds.length; i++) {
        cad.sourceCpds.push(getAlignmentSourceCpd(scad.sourceIds[i], dir));
    }
    for (var i = 0; i < scad.targetIds.length; i++) {
        cad.targetCpds.push(getAlignmentTargetCpd(scad.targetIds[i], dir));
    }
    cad.alignmentType = scad.alignmentType;
    cad.direction = scad.direction;
    return cad;
}

function buildSimpleCadListFromRelArray(relArray, dir) {
    var simpleCadList = [];
    var simpleCadMap = {};
    for (var i = 0; i < relArray.length; i++) {
        var relSource = relArray[i].source;
        var relTarget = relArray[i].target;
        if (!simpleCadMap[relSource] || simpleCadMap[relSource] == null) {
            var newScad = generateSimpleCadFromRelation(relArray[i], dir);
            simpleCadMap[relSource] = newScad;
            simpleCadList.push(newScad);
        } else {
            var exScad = simpleCadMap[relSource];
            exScad.targetIds.push(relTarget);
            exScad.relationIds.push(relArray[i].shortId());
        }
    }
    return simpleCadList;
}

function mergeSimpleCads(simpleCad1, simpleCad2) {
    for (var i = 0; i < simpleCad2.relationIds.length; i++) {
        if (!simpleCad1.relationIds.includes(simpleCad2.relationIds[i])) {
            simpleCad1.relationIds.push(simpleCad2.relationIds[i]);
        }
    }
    for (var i = 0; i < simpleCad2.sourceIds.length; i++) {
        if (!simpleCad1.sourceIds.includes(simpleCad2.sourceIds[i])) {
            simpleCad1.sourceIds.push(simpleCad2.sourceIds[i]);
        }
    }
}

function findSimpleCadMatch(simpleCadList, startingIdx, scad, rolledUpList) {
    if (ALLOW_MANY_TO_MANY_ALM_CARDS || (scad.targetIds.length == 1)) {
        for (var j = startingIdx; j < simpleCadList.length; j++) {
            var isMatch = true;
            if (scad.targetIds.length != simpleCadList[j].targetIds.length) {
                isMatch = false;
            } else {
                for (var k = 0; k < simpleCadList[j].targetIds.length; k++) {
                    var targetId = simpleCadList[j].targetIds[k];
                    if (!scad.targetIds.includes(targetId)) {
                        isMatch = false;
                        break;
                    }
                }
            }
            if (isMatch) {
                mergeSimpleCads(scad, simpleCadList[j]);
                rolledUpList.push(simpleCadList[j].sourceIds.toString());
            }
        }
    }
}

function rollupSimpleCadList(simpleCadList) {
    var rolledUpList = [];
    var rscadList = []
    if (!simpleCadList || simpleCadList.length == 0) return rscadList;
    for (var i = 0; i < simpleCadList.length; i++) {
        if (!rolledUpList.includes(simpleCadList[i].sourceIds.toString())) {
            rscadList.push(simpleCadList[i]);
            findSimpleCadMatch(simpleCadList, i + 1, simpleCadList[i], rolledUpList);
        }
    }
    return rscadList;
}

function rollupMultipleRelationsIntoCads(relArray, dir) {
    var cads = [];
    var simpleCadList = buildSimpleCadListFromRelArray(relArray, dir);
    var rscadList = rollupSimpleCadList(simpleCadList);
    for (var i = 0; i < rscadList.length; i++) {
        cads.push(generateCadFromSimpleCad(rscadList[i], dir));
    }
    return cads;
}

function rollupRelationsIntoCads(relArray, dir) {
    var cads = [];
    if (!relArray || relArray.length == 0) {
        return cads;
    } else if (relArray.length == 1) {
        cads.push(generateCadFromRelation(relArray[0], dir));
    } else cads = rollupMultipleRelationsIntoCads(relArray, dir);
    return cads;
}

function getRelationsOfTypeForAlignment(relArray, relType) {
    var rotArray = [];
    for (var i = 0; i < relArray.length; i++) {
        var r = relArray[i];
        if (r.relationType == relType) rotArray.push(r);
    }
    return rotArray;
}

function buildInitialAlignmentCads() {
    if (relevantAlignmentRelationshipsLTR.length > 0) {
        initialAlignmentEquivalentToCadsLTR = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsLTR, "isEquivalentTo"), "LTR");
        initialAlignmentRelatedToCadsLTR = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsLTR, "isRelatedTo"), "LTR");
        initialAlignmentNarrowsCadsLTR = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsLTR, "narrows"), "LTR");
        initialAlignmentDesiresCadsLTR = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsLTR, "desires"), "LTR");
        initialAlignmentRequiresCadsLTR = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsLTR, "requires"), "LTR");
    }
    if (relevantAlignmentRelationshipsRTL.length > 0) {
        initialAlignmentEquivalentToCadsRTL = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsRTL, "isEquivalentTo"), "RTL");
        initialAlignmentRelatedToCadsRTL = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsRTL, "isRelatedTo"), "RTL");
        initialAlignmentNarrowsCadsRTL = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsRTL, "narrows"), "RTL");
        initialAlignmentDesiresCadsRTL = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsRTL, "desires"), "RTL");
        initialAlignmentRequiresCadsRTL = rollupRelationsIntoCads(getRelationsOfTypeForAlignment(relevantAlignmentRelationshipsRTL, "requires"), "RTL");
    }
}

//**************************************************************************************************
// Relevant Framework Relation
//**************************************************************************************************

function buildRelevantFrameworkAlignmentData(processedAlignmentIds, fwRelationArray) {
    for (var i = 0; i < fwRelationArray.length; i++) {
        var r = fwRelationArray[i];
        if (r.hasOwner(loggedInPk)) {
            var sourceCpd = framework1CompData.competencyPacketDataMap[fwRelationArray[i].source];
            var targetCpd = framework2CompData.competencyPacketDataMap[fwRelationArray[i].target];
            if (sourceCpd && targetCpd) {
                if (!processedAlignmentIds.includes(fwRelationArray[i].shortId())) {
                    processedAlignmentIds.push(fwRelationArray[i].shortId());
                    debugMessage("LTR Relevant alignment found: ");
                    debugMessage(fwRelationArray[i]);
                    relevantAlignmentRelationshipsLTR.push(fwRelationArray[i]);
                    relevantAlignmentRelationshipsMap[fwRelationArray[i].shortId()] = fwRelationArray[i];
                }
            }
            else {
                sourceCpd = framework2CompData.competencyPacketDataMap[fwRelationArray[i].source];
                targetCpd = framework1CompData.competencyPacketDataMap[fwRelationArray[i].target];
                if (sourceCpd && targetCpd) {
                    if (!processedAlignmentIds.includes(fwRelationArray[i].shortId())) {
                        processedAlignmentIds.push(fwRelationArray[i].shortId());
                        debugMessage("RTL Relevant alignment found: ");
                        debugMessage(fwRelationArray[i]);
                        relevantAlignmentRelationshipsRTL.push(fwRelationArray[i]);
                        relevantAlignmentRelationshipsMap[fwRelationArray[i].shortId()] = fwRelationArray[i];
                    }
                }
            }
        }
    }
}

function buildRelevantAlignmentRelationData() {
    showPageAsBusy("Finding relevant alignment data...");
    currentMergedCgHideLabels = false;
    relevantAlignmentRelationshipsMap = {};
    relevantAlignmentRelationshipsLTR = [];
    relevantAlignmentRelationshipsRTL = [];
    initialAlignmentEquivalentToCadsLTR = [];
    initialAlignmentRelatedToCadsLTR = [];
    initialAlignmentNarrowsCadsLTR = [];
    initialAlignmentDesiresCadsLTR = [];
    initialAlignmentRequiresCadsLTR = [];
    initialAlignmentEquivalentToCadsRTL = [];
    initialAlignmentRelatedToCadsRTL = [];
    initialAlignmentNarrowsCadsRTL = [];
    initialAlignmentDesiresCadsRTL = [];
    initialAlignmentRequiresCadsRTL = [];
    var processedAlignmentIds = [];
    if (!framework1CompData.competencyPacketDataMap || !framework2CompData.competencyPacketDataMap) return false;
    if (framework1Relations && framework1Relations.length > 0) buildRelevantFrameworkAlignmentData(processedAlignmentIds, framework1Relations);
    if (framework2Relations && framework2Relations.length > 0) buildRelevantFrameworkAlignmentData(processedAlignmentIds, framework2Relations);
    buildInitialAlignmentCads();
}

//**************************************************************************************************
// Framework Alignment Setup
//**************************************************************************************************

function handleFetchFramework2RelationDataSuccess(rldArray) {
    debugMessage("Framework 2 relations retrieved:");
    debugMessage(rldArray);
    framework2Relations = parseRemoteLinkedDataArrayIntoRelations(rldArray);
    debugMessage("Framework 2 relations parsed:");
    debugMessage(framework2Relations);
    buildRelevantAlignmentRelationData();
    prepAlignmentFrameworkInitialDisplay();
}

function handleFetchFramework2RelationDataFailure(err) {
    showPageError("Could not retrieve framework relations data (" + framework2Name + "): " + err);
}

function fetchFramework2RelationData() {
    showPageAsBusy("Fetching framework relation data (2/2)...");
    if (!framework2Full.relation || framework2Full.relation.length == 0) {
        debugMessage("Framework 2 has no relations.  Bypassing relation fetch...");
        handleFetchFramework2RelationDataSuccess([]);
    } else {
        repo.multiget(framework2Full.relation, handleFetchFramework2RelationDataSuccess, handleFetchFramework2RelationDataFailure, handleFetchFramework2RelationDataSuccess);
    }
}

function handleFetchFramework1RelationDataSuccess(rldArray) {
    debugMessage("Framework 1 relations retrieved:");
    debugMessage(rldArray);
    framework1Relations = parseRemoteLinkedDataArrayIntoRelations(rldArray);
    debugMessage("Framework 1 relations parsed:");
    debugMessage(framework1Relations);
    fetchFramework2RelationData();
}

function handleFetchFramework1RelationDataFailure(err) {
    showPageError("Could not retrieve framework relations data (" + framework1Name + "): " + err);
}

function fetchFramework1RelationData() {
    showPageAsBusy("Fetching framework relation data (1/2)...");
    if (!framework1Full.relation || framework1Full.relation.length == 0) {
        debugMessage("Framework 1 has no relations.  Bypassing relation fetch...");
        handleFetchFramework1RelationDataSuccess([]);
    } else {
        repo.multiget(framework1Full.relation, handleFetchFramework1RelationDataSuccess, handleFetchFramework1RelationDataFailure, handleFetchFramework1RelationDataSuccess);
    }
}

function generateFrameworkCompetencyData() {
    showPageAsBusy("Building framework competency data...");
    if (framework1CompData == null) framework1CompData = buildFrameworkCompetencyData(framework1Id,framework1Name,framework1PacketGraph);
    if (framework2CompData == null) framework2CompData = buildFrameworkCompetencyData(framework2Id,framework2Name,framework2PacketGraph);
    framework1D3Node = setUpD3FrameworkNodes(framework1Name, framework1CompData);
    framework2D3Node = setUpD3FrameworkNodes(framework2Name, framework2CompData);
    debugMessage("framework 1 D3 Custom Node:");
    debugMessage(framework1D3Node);
    debugMessage("framework 2 D3 Custom Node:");
    debugMessage(framework2D3Node);
    framework1D3NodeString = buildD3JsonString(framework1D3Node);
    framework2D3NodeString = buildD3JsonString(framework2D3Node);
    fetchFramework1RelationData();
}

function handleCollapseFramework2ForAlignmentSuccess(frameworkId, fnpg) {
    debugMessage("Framework 2 collapsed:" + frameworkId);
    debugMessage(fnpg);
    if (!frameworkCollapsedCorrectly(fnpg)) {
        showPageError("Could not determine framework competencies (" + framework2Name + ").  Check framework permissions.");
    }
    else if (doesFrameworkHaveCircularDependency(fnpg)) {
        showPageError("Framework (" + framework2Name + ") contains a circular dependency.  Cannot align.");
    }
    else {
        framework2PacketGraph = fnpg;
        generateFrameworkCompetencyData();
    }
}

function handleCollapseFramework2ForAlignmentFailure(err) {
    showPageError("Could not collapse framework (" + framework2Name + "): " + err);
}

function collapseFramework2ForAlignment() {
    showPageAsBusy("Collapsing framework data (2/2)...");
    if (framework2CompData == null) {
        debugMessage("Framework 2 not cached. Collapsing...");
        var fc = new FrameworkCollapser();
        fc.collapseFramework(repo, framework2Full, CREATE_IMPLIED_RELATIONS, handleCollapseFramework2ForAlignmentSuccess, handleCollapseFramework2ForAlignmentFailure);
    }
    else {
        generateFrameworkCompetencyData();
    }
}

function handleCollapseFramework1ForAlignmentSuccess(frameworkId, fnpg) {
    debugMessage("Framework 1 collapsed:" + frameworkId);
    debugMessage(fnpg);
    if (!frameworkCollapsedCorrectly(fnpg)) {
        showPageError("Could not determine framework competencies (" + framework1Name + ").  Check framework permissions.");
    }
    else if (doesFrameworkHaveCircularDependency(fnpg)) {
        showPageError("Framework (" + framework1Name + ") contains a circular dependency.  Can not align.");
    }
    else {
        framework1PacketGraph = fnpg;
        collapseFramework2ForAlignment();
    }
}

function handleCollapseFramework1ForAlignmentFailure(err) {
    showPageError("Could not collapse framework (" + framework1Name + "): " + err);
}

function collapseFramework1ForAlignment() {
    showPageAsBusy("Collapsing framework data (1/2)...");
    if (framework1CompData == null) {
        debugMessage("Framework 1 not cached. Collapsing...");
        var fc = new FrameworkCollapser();
        fc.collapseFramework(repo, framework1Full, CREATE_IMPLIED_RELATIONS, handleCollapseFramework1ForAlignmentSuccess, handleCollapseFramework1ForAlignmentFailure);
    }
    else {
        collapseFramework2ForAlignment();
    }
}

function handleFetchMissingFramework2DataForAlignmentSuccess(framework) {
    framework2Full = framework;
    collapseFramework1ForAlignment();
}

function handleFetchMissingFramework2DataForAlignmentFailure(err) {
    showPageError("Could not fetch framework (" + framework2Name + "): " + err);
}

function fetchMissingFramework2DataForAlignment() {
    showPageAsBusy("Fetching framework data (2/2)...");
    if (framework2Full == null) {
        debugMessage("Framework 2 not cached. Fetching...");
        EcFramework.get(framework2Id, handleFetchMissingFramework2DataForAlignmentSuccess, handleFetchMissingFramework2DataForAlignmentFailure);
    }
    else {
        collapseFramework1ForAlignment();
    }
}

function handleFetchMissingFramework1DataForAlignmentSuccess(framework) {
    framework1Full = framework;
    fetchMissingFramework2DataForAlignment();
}

function handleFetchMissingFramework1DataForAlignmentFailure(err) {
    showPageError("Could not fetch framework (" + framework1Name + "): " + err);
}

function fetchMissingFramework1DataForAlignment() {
    showPageAsBusy("Fetching framework data (1/2)...");
    if (framework1Full == null) {
        debugMessage("Framework 1 not cached. Fetching...");
        EcFramework.get(framework1Id, handleFetchMissingFramework1DataForAlignmentSuccess, handleFetchMissingFramework1DataForAlignmentFailure);
    }
    else {
        fetchMissingFramework2DataForAlignment();
    }
}

function checkForExistingData() {
    var tempFw1Full = framework1Full;
    var tempFw1Cd = framework1CompData;
    if (framework1Id == framework1Full.shortId()) {
        debugMessage("new framework 1 exists as old framework 1");
    }
    else {
        if (framework1Id == framework2Full.shortId()) {
            debugMessage("new framework 1 exists as old framework 2");
            framework1Full = framework2Full;
            framework1CompData = framework2CompData;
        }
        else {
            debugMessage("new framework 1 needs load");
            framework1Full = null;
            framework1CompData = null;
        }
    }
    if (framework2Id == framework2Full.shortId()) {
        debugMessage("new framework 2 exists as old framework 2");
    }
    else {
        if (framework2Id == tempFw1Full.shortId()) {
            debugMessage("new framework 2 exists as old framework 1");
            framework2Full = tempFw1Full;
            framework2CompData = tempFw1Cd;
        }
        else {
            debugMessage("new framework 2 needs load");
            framework2Full = null;
            framework2CompData = null;
        }
    }
}

function initFrameworkData(forceDataRefresh) {
    if (forceDataRefresh) {
        framework1Full = null;
        framework1CompData = null;
        framework2Full = null;
        framework2CompData = null;
    }
    else checkForExistingData();
}

function buildFrameworkDataForAlignments(fw1Id,fw2Id,forceDataRefresh) {
    debugMessage("building framework data...");
    debugMessage("fw1Id: " + fw1Id);
    debugMessage("fw2Id: " + fw2Id);
    framework1Id = fw1Id;
    framework2Id = fw2Id;
    framework1Name = getFrameworkName(fw1Id);
    framework2Name = getFrameworkName(fw2Id);
    setFrameworkAlignmentNames(framework1Name,framework2Name,framework1Id,framework2Id);
    showPageAsBusy("Initializing framework alignment data...");
    currentAlmVisCgView = FWK_ALM_VIS_CG_DIVIDED;
    initFrameworkData(forceDataRefresh);
    fetchMissingFramework1DataForAlignment();
}

//**************************************************************************************************
//Available Framework Fetch
//**************************************************************************************************

function createSortedAvailableFrameworkList(ownedFrameworkList,unownedFrameworkList) {
    availableFrameworkList = [];
    ownedFrameworkList.sort(function (a, b) {return a.name.localeCompare(b.name);});
    unownedFrameworkList.sort(function (a, b) {return a.name.localeCompare(b.name);});
    for (var i=0;i<ownedFrameworkList.length;i++) {
        availableFrameworkList.push(ownedFrameworkList[i]);
    }
    for (var i=0;i<unownedFrameworkList.length;i++) {
        availableFrameworkList.push(unownedFrameworkList[i]);
    }
}

function buildFrameworkLists(arrayOfEcFrameworks) {
    var ownedFrameworkList = [];
    var unownedFrameworkList = [];
    frameworkIdFrameworkMap = {};
    for (var i=0;i<arrayOfEcFrameworks.length;i++) {
        var cecf = arrayOfEcFrameworks[i];
        if (cecf.name && cecf.name.trim().length > 0) {
            frameworkIdFrameworkMap[cecf.shortId()] = cecf;
            if (!frameworkNameFrameworkMap[cecf.name.trim()]) {
                frameworkNameFrameworkMap[cecf.name.trim()] = [];
            }
            frameworkNameFrameworkMap[cecf.name.trim()].push(cecf);
            if (cecf.hasOwner(loggedInPk)) {
                ownedFrameworkList.push(cecf);
            }
            else unownedFrameworkList.push(cecf);
        }
    }
    if ((ownedFrameworkList.length + unownedFrameworkList.length) <= 0) {
        showNoFrameworksAvailableWarning();
    }
    else {
        createSortedAvailableFrameworkList(ownedFrameworkList,unownedFrameworkList);
    }
}

function handleFetchFrameworksFromRepositorySuccess(arrayOfEcFrameworks) {
    buildFrameworkLists(arrayOfEcFrameworks);
    prepFinishedSuccessCallback();
}

function handleFetchFrameworksFromRepositoryFailure(err) {
    prepFinishedFailureCallback("Could not fetch framework list: " + err);
}

function fetchAvailableFrameworks() {
    disableViewToggleButtons();
    hideFrameworkAlignmentTools();
    showVisualViewMainContentsScreen();
    setFrameworkAlignmentNames("Loading...","Loading...",null,null);
    showPageAsBusy("Loading available frameworks...");
    EcFramework.search(repo, null, handleFetchFrameworksFromRepositorySuccess, handleFetchFrameworksFromRepositoryFailure, {});
}

function initAvailableFrameworks(success,failure) {
    prepFinishedSuccessCallback = success;
    prepFinishedFailureCallback = failure;
    fetchAvailableFrameworks();
}

//**************************************************************************************************
// Page Load
//**************************************************************************************************

// function loadPageContents() {
//     showPageError("");
// }
