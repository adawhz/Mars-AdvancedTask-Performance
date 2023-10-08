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

    var data = {"OkPercent": 93.47518795965611, "KoPercent": 6.5248120403438925};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5925901899058323, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1434330299089727, 500, 1500, "Add New Share Skill"], "isController": false}, {"data": [0.5127413127413127, 500, 1500, "Add Education"], "isController": false}, {"data": [0.09643676609528952, 500, 1500, "Delete Listings"], "isController": false}, {"data": [0.8962130937098844, 500, 1500, "Add Certification"], "isController": false}, {"data": [0.8735565070714935, 500, 1500, "Delete Education"], "isController": false}, {"data": [0.2565967305959583, 500, 1500, "Update Education"], "isController": false}, {"data": [0.8771750255885363, 500, 1500, "Add Language"], "isController": false}, {"data": [0.1623841059602649, 500, 1500, "View Listings"], "isController": false}, {"data": [0.8510882016036655, 500, 1500, "Add Skill"], "isController": false}, {"data": [0.5468609577609449, 500, 1500, "Update Certification"], "isController": false}, {"data": [0.888332691567193, 500, 1500, "Delete Language"], "isController": false}, {"data": [0.8043708609271523, 500, 1500, "Edit Description"], "isController": false}, {"data": [0.1296744686575195, 500, 1500, "Disable/Enable Listings"], "isController": false}, {"data": [0.8517412302999492, 500, 1500, "SignIn"], "isController": false}, {"data": [0.7608166922683052, 500, 1500, "Update Language"], "isController": false}, {"data": [0.8817211216876769, 500, 1500, "Delete Certification"], "isController": false}, {"data": [0.010357432981316004, 500, 1500, "Search Skill by Catogory"], "isController": false}, {"data": [0.8729864484786499, 500, 1500, "Delete Skill"], "isController": false}, {"data": [0.7483136057019218, 500, 1500, "Update Skill"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 146441, 9555, 6.5248120403438925, 6273.864723677158, 1, 434971, 1523.5, 38478.80000000022, 127896.55000000005, 225563.90000000002, 75.04691681451484, 42.4870513131199, 47.99974498911253], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["Add New Share Skill", 7690, 274, 3.5630689206762027, 16774.085045513686, 115, 375674, 3578.5, 10329.7, 166972.24999999994, 251612.59000000043, 3.9454876243033827, 0.8653240956419037, 5.078274110187362], "isController": false}, {"data": ["Add Education", 7770, 111, 1.4285714285714286, 2265.7325611325564, 3, 310971, 907.0, 1630.6000000000022, 3440.699999999999, 29400.489999999983, 4.31454534853697, 0.8758855455095689, 2.8735546168966923], "isController": false}, {"data": ["Delete Listings", 7409, 314, 4.238088810905655, 8600.852341746535, 6, 379462, 5384.0, 12228.0, 15134.0, 157210.39999999915, 3.8042375992585615, 0.7147717550505375, 2.1782944945033926], "isController": false}, {"data": ["Add Certification", 7790, 129, 1.65596919127086, 711.9241335044924, 3, 246078, 90.0, 618.0, 1413.949999999998, 8961.710000000003, 4.324959345937342, 0.8754711512997363, 2.8002422327699783], "isController": false}, {"data": ["Delete Education", 7707, 180, 2.3355391202802647, 1687.9392759828745, 1, 232282, 81.0, 882.0, 4159.799999999996, 29186.280000000002, 4.2793011640787455, 0.9111109414518086, 2.4854110592339236], "isController": false}, {"data": ["Update Education", 7769, 2844, 36.607027931522715, 7292.7335564422665, 3, 314906, 1126.0, 5786.0, 37182.5, 132469.10000000003, 4.303909527600364, 0.9009603174306396, 2.9998737217142177], "isController": false}, {"data": ["Add Language", 7816, 209, 2.6740020470829067, 1683.661847492322, 3, 311644, 92.0, 816.0, 4636.5999999999985, 33039.49, 4.338678967731908, 0.8785061860938567, 2.588801610629097], "isController": false}, {"data": ["View Listings", 7550, 319, 4.225165562913907, 9707.996556291413, 115, 366272, 2680.0, 8313.200000000004, 15026.0, 218551.45999999956, 3.8756964061770898, 4.7655314763656955, 2.3116640142102023], "isController": false}, {"data": ["Add Skill", 7857, 374, 4.760086547028128, 9606.967799414522, 6, 306932, 97.0, 3501.7999999999993, 108003.79999999996, 198419.74000000008, 4.3932682404225405, 1.0736504229925554, 2.636775757436181], "isController": false}, {"data": ["Update Certification", 7789, 2291, 29.41327513159584, 3215.84722043908, 4, 315274, 313.0, 2553.0, 8579.5, 96933.80000000053, 4.315383686309446, 0.658161349413387, 2.9318706385274727], "isController": false}, {"data": ["Delete Language", 7791, 315, 4.0431266846361185, 781.9265819535353, 4, 246071, 84.0, 607.0, 1931.9999999999964, 7979.039999999992, 4.325593790599288, 0.8255887807513574, 2.5030132825599343], "isController": false}, {"data": ["Edit Description", 7550, 173, 2.2913907284768213, 4060.603311258273, 4, 313883, 279.0, 1946.6000000000022, 7616.9, 121133.78999999996, 4.2104042155347745, 0.917965820057083, 2.462921997173174], "isController": false}, {"data": ["Disable/Enable Listings", 7434, 290, 3.900995426419155, 8542.10034974439, 11, 428446, 3867.0, 10043.5, 12966.25, 174145.9499999993, 3.8169761477499407, 0.6967405888099034, 2.1632317363159554], "isController": false}, {"data": ["SignIn", 7868, 11, 0.13980681240467718, 860.214412811388, 206, 58415, 339.0, 900.1000000000004, 1898.6499999999978, 9294.099999999995, 4.42175742940109, 2.122216156702913, 1.4672132840428396], "isController": false}, {"data": ["Update Language", 7812, 473, 6.05478750640041, 2303.8819764464934, 3, 314946, 338.0, 2360.399999999998, 6523.349999999999, 23553.48, 4.32599099914776, 0.9105744768053897, 2.680338183668], "isController": false}, {"data": ["Delete Certification", 7774, 205, 2.6369951119115, 1334.636480576278, 4, 308696, 82.0, 734.0, 3042.25, 27384.25, 4.316589106137341, 0.8660246039401786, 2.519576137109451], "isController": false}, {"data": ["Search Skill by Catogory", 7386, 86, 1.164365014893041, 30460.730706742554, 933, 434971, 24384.5, 36433.0, 51467.899999999994, 212414.21, 3.7913047406195237, 23.000052943073452, 2.7842394188924624], "isController": false}, {"data": ["Delete Skill", 7822, 429, 5.48453081053439, 1403.096266939403, 2, 258181, 85.0, 802.7999999999993, 3456.0999999999967, 21026.0, 4.341539631396514, 0.8481851552938532, 2.5616143392015163], "isController": false}, {"data": ["Update Skill", 7857, 528, 6.72012218403971, 9530.566628484157, 3, 316879, 347.0, 5045.399999999998, 95785.09999999973, 172607.60000000006, 4.35259028148634, 0.9007878734768426, 2.810229909779451], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 181, 1.8942961800104656, 0.12359926523309729], "isController": false}, {"data": ["Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 5622, 58.838304552590266, 3.8390887797816187], "isController": false}, {"data": ["500/Internal Server Error", 3752, 39.26739926739927, 2.562123995329177], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 146441, 9555, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 5622, "500/Internal Server Error", 3752, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 181, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["Add New Share Skill", 7690, 274, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 274, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Education", 7770, 111, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 111, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Listings", 7409, 314, "500/Internal Server Error", 314, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Certification", 7790, 129, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 129, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Education", 7707, 180, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 180, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Education", 7769, 2844, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 2604, "500/Internal Server Error", 240, "", "", "", "", "", ""], "isController": false}, {"data": ["Add Language", 7816, 209, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 209, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["View Listings", 7550, 319, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 319, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Add Skill", 7857, 374, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 194, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 180, "", "", "", "", "", ""], "isController": false}, {"data": ["Update Certification", 7789, 2291, "500/Internal Server Error", 2291, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Language", 7791, 315, "500/Internal Server Error", 315, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Edit Description", 7550, 173, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 173, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Disable/Enable Listings", 7434, 290, "500/Internal Server Error", 290, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["SignIn", 7868, 11, "500/Internal Server Error", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Language", 7812, 473, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 472, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: localhost:60190 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Certification", 7774, 205, "500/Internal Server Error", 205, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Search Skill by Catogory", 7386, 86, "500/Internal Server Error", 86, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Delete Skill", 7822, 429, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 429, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update Skill", 7857, 528, "Value in json path 'success' expected to match regexp 'true', but it did not match: 'false'", 528, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
