//**************************************************************************************************
// CASS UI Framework Alignment D3 Utility Functions
//**************************************************************************************************

// TODO fix zooming behavior when clicking on text instead of circle

//**************************************************************************************************
// Constants

const ALM_MRG_CIRCLE_PACK = "#alignmentMergedCirclePack";
const ALM_DVD_CIRCLE_PACK = "#alignmentDividedCirclePack";

const ALM_MRG_CIRCLE_PACK_PADDING = 10;
const ALM_DVD_CIRCLE_PACK_PADDING = 10;

const ALM_CIRCLE_TEXT_LIMIT_LNG = 35;

const ALM_MRG_REL_TO_GRDT_START = "rgb(151,83,95,1)";
const ALM_MRG_REL_TO_GRDT_STOP = "rgb(219,143,98,1)";
const ALM_MRG_REL_GRDT_ID = "relatedToGradientFill";
const ALM_MRG_EQ_FILT_ID = "equalToFilter";


//**************************************************************************************************
// Variables

var almMergedSvg = d3.select(ALM_MRG_CIRCLE_PACK);
var almMergedCgMargin = 20;
var almMergedCgDiameter = +almMergedSvg.attr("width");
var almMergedCirclePackGraph = almMergedSvg.append("g").attr("transform", "translate(" + almMergedCgDiameter / 2 + "," + almMergedCgDiameter / 2 + ")");

var almDividedSvg = d3.select(ALM_DVD_CIRCLE_PACK);
var almDividedCgMargin = 20;
var almDividedCgDiameter = +almDividedSvg.attr("width");
var almDividedCirclePackGraph = almDividedSvg.append("g").attr("transform", "translate(" + almDividedCgMargin / 2 + "," + almDividedCgMargin / 2 + ")");

var almMergedCgView;
var almMergedCgNode;
var almMergedCgCircle;
var almMergedZoomedToRoot = true;

var almDividedCgView;
var almDividedCgNode;
var almDividedCgCircle;

/* Orange = Frameworks
.range(["rgba(206, 108, 24,0)",
"rgba(206, 108, 24,0)",
"rgba(206, 108, 24,0)",
"rgba(206, 108, 24,1)"])

// Blue = Competencies & Profile
//.range(["rgba(19,116,153,0)", "rgba(19,116,153,1)"])


/* Burgendy - Frameworks
color1: 179,106,121
color2: 212,191,194
color3: 102,42,54
leafColor: 179,106,121, .5
*/

// Green
//.range(["rgba(156, 213, 92,0)", "rgba(156, 213, 92,1)"])

var almMergedCgColor = d3.scaleQuantize()
    .domain([-1, 2])
    // Orange = Frameworks
    .range(["rgba(235,173,135,0)",
        "rgba(219,143,98,1)",
        "rgba(227,174,140,1)",
        "rgba(199,96,40,1)"]);

var almDividedFw1CgColor = d3.scaleQuantize()
    .domain([-1, 2])
    // Burgendy
    .range(["rgba(179,106,121,0)",
        "rgba(151,83,95,1)",
        "rgba(168,128,132,1)",
        "rgba(102,42,54,1)"]);

var almDividedFw2CgColor = d3.scaleQuantize()
    .domain([-1, 2])
    // teal;
    .range(["rgba(235,173,135,0)",
        "rgba(219,143,98,1)",
        "rgba(227,174,140,1)",
        "rgba(199,96,40,1)"]);

var almMergedCgPack = d3.pack()
    .size([almMergedCgDiameter - almMergedCgMargin, almMergedCgDiameter - almMergedCgMargin])
    .padding(ALM_MRG_CIRCLE_PACK_PADDING);

var almDividedCgPack = d3.pack()
    .size([almDividedCgDiameter - almDividedCgMargin, almDividedCgDiameter - almDividedCgMargin])
    .padding(ALM_DVD_CIRCLE_PACK_PADDING);

//**************************************************************************************************
// Utility Functions
//**************************************************************************************************

function truncCircleText(str,textLimit) {
    if (str.length > textLimit) {
        return str.substring(0, textLimit) + "...";
    } else {
        return str;
    }
}

function cleanCircleText(str,textLimit) {
    var retStr = str.trim();
    retStr = truncCircleText(retStr,textLimit);
    return retStr;
}

//**************************************************************************************************
// Graph Functions (For Divided Alignment Circles)
//**************************************************************************************************

function addDividedAlignmentCgArrowheadDefMarkerPath(markerId, pathClass) {
    var svgMarker = d3.select(ALM_DVD_CIRCLE_PACK).select("defs").select("#" + markerId);
    svgMarker.append("path")
        .attr("d", "M 0 0 L 10 5 L 0 10 z")
        .attr("stroke", "none")
        .attr("class", pathClass);
}

