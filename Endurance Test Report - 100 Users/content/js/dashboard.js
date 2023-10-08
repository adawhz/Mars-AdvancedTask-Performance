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

    var data = {"OkPercent": 96.64883860555553, "KoPercent": 3.351161394444475};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8059945248941057, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7944566698103321, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [0.3739671582470453, 500, 1500, "Add Education"], "isController": false}, {"data": [0.8002935318167523, 500, 1500, "Delete Listings"], "isController": false}, {"data": [0.9982223151730628, 500, 1500, "Add Certification"], "isController": false}, {"data": [0.9966471081307627, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.15281557462842787, 500, 1500, "Update Education"], "isController": false}, {"data": [0.9981181390486148, 500, 1500, "Add Language"], "isController": false}, {"data": [0.9281970649895178, 500, 1500, "View Listings"], "isController": false}, {"data": [0.9896007525083612, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.7176322944990587, 500, 1500, "Update Certification"], "isController": false}, {"data": [0.9968632371392723, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.9637392580171872, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.84958071278826, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.8851499634235552, 500, 1500, "SignIn"], "isController": false}, {"data": [0.9418191322530057, 500, 1500, "Update Language"], "isController": false}, {"data": [0.9959209287731409, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.0014156879194630872, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [0.9974908520648197, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.9297658862876255, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 181549, 6084, 3.351161394444475, 981.5508595475537, 56, 67163, 224.0, 1614.0, 9643.900000000001, 12963.970000000005, 100.62905282901946, 58.68912953242013, 64.49931485312815], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 9543, 0, 0.0, 638.8908100178134, 114, 24798, 235.0, 1717.0, 2661.199999999997, 4593.6799999999985, 5.3090255659928625, 1.1613493425609385, 6.833296578104094], "isController": false}, {"data": ["Add Education", 9561, 0, 0.0, 1326.8111076247314, 106, 33536, 1289.0, 1786.0, 1951.0, 2403.7599999999984, 5.314660592133569, 1.0743503345426255, 3.5396469959327086], "isController": false}, {"data": ["Delete Listings", 9539, 0, 0.0, 627.7010168780779, 232, 24993, 402.0, 1015.0, 1539.0, 3671.2000000000007, 5.310043882037868, 1.0163755867963107, 3.0439411706603794], "isController": false}, {"data": ["Add Certification", 9563, 0, 0.0, 108.45059081878061, 58, 32203, 78.0, 155.0, 202.0, 364.08000000000175, 5.313867120537488, 1.0741899354992772, 3.4405213876136274], "isController": false}, {"data": ["Delete Education", 9544, 0, 0.0, 106.98931265716664, 56, 28404, 76.0, 163.0, 209.0, 368.5499999999993, 5.309413527878315, 1.1303243643334695, 3.0850596182496073], "isController": false}, {"data": ["Update Education", 9554, 3604, 37.72241992882562, 1550.9258949131251, 209, 32892, 1467.0, 2006.0, 2187.0, 2863.4500000000007, 5.3130317758672465, 1.1291374247867336, 3.7045944218449356], "isController": false}, {"data": ["Add Language", 9565, 0, 0.0, 102.01212754835275, 58, 3372, 78.0, 162.0, 215.0, 358.0, 5.387060129503461, 1.0889857878976723, 3.214349354615835], "isController": false}, {"data": ["View Listings", 9540, 0, 0.0, 309.4343815513626, 113, 9170, 199.0, 560.8999999999996, 802.0, 1785.0, 5.3840449415373985, 6.871436297690279, 3.217808109590711], "isController": false}, {"data": ["Add Skill", 9568, 0, 0.0, 248.88137541805946, 60, 32448, 86.0, 193.0, 263.0, 778.7899999999954, 5.38496779037347, 1.0885628248118244, 3.307758535297766], "isController": false}, {"data": ["Update Certification", 9562, 2352, 24.597364568081993, 325.7914662204562, 116, 32424, 280.5, 451.0, 561.0, 984.850000000004, 5.313462030029229, 0.8263766319780171, 3.611493723535492], "isController": false}, {"data": ["Delete Language", 9564, 10, 0.10455876202425764, 111.64910079464649, 56, 28673, 75.0, 152.0, 196.0, 343.0, 5.31420427236686, 1.0322633605229747, 3.0774639975718245], "isController": false}, {"data": ["Edit Description", 9542, 0, 0.0, 306.3822049884724, 173, 24960, 230.0, 432.0, 563.0, 837.0, 5.3098635361732365, 1.140790994099719, 3.1060627521169617], "isController": false}, {"data": ["Disable/Enable Listings", 9540, 0, 0.0, 487.04779874213983, 171, 24853, 296.0, 893.8999999999996, 1300.949999999999, 2833.3100000000013, 5.309965034381189, 0.9852474184886971, 3.012782895483858], "isController": false}, {"data": ["SignIn", 9569, 0, 0.0, 1157.995610826628, 217, 67163, 333.0, 668.0, 951.5, 31506.0, 5.308310843233138, 2.550477475459672, 1.7613711813058035], "isController": false}, {"data": ["Update Language", 9565, 40, 0.4181913225300575, 382.57574490329245, 120, 31251, 297.0, 508.0, 649.0, 1095.380000000001, 5.314015834822721, 1.1158442561058401, 3.29531255382073], "isController": false}, {"data": ["Delete Certification", 9561, 27, 0.2823972387825541, 94.45905240037652, 56, 1459, 75.0, 145.0, 190.0, 351.7599999999984, 5.390490613013967, 1.0935014215156744, 3.1479622915843284], "isController": false}, {"data": ["Search Skill by Catogory", 9536, 0, 0.0, 10218.653104026844, 1108, 35241, 10402.5, 12376.0, 12997.599999999999, 14896.599999999984, 5.305603543003708, 32.558996742417285, 3.896302601893348], "isController": false}, {"data": ["Delete Skill", 9565, 7, 0.07318348144276006, 98.53382122320942, 57, 2273, 76.0, 158.0, 206.0, 348.0, 5.387108674286905, 1.0314073249400884, 3.18281323041365], "isController": false}, {"data": ["Update Skill", 9568, 44, 0.459866220735786, 466.21153846153726, 117, 32348, 300.0, 545.0, 702.0, 1621.0, 5.311975874035998, 1.0754059382482806, 3.4341094029412402], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 3695, 60.733070348454966, 2.0352632071782275], "isController": false}, {"data": ["500/Internal Server Error", 2389, 39.266929651545034, 1.3158981872662476], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 181549, 6084, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 3695, "500/Internal Server Error", 2389, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Education", 9554, 3604, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 3604, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Certification", 9562, 2352, "500/Internal Server Error", 2352, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Language", 9564, 10, "500/Internal Server Error", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["Update Language", 9565, 40, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 40, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Certification", 9561, 27, "500/Internal Server Error", 27, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["Delete Skill", 9565, 7, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Skill", 9568, 44, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 44, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
