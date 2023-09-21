<%@ Page Title="" Language="C#" MasterPageFile="~/MasterPage.master" AutoEventWireup="true" CodeFile="product.aspx.cs" Inherits="product" %>

<asp:Content ID="Content1" ContentPlaceHolderID="head" Runat="Server">
       <link href="css/datatables.min.css" rel="stylesheet" />
    <link href="css/bootstrap-datepicker3.min.css" rel="stylesheet" />
    <link href="DataTables/Responsive-2.2.0/css/responsive.bootstrap.min.css" rel="stylesheet" />
    <script src="DataTables/Responsive-2.2.0/js/dataTables.responsive.min.js"></script>
    <script src="DataTables/Responsive-2.2.0/js/responsive.bootstrap.min.js"></script>
</asp:Content>
<asp:Content ID="Content2" ContentPlaceHolderID="ContentPlaceHolder1" Runat="Server">
 
     <div class="container-fluid">
      <!-- Breadcrumbs-->
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <a href="#">Product</a>
        </li>
        
      </ol>
      <!-- Example DataTables Card-->
      <div class="card mb-3">
        <div class="card-header">
          <i class="fa fa-table"></i> Product List</div>
          <div class="col-lg-20 text-right"> 
             <button type="button" class="btn btn-outline-success btn-lg" id="EstadoInfoPopup">Add Product</button>              
               
          
          </div> 
        <div class="card-body">
           <table id="Estados-Info" class="table table-bordered table-striped table-hover dataTable js-exportable" cellspacing="0" width="100%">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Stock</th>                                      
                                        <th>Acción</th>
                                    </tr>
                                </thead>
                                <tbody>            
                                </tbody>            
                             </table>
                                 <div class="modal fade" id="addEditEstado" tabindex="-1" role="dialog" aria-labelledby="basicModal" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <div class="modal-header">                
                                                <h4 class="modal-title" id="myModalLabel">Product</h4>
                                            </div>
                                            <div class="modal-body">
                                                <fieldset>
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                                    <div class="form-group">
                                                                    <label>Name</label>                                                                    
                                                                    <input id="txtName" class="form-control" type="text" />
                                                                </div>
                                                            </div>
                                                    </div> 
                                                    <div class="row">
                                                        <div class="col-lg-12">
                                                                    <div class="form-group">
                                                                    <label>Stock</label>                                                                    
                                                                    <input id="txtStock" class="form-control" type="number" />
                                                                </div>
                                                            </div>
                                                    </div> 
                                                    <input type="hidden" id="ProductId" value="" />     
                                                </fieldset>                                               
                                            </div>
                                            <div class="modal-footer">
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                <button type="button" class="btn btn-primary" id="AddEstadoButton">Save</button>
                                        </div>
                                    </div>
                                    </div>
                                </div>   
        </div>
        
      </div>
    </div>

</asp:Content>
<asp:Content ID="Content3" ContentPlaceHolderID="JavaScript" Runat="Server">
     
    <script src="ServiceScript/Product.js"></script>
  
</asp:Content>

