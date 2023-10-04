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

    var data = {"OkPercent": 97.05263157894737, "KoPercent": 2.9473684210526314};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9257894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.94, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [1.0, 500, 1500, "Add Education"], "isController": false}, {"data": [0.995, 500, 1500, "Delete Listings"], "isController": false}, {"data": [0.985, 500, 1500, "Add Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.655, 500, 1500, "Update Education"], "isController": false}, {"data": [1.0, 500, 1500, "Add Language"], "isController": false}, {"data": [0.985, 500, 1500, "View Listings"], "isController": false}, {"data": [0.945, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.77, 500, 1500, "Update Certification"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.995, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.99, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.9, 500, 1500, "SignIn"], "isController": false}, {"data": [0.995, 500, 1500, "Update Language"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.485, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [1.0, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.95, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1900, 56, 2.9473684210526314, 241.2115789473686, 59, 4698, 165.0, 391.40000000000055, 958.7999999999993, 1112.8700000000001, 35.49676792586781, 20.729338896050518, 22.752742242087955], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 100, 0, 0.0, 201.45000000000002, 117, 657, 136.0, 571.6, 597.6499999999999, 656.7499999999999, 2.275519956310017, 0.4977699904428162, 2.9288430687662133], "isController": false}, {"data": ["Add Education", 100, 0, 0.0, 147.29000000000002, 92, 349, 153.0, 201.9, 230.0, 348.6899999999998, 2.26736803918012, 0.4583449063577, 1.510102541719572], "isController": false}, {"data": ["Delete Listings", 100, 0, 0.0, 279.7599999999999, 234, 544, 265.0, 329.70000000000005, 399.54999999999944, 543.4899999999998, 2.2949465277459034, 0.4392671088263644, 1.3155601677605913], "isController": false}, {"data": ["Add Certification", 100, 0, 0.0, 96.1, 60, 686, 70.0, 132.50000000000003, 168.6999999999997, 685.98, 2.273450643386532, 0.4595744952939572, 1.4719704849270223], "isController": false}, {"data": ["Delete Education", 100, 0, 0.0, 71.24000000000004, 59, 144, 67.5, 80.80000000000001, 108.84999999999997, 143.89999999999995, 2.279877798549998, 0.4853646094569331, 1.324733681774657], "isController": false}, {"data": ["Update Education", 100, 33, 33.0, 315.83, 145, 998, 330.0, 405.9, 462.9, 995.4099999999987, 2.2595295659443706, 0.4803044927921007, 1.5754922950041803], "isController": false}, {"data": ["Add Language", 100, 0, 0.0, 75.16999999999999, 59, 145, 70.0, 92.9, 127.89999999999998, 144.99, 2.272469037609363, 0.45937606521986135, 1.3559361152141802], "isController": false}, {"data": ["View Listings", 100, 0, 0.0, 153.41999999999996, 114, 647, 132.0, 177.20000000000005, 295.39999999999964, 646.8299999999999, 2.302290779325429, 2.9384110236560375, 1.3759784735812133], "isController": false}, {"data": ["Add Skill", 100, 0, 0.0, 134.86999999999998, 61, 607, 73.0, 559.8000000000002, 592.8499999999999, 606.9399999999999, 2.2137607367395735, 0.4475082739307536, 1.3598198275480387], "isController": false}, {"data": ["Update Certification", 100, 23, 23.0, 255.85000000000008, 122, 462, 263.0, 340.6, 357.9, 461.66999999999985, 2.2632627195364834, 0.35425366082744886, 1.538311379684954], "isController": false}, {"data": ["Delete Language", 100, 0, 0.0, 74.78999999999999, 60, 214, 69.0, 89.0, 128.89999999999998, 213.2399999999996, 2.273192243868064, 0.44176294582982883, 1.316409180286877], "isController": false}, {"data": ["Edit Description", 100, 0, 0.0, 216.96000000000006, 178, 509, 203.0, 265.30000000000007, 280.5999999999999, 507.9899999999995, 2.2978469174383602, 0.4936780486683977, 1.3441506870562283], "isController": false}, {"data": ["Disable/Enable Listings", 100, 0, 0.0, 213.87999999999994, 173, 646, 198.0, 244.8, 338.4499999999999, 644.6299999999993, 2.298005331372369, 0.4263877079694825, 1.3038487280540492], "isController": false}, {"data": ["SignIn", 100, 0, 0.0, 536.2599999999999, 216, 4698, 242.5, 820.6000000000018, 3322.099999999995, 4696.489999999999, 2.014829142488717, 0.9680624395551257, 0.6668612236057383], "isController": false}, {"data": ["Update Language", 100, 0, 0.0, 292.46000000000015, 237, 847, 270.5, 339.9, 418.6499999999999, 843.3599999999981, 2.262034020991676, 0.4749387837043069, 1.402726175126674], "isController": false}, {"data": ["Delete Certification", 100, 0, 0.0, 72.34000000000005, 60, 137, 69.0, 84.9, 92.79999999999995, 136.98, 2.2731405710129113, 0.46173167848699764, 1.3274785756501182], "isController": false}, {"data": ["Search Skill by Catogory", 100, 0, 0.0, 1036.3500000000004, 910, 1703, 997.0, 1099.6, 1436.8499999999992, 1702.79, 2.258917075154171, 13.86233876979376, 1.6588922270663444], "isController": false}, {"data": ["Delete Skill", 100, 0, 0.0, 73.17999999999999, 59, 217, 68.0, 82.9, 96.0, 216.28999999999962, 2.272623971637653, 0.4349944320712695, 1.342712405117949], "isController": false}, {"data": ["Update Skill", 100, 0, 0.0, 335.82000000000016, 237, 1113, 271.0, 599.2000000000007, 803.8499999999999, 1110.1599999999985, 2.228263291590534, 0.4504399427336334, 1.4405374013993493], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 33, 58.92857142857143, 1.736842105263158], "isController": false}, {"data": ["500/Internal Server Error", 23, 41.07142857142857, 1.2105263157894737], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1900, 56, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 33, "500/Internal Server Error", 23, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 100, 33, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 33, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Certification", 100, 23, "500/Internal Server Error", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
