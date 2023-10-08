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

    var data = {"OkPercent": 97.71929824561404, "KoPercent": 2.280701754385965};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9481578947368421, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [0.9983333333333333, 500, 1500, "Add Education"], "isController": false}, {"data": [0.995, 500, 1500, "Delete Listings"], "isController": false}, {"data": [1.0, 500, 1500, "Add Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.77, 500, 1500, "Update Education"], "isController": false}, {"data": [1.0, 500, 1500, "Add Language"], "isController": false}, {"data": [1.0, 500, 1500, "View Listings"], "isController": false}, {"data": [1.0, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.7766666666666666, 500, 1500, "Update Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Language"], "isController": false}, {"data": [1.0, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.9966666666666667, 500, 1500, "SignIn"], "isController": false}, {"data": [0.9883333333333333, 500, 1500, "Update Language"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.5, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.9933333333333333, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5700, 130, 2.280701754385965, 205.36087719298246, 57, 1370, 152.0, 325.90000000000055, 921.9499999999998, 1032.9799999999996, 46.198735613551634, 26.98131059784811, 29.61420636448371], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 300, 0, 0.0, 136.11000000000016, 117, 420, 130.0, 149.0, 164.89999999999998, 263.9000000000001, 2.514458134272064, 0.5500377168720141, 3.236382637666583], "isController": false}, {"data": ["Add Education", 300, 0, 0.0, 145.65000000000006, 88, 550, 151.0, 184.80000000000007, 209.95, 380.4300000000005, 2.5135732957973054, 0.5081149142871506, 1.6740790895837523], "isController": false}, {"data": ["Delete Listings", 300, 0, 0.0, 267.4133333333332, 231, 753, 253.0, 301.50000000000017, 376.2999999999996, 521.7600000000002, 2.5115110925073254, 0.4807189200502302, 1.4397041125994139], "isController": false}, {"data": ["Add Certification", 300, 0, 0.0, 71.98000000000005, 58, 275, 67.0, 79.0, 89.94999999999999, 193.9000000000001, 2.511553144464537, 0.507706543851718, 1.626132553496082], "isController": false}, {"data": ["Delete Education", 300, 0, 0.0, 68.7666666666667, 57, 222, 65.0, 75.0, 86.94999999999999, 136.8900000000001, 2.51563888842303, 0.535555935230684, 1.4617237681754909], "isController": false}, {"data": ["Update Education", 300, 65, 21.666666666666668, 307.5133333333331, 150, 807, 314.5, 381.0, 425.6499999999999, 617.8600000000001, 2.5095152453051153, 0.5337212843489899, 1.7497987159646995], "isController": false}, {"data": ["Add Language", 300, 0, 0.0, 71.80999999999997, 59, 200, 67.0, 79.0, 97.0, 190.82000000000016, 2.512184092850324, 0.5078340890820479, 1.4989692194644022], "isController": false}, {"data": ["View Listings", 300, 0, 0.0, 134.50666666666686, 115, 407, 126.0, 142.0, 184.79999999999995, 387.3400000000006, 2.5142474019443513, 3.208890090722427, 1.502655673818304], "isController": false}, {"data": ["Add Skill", 300, 0, 0.0, 75.4266666666666, 60, 358, 69.0, 82.0, 105.5499999999999, 243.69000000000028, 2.5113218761248626, 0.5076597933182095, 1.5425990821118543], "isController": false}, {"data": ["Update Certification", 300, 65, 21.666666666666668, 243.76999999999995, 117, 572, 256.0, 286.0, 342.95, 528.7400000000002, 2.5077112119768286, 0.3946053384992184, 1.7044599643905007], "isController": false}, {"data": ["Delete Language", 300, 0, 0.0, 68.57666666666664, 57, 269, 65.0, 74.0, 81.89999999999998, 122.97000000000003, 2.512899551028614, 0.4883466900924747, 1.4552240564062187], "isController": false}, {"data": ["Edit Description", 300, 0, 0.0, 205.1333333333333, 177, 462, 196.5, 228.80000000000007, 266.95, 388.96000000000004, 2.5126890798532586, 0.5398355444997236, 1.4698249597969746], "isController": false}, {"data": ["Disable/Enable Listings", 300, 0, 0.0, 195.9966666666667, 169, 634, 188.0, 208.0, 239.69999999999993, 484.0900000000008, 2.5128364059738497, 0.46624894251467913, 1.4257401873738347], "isController": false}, {"data": ["SignIn", 300, 0, 0.0, 236.71666666666667, 202, 532, 222.0, 282.0, 328.9, 489.73000000000025, 2.5064122379754874, 1.204252754964785, 0.8313260278378852], "isController": false}, {"data": ["Update Language", 300, 0, 0.0, 272.6066666666666, 232, 610, 259.0, 300.90000000000003, 364.4499999999999, 555.95, 2.5086968156275087, 0.5267283353124164, 1.5556860135971367], "isController": false}, {"data": ["Delete Certification", 300, 0, 0.0, 68.58333333333327, 58, 257, 66.0, 73.0, 78.0, 173.63000000000034, 2.513657539296846, 0.5105866876696719, 1.4679367270503068], "isController": false}, {"data": ["Search Skill by Catogory", 300, 0, 0.0, 992.2266666666665, 909, 1370, 966.0, 1110.8000000000002, 1166.95, 1281.99, 2.4955703626063737, 15.314613436150832, 1.8326844850390558], "isController": false}, {"data": ["Delete Skill", 300, 0, 0.0, 68.02000000000001, 57, 260, 65.0, 73.0, 80.0, 115.98000000000002, 2.512078912772247, 0.4808276043978128, 1.484187248268759], "isController": false}, {"data": ["Update Skill", 300, 0, 0.0, 271.0499999999999, 233, 681, 259.0, 298.8000000000004, 351.74999999999994, 550.98, 2.5077531367812154, 0.5069383782360464, 1.6212232192862934], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 65, 50.0, 1.1403508771929824], "isController": false}, {"data": ["500/Internal Server Error", 65, 50.0, 1.1403508771929824], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5700, 130, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 65, "500/Internal Server Error", 65, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 300, 65, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Certification", 300, 65, "500/Internal Server Error", 65, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
