$(document).ready(function () {
    //This function will load the datatable
    LoadTable();

    //hook up datepicker
    $('#BirthDate').datepicker({
        format: 'mm/dd/yyyy',
        autoclose: true
    });

    //Hook up the click event for the Registrar/Actualizar customer button
    $("#CustomerInfoPopup").click(function () {
        //clear form
        ClearForm();

        //open modal window
        $('#addEditCustomer').modal('toggle');
    });

    //Hook up the click event for the save button on the Registrar/Actualizar popup window
    $("#AddCustomerButton").click(function () {
        //validate that name and last name were entered
        var errorMsg = "";
        if (!$("#firstname").val())
        {
            errorMsg += "\n* enter the customer first name";
        }

        if (!$("#lastname").val()) {
            errorMsg += "\n* enter the customer last name";
        }

        if (!$("#Email").val()) {
            errorMsg += "\n* enter the customer email";
        }

        if ($("#Birthday").val())
        {
            var parsed = moment($("#Birthday").val(), 'DD/MM/YYYY');
            if (!parsed.isValid())
            {
                errorMsg += "\n* Birthdate you entered is not valid.";
            }
        }

        if (errorMsg != "")
        {
            errorMsg = "The following errors were found: \n" + errorMsg + "\n\n Please enter the required information and try again.";
            alert(errorMsg);
        }
        else
        {
            //JQuery ajax call
            $.ajax({
                method: "POST",
                url: "handlers/SaveCustomer.ashx",
                dataType: "json", 
                data: {
                    firstname: $("#firstname").val(),
                    lastname: $("#lastname").val(),
                    birthday: $("#BirthDate").val(),
                    email: $("#Email").val(),
                    phone: $("#Phone").val(),
                    company: $("#Company").val(),
                    Zip: $("#Zip").val(),
                    currentID: $("#currentID").val()
                },
                success: function (result) {                    
                    switch (result.code) {
                        case "OK":
                            $('#Customer-Info').DataTable().ajax.reload(); //refresh the datatable to reflect the changes                         
                            $('#addEditCustomer').modal('hide'); //hide the popup window
                            //alert("Customer saved correctly.");
                            swal("Buen trabajo!", "Registro correcto.", "success").catch(swal.noop);
                            break;
                        case "Not Valid":
                            alert("Server received invalid information.");
                            break;                        
                        default:
                            alert("Unknown server issue." + result.code);
                        }                    
                },
                error: function (xhr, ajaxOptions, thrownError) {                    
                    alert("AJAX Save customer error" + thrownError);
                }
            })            
        }
    });
});

//hook up event for edit record buttons
$(document).on('click', '.EditButton', function (event) //any element with the class EditButton will be handled here
{
    event.preventDefault(); //Stops the current handled event to reroute through this ebent
    var node = $(this); //current element handled
    var id = node.attr("data-name"); //get the id stored on the data-name property of the button

    ClearForm();
    //load from database
    $.ajax({
        method: "POST",
        url: "handlers/LoadCustomer.ashx",
        dataType: "json",
        async: true,
        data: {
            Id: id
        },
        success: function (result) {
            switch (result.code) {
                case "OK":
                    $("#firstname").val(result.data.FirstName);
                    $("#lastname").val(result.data.LastName);
                    $('#BirthDate').datepicker('setDate', result.data.Birthday);                    
                    $("#Email").val(result.data.Email);
                    $("#Phone").val(result.data.Phone);
                    $("#Company").val(result.data.Company);
                    $("#Zip").val(result.data.Zip);
                    $("#currentID").val(result.data.Id);
                    $('#addEditCustomer').modal('show');
                    break;
                case "NotFound":
                    $('#Customer-Info').DataTable().ajax.reload();
                    alert("Record not found.");
                    break;
                case "Error":
                    alert("Handler Error" + result.data);
                    break;
                default:
                    alert("Unknown server issue" + result.code);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert("Load User AJAX Error:" + thrownError);
        }
    });
});

function ClearForm() //blank the Registrar/Actualizar popup form
{
    $("#firstname").val('');
    $("#lastname").val('');
    $("#BirthDate").val('');
    $("#Email").val('');
    $("#Phone").val('');
    $("#Company").val('');
    $("#Zip").val('');
    $("#currentID").val('');
}

function LoadTable()
{
    var oTable = $('#Customer-Info').dataTable({
        dom: 'Bfrtip',
        buttons: [
            'copyHtml5',
            'excelHtml5',
            'csvHtml5',
            'pdfHtml5'
        ],
        "processing": true,
        "responsive": true,
        "serverSide": true,
        "ajax": {
            "url": "Handlers/GetCustomers.ashx",
            "type": "POST"
        },
        "columnDefs": [{ //this definition is set so the column with the action buttons is not sortable
            "targets": -1, //this references the last column of the date
            "orderable": false
        }],
        "columns": [
            {
                "data": "FirstName",
                "width": "10%"
            },
            {
                "data": "LastName",
                "width": "10%"
            },
            {
                "data": "Birthday",
                "width": "10%"
            },
            {
                "data": "Email",
                "width": "10%"
            },
            {
                "data": "Phone",
                "width": "10%"
            },
            {
                "data": "Company",
                "width": "10%"
            },
            {
                "data": "Zip",
                "width": "10%"
            },
            {
                "data": "NumOfPurchases",
                "width": "10%"
            },
            {
                "data": "Id",
                "width": "20%",
                "render": function (data, type, full, meta) { //this column is redefinied to show the action buttons
                    return '<div class="btn-toolbar"><button class="btn btn-sm btn-primary EditButton" data-name="' + data + '">Edit</button><button class="btn btn-sm btn-danger DeleteButton" data-name="' + data + '">Delete</button></div>';
                }
            }
        ],
    });
}

$(document).on('click', '.DeleteButton', function (event) {
    event.preventDefault();
    if (confirm('This action will delete the selected record. Plese click OK to confirm.'))
    {
        var node = $(this);
        var id = node.attr("data-name");

        //load from database
        $.ajax({
            method: "POST",
            url: "handlers/DeleteCustomer.ashx",
            dataType: "json",
            async: true,
            data: {
                Id: id
            },
            success: function (result) {
                switch (result.code) {
                    case "OK":
                        $('#Customer-Info').DataTable().ajax.reload();
                        alert("Record deleted successfully.");
                        break;
                    case "Not valid":
                        alert("Invalid server information.");
                        break;
                    case "NotFound":
                        $('#Customer-Info').DataTable().ajax.reload();
                        alert("Record not found.");
                        break;
                    case "Error":
                        alert("Handler Error" + result.data);
                        break;
                    default:
                        alert("Unknown server issue" + result.code);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("Load User AJAX Error:" + thrownError);
            }
        });
    }    
});