function addDividedAlignmentCgArrowheadDefMarker(markerId) {
    var svgDefs = d3.select(ALM_DVD_CIRCLE_PACK).select("defs");
    svgDefs.append("marker")
        .attr("id", markerId)
        .attr("viewBox", "0 0 10 10")
        .attr("refX", "7")
        .attr("refY", "5")
        .attr("markerUnits", "strokeWidth")
        .attr("markerWidth", "4")
        .attr("markerHeight", "3")
        .attr("orient", "auto");
}

function addDividedAlignmentCgArrowheadDefs() {
    var svg2 = d3.select(ALM_DVD_CIRCLE_PACK);
    svg2.append("defs");
    addDividedAlignmentCgArrowheadDefMarker("eqRelAH");
    addDividedAlignmentCgArrowheadDefMarker("relRelAH");
    addDividedAlignmentCgArrowheadDefMarker("desRelAH");
    addDividedAlignmentCgArrowheadDefMarker("narRelAH");
    addDividedAlignmentCgArrowheadDefMarker("reqRelH");
    addDividedAlignmentCgArrowheadDefMarkerPath("eqRelAH", "eqRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("relRelAH", "relRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("desRelAH", "desRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("narRelAH", "narRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("reqRelH", "reqRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarker("faded-eqRelAH");
    addDividedAlignmentCgArrowheadDefMarker("faded-relRelAH");
    addDividedAlignmentCgArrowheadDefMarker("faded-desRelAH");
    addDividedAlignmentCgArrowheadDefMarker("faded-narRelAH");
    addDividedAlignmentCgArrowheadDefMarker("faded-reqRelH");
    addDividedAlignmentCgArrowheadDefMarkerPath("faded-eqRelAH", "relArrowHeadFaded eqRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("faded-relRelAH", "relArrowHeadFaded relRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("faded-desRelAH", "relArrowHeadFaded desRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("faded-narRelAH", "relArrowHeadFaded narRelArrowHead");
    addDividedAlignmentCgArrowheadDefMarkerPath("faded-reqRelH", "relArrowHeadFaded reqRelArrowHead");
}

function moveDividedCircleSvgTextToBottomOfSvgGroup() {
    $(ALM_DVD_CIRCLE_PACK + " g text").appendTo(ALM_DVD_CIRCLE_PACK + " g");
}

function addAlignmentPathsToDividedAlignmentCircleSvg(avrpList) {
    var svgG = d3.select(ALM_DVD_CIRCLE_PACK).select("g");
    for (var i = 0; i < avrpList.length; i++) {
        svgG.append("path")
            .attr("id", avrpList[i].pathId)
            .attr("class", avrpList[i].pathClass)
            .attr("d", avrpList[i].pathCoords)
            .attr("marker-end", "url(#" + avrpList[i].pathArrowHead + ")");
        var sp = d3.select("#" + avrpList[i].pathId);
        sp.on("mouseover", function () {
            handleDividedAlmRelPathOnMouseOver($(this).attr("id"));
            highlightDividedAlmRelPath($(this).attr("id"));
        });
        sp.on("mouseout", function () {
            handleDividedAlmRelPathOnMouseOut();
            removeAllDividedAlmRelPathHighlights();
        });
    }
    moveDividedCircleSvgTextToBottomOfSvgGroup();
}

function clearDividedAlignmentCircleSvg() {
    var svg2 = d3.select(ALM_DVD_CIRCLE_PACK);
    svg2.selectAll("*").remove();
    almDividedCirclePackGraph = svg2.append("g").attr("transform", "translate(" + almDividedCgDiameter / 2 + "," + almDividedCgDiameter / 2 + ")");
}

function zoomDividedAlmCg(d) {
    var focus0 = focus;
    focus = d;

    if (focus && focus.data && focus.data.name != FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) {
        if (typeof removeDividedAlignmentVisualizationRelationshipPaths === 'function') {
            removeDividedAlignmentVisualizationRelationshipPaths();
        }
        else debugMessage("Cannot find function 'removeDividedAlignmentVisualizationRelationshipPaths'...ignoring");
    }

    var transition = d3.transition()
        .duration(d3.event ? d3.event.altKey ? 7500 : 750 : 750)
        .tween("zoom", function (d) {
            var i = d3.interpolateZoom(almDividedCgView, [focus.x, focus.y, focus.r * 2 + almDividedCgMargin]);
            return function (t) {
                if (d && d.data && d.data.name == FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) {
                    zoomDividedAlmCgTo(i(t), true);
                }
                else zoomDividedAlmCgTo(i(t), false);
            };
        });

    transition.selectAll("text")
        .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function (d) {
            return d.parent === focus ? 1 : 0;
        })
        .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
        });

    transition.on("end", function (d) {
        if (focus && focus.data && focus.data.name == FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) {
            if (typeof drawDividedAlignmentVisualizationRelationshipPaths === 'function') {
                drawDividedAlignmentVisualizationRelationshipPaths();
            }
            else debugMessage("Cannot find function 'drawDividedAlignmentVisualizationRelationshipPaths'...ignoring");
        }
    });
}

function zoomDividedAlmCgTo(v, rebuildCircleCoordsHelperMap) {
    var k = almDividedCgDiameter / v[2];
    almDividedCgView = v;
    var compRegistered = [];
    if (rebuildCircleCoordsHelperMap) {
        if (typeof clearCompetencyCircleCoordsHelperMap === 'function') {
            clearCompetencyCircleCoordsHelperMap();
        }
        else debugMessage("THIS IS VERY BAD: missing clearCompetencyCircleCoordsHelperMap");
    }
    almDividedCgNode.attr("transform", function (d) {
        var transformedX = (d.x - v[0]) * k;
        var transformedY = (d.y - v[1]) * k;
        var transformedR = d.r * k;
        if (d.data && d.data.name) {
            if (rebuildCircleCoordsHelperMap) {
                if (typeof registerCompetencyCircleCoordsHelper === 'function') {
                    if (!compRegistered.includes(d.data.name + "|" + transformedX + "|" + transformedY)) {
                        registerCompetencyCircleCoordsHelper(d.data.name, transformedX, transformedY, transformedR);
                        compRegistered.push(d.data.name + "|" + transformedX + "|" + transformedY);
                    }
                }
                else debugMessage("THIS IS VERY BAD: missing registerCompetencyCircleCoordsHelper");
            }
        }
        return "translate(" + transformedX + "," + transformedY + ")";
    });
    almDividedCgCircle.attr("r", function (d) {
        return d.r * k;
    });
}

function getDividedAlignmentCgCircleFramework(d) {
    if (d.data && d.data.name == FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) return FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME;
    if (framework1Name && framework2Name) {
        var temp = d;
        keepGoing = true;
        while (keepGoing) {
            if (temp.parent) {
                if (temp.parent.data.name == FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) {
                    keepGoing = false;
                }
                else temp = temp.parent;
            }
            else keepGoing = false;
        }
        if (temp.data && temp.data.name == framework1Name) return "FW1";
        else return "FW2";
    }
    else return "FW1";
}

function sortRootDataForDividedAlignmentCg(a, b) {
    if (a.data && b.data && a.data.name && b.data.name) {
        if ((framework1Name == a.data.name || framework2Name == a.data.name) &&
            (framework1Name == b.data.name || framework2Name == b.data.name)) {
            if (framework1Name == a.data.name) {
                if (framework1Name == b.data.name) return 0;
                else if (framework2Name == b.data.name) return -1;
            }
            else if (framework2Name == a.data.name) {
                if (framework1Name == b.data.name) return 1;
                else if (framework2Name == b.data.name) return 0;
            }
            else return 0;

        }
        else return b.value - a.value;
    }
    else return b.value - a.value;
}

function getClassForDividedAlignmentCg(d) {
    var cls = d.parent ? d.children ? "node" : "node node--leaf" : "node node--root";
    if (cls == "node node--leaf") {
        var fw = getDividedAlignmentCgCircleFramework(d);
        if (fw == "FW1") {
            cls += " alm-div-fw1";
        }
        else if (fw == "FW2") {
            cls += " alm-div-fw2";
        }
    }
    return cls;
}

function getFillForDividedAlignmentCg(d) {
    var fw = getDividedAlignmentCgCircleFramework(d);
    if (fw == FWK_ALM_VIS_CG_DIVIDED_CIR_ROOT_NAME) {
        //do nothing
    }
    else if (fw == "FW1") return d ? almDividedFw1CgColor(d.depth%3) : null;
    else return d ? almDividedFw2CgColor(d.depth%3) : null;
}

function buildDividedAlignmentGraphCircles(error, root) {
    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            //return b.value - a.value;
            return sortRootDataForDividedAlignmentCg(a, b);
        });

    var focus = root;
    var nodes = almDividedCgPack(root).descendants();
    registerAlmVisDividedCgRootNodes(nodes);
    addDividedAlignmentCgArrowheadDefs();

    almDividedCgCircle = almDividedCirclePackGraph.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function (d) {
            return getClassForDividedAlignmentCg(d);
        })
        .style("fill", function (d) {
            return getFillForDividedAlignmentCg(d);
        })
        .on("click", function (d) {
            if (d.children) zoomDividedAlmCg(d);
            else if (d.parent) zoomDividedAlmCg(d.parent);
            if (d.data) {
                if (typeof showDividedAlignmentCircleGraphSidebarDetails === 'function') {
                    showDividedAlignmentCircleGraphSidebarDetails(d.data.name);
                }
                else debugMessage("Cannot find function 'showDividedAlignmentCircleGraphSidebarDetails'...ignoring");
            }
            else(debugMessage("Alm Circle click: d.data is null"));
            d3.event.stopPropagation();
        });

    /*****************************************************
     testing adding a rectangle svg behind text

     var rect = almDividedCirclePackGraph.selectAll("rect")
     .data(nodes)
     .enter().append("rect")
     .attr("class", "label-background");
     ****************************************************/

    var text = almDividedCirclePackGraph.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", "label")
        .style("fill-opacity", function (d) {
            return d.parent === root ? 1 : 0;
        })
        .style("display", function (d) {
            return d.parent === root ? "inline" : "none";
        })
        .text(function (d) {
            if (typeof getAlignmentDividedCgCircleText === 'function') {
                return cleanCircleText(getAlignmentDividedCgCircleText(d), ALM_CIRCLE_TEXT_LIMIT_LNG);
            }
            else return "UNDEFINED getAlignmentDividedCgCircleText";
        });

    almDividedCgNode = almDividedCirclePackGraph.selectAll("circle,text");

    almDividedSvg.style("background", almDividedFw1CgColor(-1))
        .on("click", function () {
            zoomDividedAlmCg(root);
        });

    zoomDividedAlmCgTo([root.x, root.y, root.r * 2 + almDividedCgMargin], true);
    if (typeof drawDividedAlignmentVisualizationRelationshipPaths === 'function') {
        drawDividedAlignmentVisualizationRelationshipPaths();
    }
    else debugMessage("Cannot find function 'drawDividedAlignmentVisualizationRelationshipPaths'...ignoring");
}

