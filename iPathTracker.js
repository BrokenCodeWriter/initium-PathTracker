// ==UserScript==
// @name         Path Tracker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Keep track of paths and pathid's
// @supportURL   https://github.com/BrokenCodeWriter/initium-PathTracker
// @author       BrokenSoul
// @match        https://www.playinitium.com/*
// @match        http://www.playinitium.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

const ver = "pathdata001";

function exportPathData() {
    var myjson = JSON.stringify(JSON.parse(GM_getValue(ver, JSON.stringify({}))), null, 2);
    //console.log(myjson);
    var x = window.open();
    x.document.open();
    x.document.write('<html><body><pre>' + myjson + '</pre></body></html>');
    x.document.close();
}

(function() {
    'use strict';
    var data = JSON.parse(GM_getValue(ver, JSON.stringify({})));

    $(document).ready(function() {

        $('.main-description').first().append("<br/><a id='pathexport' style='font-size: small;' href='#'>export path data</a>");

            $("#pathexport").on("click", function(e) {
                e.preventDefault();
                exportPathData();
            });
        });

    if($("#hitpointsBar p").length != 2){
        var location = locationName.text;
        if(location == "Volantis" | location == "Aera" | location == "Spargus"){
            console.log("Not capturing paths in cities.");
            return false;
        }

        var paths = getPaths();
        data[location] = paths;

        GM_setValue(ver, JSON.stringify(data));
    }

})();

function getPaths() {
    var pathsAttrs = $('a[onclick^="doGoto(event"').map(function() {return $(this).attr('onclick');});
    var pathsNames = $('a[onclick^="doGoto(event"').map(function() {return $(this).text();});
    var paths = [];
    for (var i = 0; i < pathsAttrs.length; i++) {
        var matches = getMatches(pathsAttrs[i]);
        var pathName = pathsNames[i];
        paths.push({[pathName]: parseInt(matches[0])});
    }

    function getMatches(string) {
        var matches = [];
        var index = 1;

        var parser = /doGoto\(event, (\d*)\)/gi;
        var match;

        while ((match = parser.exec(string))) {
            //console.log(match[index]);
            matches.push(match[index]);
        }
        return matches;
    }


    return paths;
}
