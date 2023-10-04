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

    var data = {"OkPercent": 97.29473684210527, "KoPercent": 2.705263157894737};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9434210526315789, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.991, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [1.0, 500, 1500, "Add Education"], "isController": false}, {"data": [0.996, 500, 1500, "Delete Listings"], "isController": false}, {"data": [0.999, 500, 1500, "Add Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.727, 500, 1500, "Update Education"], "isController": false}, {"data": [0.997, 500, 1500, "Add Language"], "isController": false}, {"data": [0.992, 500, 1500, "View Listings"], "isController": false}, {"data": [0.997, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.753, 500, 1500, "Update Certification"], "isController": false}, {"data": [0.999, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.998, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.998, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.992, 500, 1500, "SignIn"], "isController": false}, {"data": [0.993, 500, 1500, "Update Language"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.5, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.993, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 9500, 257, 2.705263157894737, 203.30347368421067, 56, 1670, 144.0, 295.0, 935.9499999999989, 1028.0, 91.95802841987067, 53.69746708568068, 58.94740273018546], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 500, 0, 0.0, 144.3840000000001, 117, 680, 132.0, 155.90000000000003, 178.84999999999997, 600.8200000000002, 5.059704513256426, 1.1068103622748433, 6.512393113742158], "isController": false}, {"data": ["Add Education", 500, 0, 0.0, 124.54800000000019, 83, 275, 106.0, 169.0, 186.95, 209.97000000000003, 5.014341015303769, 1.0136412013358205, 3.3396294652706744], "isController": false}, {"data": ["Delete Listings", 500, 0, 0.0, 264.2580000000003, 233, 686, 256.0, 289.0, 310.84999999999997, 378.94000000000005, 5.078823338209004, 0.9721185295790672, 2.9113958003209817], "isController": false}, {"data": ["Add Certification", 500, 0, 0.0, 71.26400000000001, 58, 537, 67.0, 79.0, 85.0, 137.91000000000008, 5.021391126197602, 1.0150663702372105, 3.25115460612208], "isController": false}, {"data": ["Delete Education", 500, 0, 0.0, 67.51600000000006, 57, 176, 65.0, 76.0, 80.0, 104.98000000000002, 5.062932247840659, 1.0778508105754527, 2.9418405151027267], "isController": false}, {"data": ["Update Education", 500, 135, 27.0, 285.9139999999999, 143, 1016, 290.5, 367.0, 388.95, 562.2400000000007, 5.014341015303769, 1.0661840520137593, 3.496327621998917], "isController": false}, {"data": ["Add Language", 500, 0, 0.0, 73.50199999999997, 58, 538, 67.0, 79.0, 91.94999999999999, 151.8800000000001, 5.019878719730132, 1.0147606396329465, 2.9952596657764747], "isController": false}, {"data": ["View Listings", 500, 0, 0.0, 139.24799999999996, 114, 645, 128.0, 148.90000000000003, 169.89999999999998, 578.96, 5.085538761976443, 6.490597633444537, 3.039404025712484], "isController": false}, {"data": ["Add Skill", 500, 0, 0.0, 74.85600000000001, 59, 537, 70.0, 81.0, 93.89999999999998, 144.92000000000007, 5.017662170841362, 1.0143125677384393, 3.082138188925016], "isController": false}, {"data": ["Update Certification", 500, 122, 24.4, 235.31600000000012, 116, 747, 254.0, 284.90000000000003, 307.95, 380.98, 5.013637092892668, 0.7803647797007862, 3.4077064615754855], "isController": false}, {"data": ["Delete Language", 500, 0, 0.0, 68.46000000000008, 56, 533, 65.0, 76.0, 83.0, 115.97000000000003, 5.0211389951696646, 0.9757877539441048, 2.907749437632433], "isController": false}, {"data": ["Edit Description", 500, 0, 0.0, 203.0100000000001, 171, 680, 196.0, 220.90000000000003, 243.79999999999995, 332.5700000000004, 5.0817656086430665, 1.091785579981909, 2.9726343745871064], "isController": false}, {"data": ["Disable/Enable Listings", 500, 0, 0.0, 198.25400000000005, 170, 1670, 191.0, 215.0, 229.89999999999998, 293.93000000000006, 5.082540457022038, 0.9430494988615109, 2.883746099150199], "isController": false}, {"data": ["SignIn", 500, 0, 0.0, 239.06999999999994, 205, 966, 225.0, 264.0, 288.95, 576.7100000000003, 5.007009813739234, 2.405711746445023, 1.6614275610855198], "isController": false}, {"data": ["Update Language", 500, 0, 0.0, 268.8419999999998, 232, 743, 259.0, 287.90000000000003, 324.95, 686.7000000000003, 5.0106727329211225, 1.0520455445098058, 3.107204282621985], "isController": false}, {"data": ["Delete Certification", 500, 0, 0.0, 68.40200000000009, 57, 354, 66.0, 74.0, 82.0, 131.99, 5.017309718528925, 1.019141036576188, 2.93003048015654], "isController": false}, {"data": ["Search Skill by Catogory", 500, 0, 0.0, 1000.246, 910, 1479, 981.5, 1064.9, 1113.9, 1360.6700000000003, 5.039103442715472, 30.923560580101586, 3.7005915907441747], "isController": false}, {"data": ["Delete Skill", 500, 0, 0.0, 67.19600000000004, 57, 145, 65.0, 74.0, 82.0, 118.95000000000005, 5.019072475406545, 0.9606818409957839, 2.9653699683798433], "isController": false}, {"data": ["Update Skill", 500, 0, 0.0, 268.47999999999996, 229, 740, 259.0, 290.60000000000014, 312.9, 661.9100000000001, 5.0085646455438795, 1.0124735172144368, 3.237958784521532], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 135, 52.52918287937743, 1.4210526315789473], "isController": false}, {"data": ["500/Internal Server Error", 122, 47.47081712062257, 1.2842105263157895], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 9500, 257, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 135, "500/Internal Server Error", 122, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 500, 135, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 135, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Certification", 500, 122, "500/Internal Server Error", 122, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