//**************************************************************************************************
// Graph Functions (For Merged Alignment Circle)
//**************************************************************************************************

function clearMergedAlignmentCircleSvg() {
    var svg2 = d3.select(ALM_MRG_CIRCLE_PACK);
    svg2.selectAll("*").remove();
    almMergedCirclePackGraph = svg2.append("g").attr("transform", "translate(" + almMergedCgDiameter / 2 + "," + almMergedCgDiameter / 2 + ")");
}

/* Is related to  */
function addMergedAlignmentCgRelatedGradient() {
    var svg2 = d3.select(ALM_MRG_CIRCLE_PACK);
    svg2.append("defs").append("linearGradient")
        .attr("id", ALM_MRG_REL_GRDT_ID)
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "75%")
        .attr("y2", "75%")
        .attr("gradientTransform", "rotate(15)")
        .append("stop")
        .attr("offset", "0%")
        .attr("style", "stop-color:" + ALM_MRG_REL_TO_GRDT_START + ";stop-opacity:1");
    svg2.select("linearGradient").append("stop")
        .attr("offset", "100%")
        .attr("style", "stop-color:" + ALM_MRG_REL_TO_GRDT_STOP + ";stop-opacity:1");
}

/************************************************
 Is equal to
 Should make a filter which ads essentially a
 filter to the bacground, slightly offset
 no gaussian blur no fade
 ************************************************/
