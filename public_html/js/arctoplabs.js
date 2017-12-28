/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var appName = "demo-prod";
var url = 'https://api.masterdatanode.com/' + appName + '/registration/';
var access_token =  '######access_token###########';
var content_type = 'application/json';
var itemsPerPage = 3;


var html5datatable = {}

html5datatable.showData = function () {
    itemsPerPage = localStorage.getItem("perPage");
    if (itemsPerPage == null) {
        itemsPerPage = 3;
    }
    console.log("=====" + itemsPerPage);
    $("#perPage").val(itemsPerPage);
    html5datatable.data(0, itemsPerPage);

};

html5datatable.data = function (skip, limit) {

    var SendInfo = {"sort": {
            "created_date": "desc"
        }, "limit": limit, "skip": skip};
//                    alert("canvas clear");
    $.ajax({
        url: url + 'find',
        async: false,
        type: 'post',
        cache: false,
//                        data: {},
        data: JSON.stringify(SendInfo),
        headers: {
            "access_token": access_token,
            "Content-Type": 'application/json'
        },
        dataType: 'json',
        success: function (data) {

            //$("#test_div").html(JSON.stringify(data));
            console.info(JSON.stringify(data));

            console.info(data.DataCount);
            var dataCount = data.DataCount;

            var identifier, todo;
            var count = 1;
            $.each(data.result, function (k, jsonObject) {
                identifier = jsonObject.identifier;
//                todo = jsonObject.name;
//                jsonObject.email;
//                jsonObject.username;
//                jsonObject.password;
//                jsonObject.confirm;
//                count++;
                var markup = "<tr>" +
//                        "<td><input class='checkthis' type='checkbox'></td>"+
                        "<td>" + jsonObject.phone +
                        "</td><td>" + jsonObject.fname +
                        "</td><td>" + jsonObject.lname +
                        "</td><td>" + jsonObject.email + "</td><td>" + jsonObject.location +
                        "</td><td>" + jsonObject.company + "</td><td>" + jsonObject.custom +
                        "</td></tr>";
                $("table tbody").append(markup);
                count++;
            });

            console.log(parseInt(dataCount / limit));
            var paginationCount = parseInt(dataCount / limit);
            var modulus = dataCount % limit;
            if (modulus !== 0) {
                paginationCount = paginationCount + 1;
            }
            if (paginationCount === 0) {
                console.log("----------");
                $("#pagination ul").append("<li><a href='#' class='active'>1</a></li>");
            } else {
                console.log("------111----" + paginationCount);
                for (i = 0; i < paginationCount; i++) {
                    if (i === skip) {
                        $("#pagination ul").append("<li><a href='#' class='active'>" + (i + 1) + "</a></li>");
                    } else {
                        $("#pagination ul").append("<li><a href='#' class='pageCall' id='" + (i + 1) + "'>" + (i + 1) + "</a></li>");
                    }
                    if ((i + 1) === 4) {
                        $("#pagination ul").append("<li><a href='#'><span class='glyphicon glyphicon-chevron-right'></span></a></li>");
                        break;
                    }

                }
            }


//            console.info(JSON.stringify(obj.result));
        },
        error: function (xhr, thrownError) {
            console.info("readyState: " + xhr.readyState + "\nstatus: " + xhr.status + "\nresponseText: " + xhr.responseText);
//            alert(thrownError);
        },
        timeout: 5000
    });

};

html5datatable.add = function (data) {

    data.push($('#phone').val());
    data.push($('#fname').val());
    data.push($('#lname').val());
    data.push($('#email').val());
    data.push($('#location').val());
    data.push($('#company').val());
    data.push($('#custom').val());
    console.log(data);

    var SendInfo = {"Data": [{"phone": data[0], "fname": data[1], "lname": data[2], "email": data[3], "location": data[4], "company": data[5], "custom": data[6]}]};
    console.log(JSON.stringify(SendInfo));

    $.ajax({
        url: url + 'save',
        type: 'post',
        async: false,
        data: JSON.stringify(SendInfo),
        headers: {
            "access_token": access_token,
            "Content-Type": content_type
        },
        dataType: 'json',
        success: function (data) {
//            $("#test_div").show();
            var result = $.parseJSON(JSON.stringify(data));
            console.info(JSON.stringify(result));
//            $("#test_div").html(JSON.stringify(result.description));
            html5datatable.showMessage('#9BED87', 'black', 'Data saved successfully :)');
            html5datatable.restData();
        }
    });
};

