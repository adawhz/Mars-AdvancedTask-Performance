/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 96.81572058665328, "KoPercent": 3.1842794133467205};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6658120271094058, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3400696864111498, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [0.7379807692307693, 500, 1500, "Add Education"], "isController": false}, {"data": [0.2735252808988764, 500, 1500, "Delete Listings"], "isController": false}, {"data": [0.875, 500, 1500, "Add Certification"], "isController": false}, {"data": [0.9059233449477352, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.3767361111111111, 500, 1500, "Update Education"], "isController": false}, {"data": [0.8863031914893617, 500, 1500, "Add Language"], "isController": false}, {"data": [0.5404181184668989, 500, 1500, "View Listings"], "isController": false}, {"data": [0.814484126984127, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.5411328388401888, 500, 1500, "Update Certification"], "isController": false}, {"data": [0.9086345381526104, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.7717770034843205, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.3674110258199581, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.9383245382585752, 500, 1500, "SignIn"], "isController": false}, {"data": [0.7518321119253831, 500, 1500, "Update Language"], "isController": false}, {"data": [0.8568010936431989, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.03642149929278642, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [0.8881884538818845, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.7556216931216931, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 27887, 888, 3.1842794133467205, 31186.680209416605, 57, 2196000, 489.0, 26568.40000000014, 148090.15000000005, 2115583.0, 9.223013911745873, 5.107746996203573, 5.89885727919684], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 1435, 0, 0.0, 34937.67317073173, 125, 220094, 1660.0, 202606.0, 205465.6, 219505.88, 1.710440840797888, 0.374158933924538, 2.2015244415738437], "isController": false}, {"data": ["Add Education", 1456, 1, 0.06868131868131869, 24130.688186813182, 91, 2101241, 426.5, 1453.3, 2432.9499999999953, 2081922.02, 0.4940409701118786, 0.09988485278359513, 0.32903900548466913], "isController": false}, {"data": ["Delete Listings", 1424, 7, 0.49157303370786515, 32224.896067415713, 244, 2116231, 1958.5, 52836.0, 145950.5, 220457.75, 0.4820960887923493, 0.09207948806829108, 0.2763578165245205], "isController": false}, {"data": ["Add Certification", 1488, 0, 0.0, 8467.807123655912, 59, 2081815, 87.0, 702.4000000000005, 1998.6499999999999, 34679.67999999999, 0.5081887374720205, 0.10272955923506667, 0.3290323563905759], "isController": false}, {"data": ["Delete Education", 1435, 0, 0.0, 710.875261324043, 58, 189661, 81.0, 811.4000000000001, 1120.8000000000004, 2785.3600000000024, 1.719973870780221, 0.36616631233407043, 0.9993988799943666], "isController": false}, {"data": ["Update Education", 1440, 381, 26.458333333333332, 10390.141666666665, 157, 2111282, 662.0, 3841.2000000000007, 4963.55, 37800.61999999991, 0.4871466030489288, 0.10358307479747049, 0.33967058064153827], "isController": false}, {"data": ["Add Language", 1504, 2, 0.13297872340425532, 5564.514627659573, 59, 2100936, 89.0, 767.5, 807.0, 56478.80000000007, 0.5102451042423284, 0.10315386455536922, 0.30445288934771747], "isController": false}, {"data": ["View Listings", 1435, 2, 0.13937282229965156, 12192.391637630659, 117, 2107660, 824.0, 2893.400000000002, 89362.8, 203540.32, 0.4871087600145827, 0.6209198011493051, 0.2911235948524654], "isController": false}, {"data": ["Add Skill", 1512, 9, 0.5952380952380952, 13477.449074074071, 60, 224847, 92.5, 23731.100000000002, 145177.35, 159509.0199999999, 1.782344183392843, 0.364717437075706, 1.0933706661452445], "isController": false}, {"data": ["Update Certification", 1483, 367, 24.747134187457856, 36079.97033041133, 121, 2110487, 302.0, 36193.4, 36461.6, 2082036.52, 0.5015935658026156, 0.07796342960541869, 0.3409268767564653], "isController": false}, {"data": ["Delete Language", 1494, 1, 0.06693440428380187, 8993.503346720214, 57, 2110192, 83.0, 618.0, 753.25, 6720.04999999924, 0.5053214338140539, 0.09817304760405259, 0.29262681667537055], "isController": false}, {"data": ["Edit Description", 1435, 0, 0.0, 2511.8202090592317, 177, 213768, 327.0, 2301.4000000000015, 4286.600000000006, 35743.0, 1.7102797946234047, 0.3674429246261221, 1.0004468720502142], "isController": false}, {"data": ["Disable/Enable Listings", 1433, 2, 0.13956734124214934, 33131.94347522679, 178, 2116050, 1337.0, 80237.8, 203689.3, 220068.2, 0.4851115113271676, 0.08995869104524096, 0.275243933672934], "isController": false}, {"data": ["SignIn", 1516, 4, 0.2638522427440633, 5910.267810026385, 208, 2101489, 283.0, 515.3, 860.049999999999, 1956.7799999999952, 0.5136811659613716, 0.24630345875828083, 0.1704427161425323], "isController": false}, {"data": ["Update Language", 1501, 2, 0.13324450366422386, 13211.220519653563, 237, 2110414, 328.0, 3858.3999999999996, 4072.8999999999996, 212154.3600000003, 0.5076238267328709, 0.1065844771990325, 0.3147806452521108], "isController": false}, {"data": ["Delete Certification", 1463, 0, 0.0, 11476.408065618594, 58, 2110161, 83.0, 1215.8000000000038, 2904.0, 62588.239999999845, 0.4949071583939704, 0.10052801654877525, 0.2890180475777288], "isController": false}, {"data": ["Search Skill by Catogory", 1414, 83, 5.86987270155587, 321407.57708628004, 994, 2196000, 10721.5, 2117874.5, 2123979.75, 2132890.1, 0.4685982813644362, 2.709840141892653, 0.34412686287700783], "isController": false}, {"data": ["Delete Skill", 1507, 10, 0.6635700066357001, 6214.38818845388, 57, 2110165, 82.0, 783.2, 994.1999999999998, 89838.4400000016, 0.5096553823260848, 0.09776854032094423, 0.30106422160877944], "isController": false}, {"data": ["Update Skill", 1512, 17, 1.1243386243386244, 23994.05886243386, 237, 2110381, 327.0, 64742.0, 191088.0, 216858.53, 0.5111826270932878, 0.10428430924588053, 0.33019952942123104], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 3, 0.33783783783783783, 0.010757700720765949], "isController": false}, {"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 421, 47.409909909909906, 1.509664001147488], "isController": false}, {"data": ["500/Internal Server Error", 464, 52.252252252252255, 1.6638577114784667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 27887, 888, "500/Internal Server Error", 464, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 421, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 3, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["Add Education", 1456, 1, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Listings", 1424, 7, "500/Internal Server Error", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 1440, 381, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 381, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Language", 1504, 2, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["View Listings", 1435, 2, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Skill", 1512, 9, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["Update Certification", 1483, 367, "500/Internal Server Error", 367, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Language", 1494, 1, "500/Internal Server Error", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Disable/Enable Listings", 1433, 2, "500/Internal Server Error", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SignIn", 1516, 4, "500/Internal Server Error", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Language", 1501, 2, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Search Skill by Catogory", 1414, 83, "500/Internal Server Error", 83, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Skill", 1507, 10, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Skill", 1512, 17, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 1, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