function addMergedAlignmentCgEqualFilter() {
    var svg2 = d3.select(ALM_MRG_CIRCLE_PACK);
    var  filter = svg2.append("defs").append("filter")
        .attr("id", "equalToFilter")
        .attr("height", "130%");
    filter.append("feOffset")
        .attr("in", "sourceAlpha")
        .attr("dx", 1)
        .attr("dy", 1)
        .attr("result", "offsetBlur");

    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
        .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
        .attr("in", "SourceGraphic");
}

function zoomMergedAlmCg(d) {
    var focus0 = focus;
    focus = d;
    if (d.data.name == FWK_ALM_VIS_CG_MERGED_CIR_ROOT_NAME) almMergedZoomedToRoot = true;
    else almMergedZoomedToRoot = false;

    var transition = d3.transition()
        .duration(d3.event ? d3.event.altKey ? 7500 : 750 : 750)
        .tween("zoom", function (d) {
            var i = d3.interpolateZoom(almMergedCgView, [focus.x, focus.y, focus.r * 2 + almMergedCgMargin]);
            return function (t) {
                zoomMergedAlmCgTo(i(t));
            };
        });
    transition.selectAll("text")
        .filter(function (d) {
            return d.parent === focus || this.style.display === "inline";
        })
        .style("fill-opacity", function (d) {
            return d.parent === focus ? 1 : 0;
        })
        .on("start", function (d) {
            if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
            if (d.parent !== focus) this.style.display = "none";
        });
}