html5datatable.restData = function () {
    $('#phone').val("");
    $('#fname').val("");
    $('#lname').val("");
    $('#email').val("");
    $('#location').val("");
    $('#company').val("");
    $('#custom').val("");
   
};

// share note
html5datatable.showMessage = function (bgcolor, color, msg) {
    if (!$('#smsg').is(':visible'))
    {
        $('html, body').animate({
            scrollTop: 0
        }, 500, function () {
            if (!$('#smsg').length)
            {
                $('<div id="smsg">' + msg + '</div>').appendTo($('body')).css({
                    position: 'absolute',
                    top: 0,
                    left: 3,
                    width: '98%',
                    height: '50px',
                    lineHeight: '30px',
                    background: bgcolor,
                    color: color,
                    zIndex: 1000,
                    padding: '10px',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    opacity: 0.9,
                    margin: 'auto',
                    display: 'none'
                }).slideDown('show');
                setTimeout(function () {
                    $('#smsg').animate({'width': 'hide'}, function () {
                        $('#smsg').remove();
                    });
                }, 4000);
            }
        });
    }
};


$(document).ready(function () {


    $("#mytable #checkall").click(function () {
        if ($("#mytable #checkall").is(':checked')) {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", true);
            });
        } else {
            $("#mytable input[type=checkbox]").each(function () {
                $(this).prop("checked", false);
            });
        }
    });


    $('.modal').on('show.bs.modal', function (e) {
        var $trigger = $(e.relatedTarget);
        console.log("--------------" + $trigger);
        var action = $trigger.data('target');
        console.log("--------------" + action);
        if (action == "#add") {
            $('#nameNew').val("");
            $('#emailNew').val("");
            $('#usernameNew').val("");
            $('#ageNew').val("");
            $('#addressNew').val("");

            console.log($trigger.data('whatever'));
//            html5datatable.filter($trigger.data('whatever'));
        } else if (action == "#edit") {
            $('#nameUpdate').val("");
            $('#emailUpdate').val("");
            $('#usernameUpdate').val("");
            $('#ageUpdate').val("");
            $('#addressUpdate').val("");

            console.log($trigger.data('whatever'));
            html5datatable.filter($trigger.data('whatever'));
        } else {
            console.log($trigger.data('whatever'));
            html5datatable.filterDel($trigger.data('whatever'));
        }

        console.log("--------------");
    });

    $('#myform').on('submit', function (e) {
        e.preventDefault();
        var data = [];
        data.push($('#phone').val());
        data.push($('#fname').val());
        data.push($('#lname').val());
        data.push($('#email').val());
        data.push($('#location').val());
        data.push($('#company').val());
        data.push($('#custom').val());
        html5datatable.add(data);

        $("#mytable").find("tr:gt(0)").remove();
        $('#pagination ul').empty()
        var page = 1;
        console.log("--------------" + page);
        offset = (page - 1) * itemsPerPage;
        html5datatable.data(offset, itemsPerPage);
//        return false;
    });

    $("#perPage").click(function (e) {
        var page = 1;
        $("#mytable").find("tr:gt(0)").remove();
        $('#pagination ul').empty()
        console.log("--------------" + page);
        itemsPerPage = $("#perPage").val();
        localStorage.setItem("perPage", itemsPerPage);
        offset = (page - 1) * itemsPerPage;
        html5datatable.data(offset, itemsPerPage);
//        return false;
    });

//    $('.pageCall').click(function () {
//        console.log("--------");
//       
//    });

//    This is only call because data created dynamically
    $(document).on("click", ".pageCall", function (e) {
        console.log("log something");
        var page = e.target.id;

        $("#mytable").find("tr:gt(0)").remove();
        $('#pagination ul').empty()
        console.log("--------------" + page);
        offset = (page - 1) * itemsPerPage;
        html5datatable.data(offset, itemsPerPage);
        return false;
    });

//    $('.btn-xs').click(function () {
//        console.log("--------------");
//
//
//    });

//    $('.btn-primary btn-xs').click(function (e) {
//        console.log(e.target.innerHTML);
//        console.log(e.target.id);
//
//
//    });
//        $("[data-toggle=tooltip]").tooltip();
});
//Data table call

//var $table = $('#table');
//html5datatable.data();


