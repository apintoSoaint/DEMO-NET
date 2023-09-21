var FrmMode;

$(document).ready(function () {
    
    ListRecords();
    
    $("#EstadoInfoPopup").click(function () {       
        ClearForm();        
        $('#addEditEstado').modal('toggle');
    });

    $("#txtStock").keypress(function (e) {
        if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
            $("#errmsg").html("You must type only whole numbers.").show().fadeOut("slow");
            return false;
        }
    });

 
    $("#AddEstadoButton").click(function () {
        debugger;
        var errorMsg = "";
        if (!$("#txtName").val()) {
            swal("You must enter the Product Name.", "Product.", "info").catch(swal.noop);
            return;
        }

        if (!$("#txtStock").val()) {
            $("#txtStock").val('0')
        }

        if (!$("#ProductId").val())
            FrmMode = "I";
        else
            FrmMode = "U";

 
        $.ajax({
            method: "POST",
            url: "ServiceAshx/ServiceRequest_Product.ashx",
            dataType: "json",
            data: {
                FrmMode: FrmMode,
                ProductName: $("#txtName").val(),
                ProductStock: $("#txtStock").val(),                
                ProductId: $("#ProductId").val()
            },
            success: function (result) {
                switch (result.code) {
                    case "OK-U":
                        $('#Estados-Info').DataTable().ajax.reload();                      
                        $('#addEditEstado').modal('hide'); 
                        swal({
                            position: 'top-right',
                            type: 'success',
                            title: 'Successful Update.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        break;
                    case "OK-I":
                        $('#Estados-Info').DataTable().ajax.reload();                          
                        $('#addEditEstado').modal('hide'); 

                        swal({
                            position: 'top-right',
                            type: 'success',
                            title: 'Successful Registration.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        break;
                    case "Not Valid":
                        swal("Invalid Information.", "Product.", "error").catch(swal.noop);
                        break;
                    case "DoesNotExist":
                        swal("The record does not exist.", "Product.", "error").catch(swal.noop);
                        break;
                    case "InvalidOperation":
                        swal("Process Error:", "Product.", "Product").catch(swal.noop);
                        break;
                    case "Error":
                        swal("Process Error:", "Product.", "Product").catch(swal.noop);
                        break;
                    default:
                        swal("Unknown server problem:" + result.code, "Product.", "error").catch(swal.noop);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Process Error: " + thrownError, "Product.", "error").catch(swal.noop);
            }
        })

    });

});


$(document).on('click', '.EditButton', function (event)
{
    debugger;
    event.preventDefault();
    var node = $(this);
    var id = node.attr("data-name");
      

    if (id.length <= 0 ) {
        swal("There is no value to edit.", "Product.", "info").catch(swal.noop);
        return;        
    }
    else
        FrmMode = "G";

     
    ClearForm();   
    $.ajax({
        method: "POST",
        url: "ServiceAshx/ServiceRequest_Product.ashx",
        dataType: "json",
        async: true,
        data: {
            FrmMode: FrmMode,
            ProductId: id,
            ProductStock: ""
        },
        success: function (result) {
            switch (result.code) {
                case "OK":
                    debugger;
                    $("#txtName").val(result.data.Name);
                    $("#txtStock").val(result.data.Stock);
                    $("#ProductId").val(result.data.ProductId);
                    $('#addEditEstado').modal('show');
                    break;
                case "DoesNotExist":
                    $('#Estados-Info').DataTable().ajax.reload();
                    swal("The record does not exist.", "Product.", "info").catch(swal.noop);
                    break;
                case "Error":
                    swal("Error: " + result.data, "Product.", "error").catch(swal.noop);
                    break;
                default:
                    swal("Unknown server problem: " + result.code, "Product.", "error").catch(swal.noop);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            swal("Process Error:" + thrownError, "Product.", "error").catch(swal.noop);
        }
    });
});


$(document).on('click', '.DeleteButton', function (event) {


    debugger;
    event.preventDefault();
    var node = $(this);
    var id = node.attr("data-name");

    if (id.length <= 0) {
        swal("There is no value to Delete.", "Product.", "info").catch(swal.noop);
        return;
    }
    else
        FrmMode = "D";


    swal({
        title: 'Delete Product',
        text: "This action will delete the selected record. Is it safe to delete the registry?",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#4fa7f3',
        cancelButtonColor: '#d57171',
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
    }).then(function () {
       
        $.ajax({
            method: "POST",
            url: "ServiceAshx/ServiceRequest_Product.ashx",
            dataType: "json",
            async: true,
            data: {
                FrmMode: FrmMode,
                ProductId: id,
                ProductStock: "" 
            },
            success: function (result) {
                switch (result.code) {
                    case "OK":
                        $('#Estados-Info').DataTable().ajax.reload();
                        swal({
                            position: 'top-right',
                            type: 'success',
                            title: 'It has been removed successfully.',
                            showConfirmButton: false,
                            timer: 1500
                        })
                        break;
                    case "Not Valid":
                        swal("Invalid Information.", "Product.", "error").catch(swal.noop);
                        break;
                    case "DoesNotExist":
                        swal("The record does not exist.", "Product.", "error").catch(swal.noop);
                        break;
                    case "Error":
                        swal("Error: " + result.data, "Product.", "error").catch(swal.noop);
                        break;
                    default:
                        swal("Unknown server problem: " + result.code, "Product.", "error").catch(swal.noop);
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                swal("Process Error: " + thrownError, "Product.", "error").catch(swal.noop);
            }
        });
    }).catch(swal.noop);
});


function ClearForm()  
{
    $("#txtName").val('');
    $("#txtStock").val('');
    $("#ProductId").val('');
}

function ListRecords() {
    debugger;
    var oTable = $('#Estados-Info').dataTable({
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
            "data": function (d) {
                d.FrmMode = "S";
                d.ProductId = 0;
                d.ProductName = "";
                d.ProductStock = 0;
            },  
            "url": "ServiceAshx/ServiceRequest_Product.ashx",
            "type": "POST"
        },
        "columnDefs": [{ 
            "targets": -1, 
            "orderable": false
        }],
        "columns": [

            {
                "data": "Name",
                "width": "10%"
            },
            {
                "data": "Stock",
                "width": "10%"
            },
            {
                "data": "ProductId",
                "width": "20%",
                "render": function (data, type, full, meta) { 
                    return '<div class="btn-toolbar"><button class="btn btn-sm btn-primary EditButton" data-name="' + data + '">Edit</button><button class="btn btn-sm btn-danger DeleteButton" data-name="' + data + '">Delete</button></div>';
                }
            }
        ],
    });
} 