function zoomMergedAlmCgTo(v) {
    var k = almMergedCgDiameter / v[2];
    almMergedCgView = v;
    almMergedCgNode.attr("transform", function (d) {
        return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")";
    });
    almMergedCgCircle.attr("r", function (d) {
        return d.r * k;
    });
}

function buildMergedAlignmentGraphCircles(error, root) {

    if (error) throw error;

    root = d3.hierarchy(root)
        .sum(function (d) {
            return d.size;
        })
        .sort(function (a, b) {
            return b.value - a.value;
        });

    var focus = root;
    var nodes = almMergedCgPack(root).descendants();

    addMergedAlignmentCgRelatedGradient();
    addMergedAlignmentCgEqualFilter();

    almMergedCgCircle = almMergedCirclePackGraph.selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("class", function (d) {
            if (typeof getMergedAlmCgCircleClass === 'function') {
                return getMergedAlmCgCircleClass(d);
            }
            else return "node-unknown";
        })
        .attr("fill", function (d) {
            if (d.data && d.data.name && (d.data.name.startsWith(FWK_ALM_VIS_FW2_REL_ID_PREFIX) || d.data.name.startsWith(FWK_ALM_VIS_FW1_REL_ID_PREFIX))) {
                return "url(#" + ALM_MRG_REL_GRDT_ID + ")";
            }
        })
        .on("click", function (d) {
            if (d.data && d.data.name && d.data.name == "DUMMY") { //do nothing
            }
            else {
                if (d.children) zoomMergedAlmCg(d);
                else if (d.parent) zoomMergedAlmCg(d.parent);
                if (d.data) {
                    if (typeof showMergedAlignmentCircleGraphSidebarDetails === 'function') showMergedAlignmentCircleGraphSidebarDetails(d.data.name);
                    else debugMessage("Cannot find function 'showMergedAlignmentCircleGraphSidebarDetails'...ignoring");
                }
                else(debugMessage("Alm Circle click: d.data is null"));
            }
            d3.event.stopPropagation();
        })
        .on("mouseover", function (d) {
            if (d.data && d.data.name == "DUMMY" && almMergedZoomedToRoot) {
                if (d.parent && d.parent.data.name) {
                    handleMergedAlmRelPathOnMouseOver(d.parent.data.name);
                }
            }
            else if (d.data && almMergedZoomedToRoot) {
                if (d.data.name == FWK_ALM_VIS_CG_MERGED_CIR_ROOT_NAME) handleMergedAlmRelPathOnMouseOut();
                else handleMergedAlmRelPathOnMouseOver(d.data.name);
            }
        })
        .on("mouseout", function (d) {
            if (almMergedZoomedToRoot) {
                handleMergedAlmRelPathOnMouseOut();
            }
        });

    var text = almMergedCirclePackGraph.selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("class", function (d) {
            if (typeof getMergedAlmCgLabelClass === 'function') {
                return getMergedAlmCgLabelClass(d);
            }
            else return "label";
        })
        .style("fill-opacity", function (d) {
            return d.parent === root ? 1 : 0;
        })
        .style("display", function (d) {
            return d.parent === root ? "inline" : "none";
        })
        .text(function (d) {
            if (typeof getMergedAlmCgCircleText === 'function') {
                return cleanCircleText(getMergedAlmCgCircleText(d), ALM_CIRCLE_TEXT_LIMIT_LNG);
            }
            else return "UNDEFINED getMergedAlmCgCircleText";
        });

    almMergedCgNode = almMergedCirclePackGraph.selectAll("circle,text");

    almMergedSvg.style("background", almMergedCgColor(-1))
        .on("click", function () {
            if (typeof showMergedAlignmentCircleGraphSidebarDetails === 'function') {
                showMergedAlignmentCircleGraphSidebarDetails(FWK_ALM_VIS_CG_MERGED_CIR_ROOT_NAME);
            }
            else debugMessage("Cannot find function 'showMergedAlignmentCircleGraphSidebarDetails'...ignoring");
            zoomMergedAlmCg(root);
        });

    almMergedZoomedToRoot = true;
    zoomMergedAlmCgTo([root.x, root.y, root.r * 2 + almMergedCgMargin]);

}