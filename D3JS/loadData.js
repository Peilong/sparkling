/**
 * Created by pli on 7/22/14.
 */
/**
 * Function Name: firstFunction()
 * Arguments: myjson
 * Purpose: Load JSON data after 500 ms of loading page.
 * TODO: find a way to load data without waiting.
 */
function firstFunction( myjson ){
    if( myjson == ""){
        loadData();
    } else{
        loadData( myjson );
    }
    setTimeout(function(){
        radioOne();
    }, 500);
}


/**
 * Function Name: loadData()
 * Arguments: jsonData
 * Purpose: 1. Load default web view data from default directory if no data is uploaded.
 *          2. Parse the data if there is a uploaded JSON data file.
 */
function loadData(jsonData){
    if (jsonData == undefined){
        $.ajax({
            url : "data/webView-default.txt",
            dataType: "json",
            success : function (localdata) {
                webData = localdata;
                loaded = true;
            }
        });
    }
    else{
        webData = JSON.parse(jsonData);
    }
}