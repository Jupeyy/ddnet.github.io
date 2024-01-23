var g_DemoFile;
var g_MapFile;
var Module = {
    print: (function () { return function (text) { console.log(text); }; })(),
    printErr: function (text) {
        if (arguments.length > 1)
            text = Array.prototype.slice.call(arguments).join(' ');
        if (0) {
            // dump(text + '\n');
        }
    },
    canvas: (function () {
        var canvas = document.getElementById('canvas');
        return canvas;
    })(),
    arguments: []
};
function RemoveEls() {
    document.getElementById('DemoFileInput').remove();
    document.getElementById('DemoFileLoad').remove();
    document.getElementById('renderdemos').remove();
    document.getElementById('MapFileInput').remove();
    document.getElementById('MapFileLoad').remove();
    document.getElementById('rendermap').remove();
}
function GetMapFromURL() {
    if (location.search === "")
        return { map: "" };
    var o = { map: "" };
    var nvPairs = location.search.substring(1).replace(/\+/g, " ").split("&");
    nvPairs.forEach(function (pair) {
        var e = pair.indexOf('=');
        var n = decodeURIComponent(e < 0 ? pair : pair.substring(0, e)), v = (e < 0 || e + 1 == pair.length)
            ? null
            : decodeURIComponent(pair.substring(e + 1, pair.length));
        o[n] = v;
    });
    return o;
}
function OnLoad() {
    var MapName = GetMapFromURL();
    if (MapName.map != "") {
        RemoveEls();
        var MapReq = new XMLHttpRequest();
        MapReq.open("GET", MapName.map + ".map", true);
        MapReq.responseType = "arraybuffer";
        MapReq.onload = function (evt) {
            LoadMapFileImpl(MapName.map, evt.target.response, 0);
        };
        MapReq.send(null);
    }
}
function LoadDemoFile() {
    var DemoFile, fr;
    if (typeof window.FileReader !== 'function') {
        console.log("File API not supported.");
        return;
    }
    var FInput = document.getElementById('DemoFileInput');
    if (!FInput) {
        console.log("Smth went really wrong.");
        return;
    }
    else if (!FInput.files) {
        console.log("No files available, browser bug?.");
        return;
    }
    else if (!FInput.files[0]) {
        console.log("No files selected.");
    }
    else {
        DemoFile = FInput.files[0];
        fr = new FileReader();
        fr.onload = GotBinary;
        fr.readAsArrayBuffer(DemoFile);
    }
    function GotBinary() {
        Module['arguments'].push('-d');
        Module['arguments'].push(DemoFile.name);
        g_DemoFile = new Uint8Array(fr.result);
        Module['arguments'].push(g_DemoFile.byteLength.toString());
        RemoveEls();
        document.getElementById('canvas')
            .style.top = "0px";
        var DDNetJS = document.createElement("script");
        DDNetJS.src = "DDNet_demo.js";
        document.head.appendChild(DDNetJS);
    }
}
function LoadMapFileImpl(Name, Result, RemEls) {
    Module['arguments'].push('-m');
    Module['arguments'].push(Name);
    g_MapFile = new Uint8Array(Result);
    Module['arguments'].push(g_MapFile.byteLength.toString());
    if (RemEls == 1)
        RemoveEls();
    document.getElementById('canvas').style.top =
        "0px";
    var DDNetJS = document.createElement("script");
    DDNetJS.src = "DDNet_map.js";
    document.head.appendChild(DDNetJS);
}
function LoadMapFile() {
    var MapFile, fr;
    if (typeof window.FileReader !== 'function') {
        console.log("File API not supported.");
        return;
    }
    var FInput = document.getElementById('MapFileInput');
    if (!FInput) {
        console.log("Smth went really wrong.");
        return;
    }
    else if (!FInput.files) {
        console.log("No files available, browser bug?.");
        return;
    }
    else if (!FInput.files[0]) {
        console.log("No files selected.");
    }
    else {
        MapFile = FInput.files[0];
        fr = new FileReader();
        fr.onload = GotBinary;
        fr.readAsArrayBuffer(MapFile);
    }
    function GotBinary() {
        LoadMapFileImpl(MapFile.name, fr.result, 1);
    }
}
