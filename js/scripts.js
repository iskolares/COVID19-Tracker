var settings = {
"url": "https://api.covid19api.com/summary",
"method": "GET",
"timeout": 0,
};

$.ajax(settings).done(function (response) {

    var CountryArr = response.Countries;
    var ToDelete = ["Taiwan*", "Iran (Islamic Republic of)", "", "Viet Nam", "Republic of Korea", "Korea, South", "Russian Federation", "Cruise Ship"];

    for (var i = 0; i < CountryArr.length; i++) {
        var obj = CountryArr[i];
    
        if (ToDelete.indexOf(obj.Country) !== -1) {
            CountryArr.splice(i, 1);
            i--;
        }
    }

      //Get the alignment score count from the alignment array
    var getIndexConfirmed = CountryArr.map(function(obj) { return obj.TotalConfirmed;});
    var getIndexRecovered = CountryArr.map(function(obj) { return obj.TotalRecovered;});
    var getIndexDeaths = CountryArr.map(function(obj) { return obj.TotalDeaths;});
 

    var mostConfirmed = CountryArr[getIndexConfirmed.indexOf(Math.max.apply(null,getIndexConfirmed))].Country;
    var mostRecovered = CountryArr[getIndexRecovered.indexOf(Math.max.apply(null,getIndexRecovered))].Country;
    var mostDeaths = CountryArr[getIndexDeaths.indexOf(Math.max.apply(null,getIndexDeaths))].Country;

    document.getElementById('most-cases').innerHTML = (mostConfirmed);
    document.getElementById('most-recovered').innerHTML = (mostRecovered);
    document.getElementById('most-deaths').innerHTML = (mostDeaths);

    var TotalConf = CountryArr.reduce(function(running, cur) {
        return running + cur.TotalConfirmed;
    }, 0);
    var TotalRec = CountryArr.reduce(function(running, cur) {
        return running + cur.TotalRecovered;
    }, 0);
    var TotalDeath = CountryArr.reduce(function(running, cur) {
        return running + cur.TotalDeaths;
    }, 0);            

    function commaSeparator(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
        val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }

    document.getElementById('total-covid-cases').innerHTML = (commaSeparator(TotalConf));
    document.getElementById('total-covid-rec').innerHTML = (commaSeparator(TotalRec));
    document.getElementById('total-covid-death').innerHTML = (commaSeparator(TotalDeath));

    function format(d){
        // `d` is the original data object for the row
        return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
            '<tr>'+
                '<td class="table-warning">New Confirmed Cases:</td>'+
                '<td class="table-warning font-weight-bold">+'+d.NewConfirmed+'</td>'+
                '<td class="table-success">New Recoveries:</td>'+
                '<td class="table-success font-weight-bold">+'+d.NewRecovered+'</td>'+
                '<td class="table-danger">New Deaths:</td>'+
                '<td class="table-danger font-weight-bold">+'+d.NewDeaths+'</td>'+
            '</tr>'+
        '</table>';
    }
    var table = $('#dataTable').DataTable({
        "order": [[2, "desc"]],
        "aoColumnDefs": [
            { "sClass": "death-column", "aTargets":[4]},
            { "sClass": "recovered-column", "aTargets":[3]},
            { "sClass": "total-column", "aTargets":[2]},
            { "sClass": "country-column", "aTargets":[1]}
        ],
        "processing": true,
        "pageLength": 25,
        data: CountryArr,   
        columns: [
            {
             "className": 'details-control',
             "orderable": false,
             "data": null,
             "defaultContent": '',
             "render": function (){
                 return '<i class="fa fa-plus-square" aria-hidden="true"></i>';
            },
             width:"15px"
            },
            { "data": "Country" },
            { "data": "TotalConfirmed" },  
            { "data": "TotalRecovered" },
            { "data": "TotalDeaths" },
        ]
    });
    
    // Add event listener for opening and closing details
    $('#dataTable tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = table.row(tr);
    
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
     });
    
});


