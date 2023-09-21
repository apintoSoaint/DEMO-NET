<%@ WebHandler Language="C#" Class="ServiceRequest_Product" %>

using System;
using System.Web;
using BusinessEntity;
using BusinessLogic;
using System.Collections;
using System.Collections.Generic;
using System.Linq;


public class ServiceRequest_Product : IHttpHandler, System.Web.SessionState.IRequiresSessionState {

    BEL_Product ValidateItem(int itemId)
    {
        BEL_Product ItemValidate = new BEL_Product();
        BLL_Product Service = new BLL_Product();

        ItemValidate = new BEL_Product();
        ItemValidate.ProductId = itemId;
        return Service.Product_Select(ItemValidate);
    }

    List<BEL_Product> ListItems()
    {
        BLL_Product Service = new BLL_Product();
        return Service.Product_SelectAll();
    }

    string JsonData(string code, object item, string mode, string draw, string recordsTotal, string recordsFiltered)
    {
        string JsonSerialize = null;
        switch (mode)
        {
            case "I": case "U": case "D":
                var ItemProduct = new
                {
                    code = code
                };
                JsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(ItemProduct);
                break;
            case "G":
                var ItemProductGet = new
                {
                    code = code,
                    data = item
                };
                JsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(ItemProductGet);
                break;
            case "S":
                List<BEL_Product> ListObject = null;
                ListObject = item as List<BEL_Product>;

                var Listado = (from row in ListObject
                               select new
                               {
                                   ProductId = row.ProductId,
                                   Name = row.Name,
                                   Stock = row.Stock,
                                   ErrorMessage = row.ErrorMessage,
                               })
                                  .Skip(0)
                                  .Take(10);

                var ItemProductSelectAll = new
                {
                    draw = draw,
                    recordsTotal = recordsTotal,
                    recordsFiltered = recordsFiltered,
                    data = Listado
                };

                JsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(ItemProductSelectAll );
                break;
            case "E":
                var ItemProductError = new
                {
                    code = code,
                    data = item
                };
                JsonSerialize = new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(ItemProductError);
                break;
        }
        return JsonSerialize;
    }

    public void ProcessRequest (HttpContext context) {
        var ResultResponseJson = "";
        BEL_Product Item;
        BEL_Product ItemValidate;
        BLL_Product Service = new BLL_Product();
        List<BEL_Product> ListProductsItems = new List<BEL_Product>();

        try
        {
            var FrmMode = context.Request.Form["FrmMode"];
            var ProductId  = context.Request.Form["ProductId"];
            var ProductName = context.Request.Form["ProductName"];
            var ProductStock = context.Request.Form["ProductStock"];
            //Call Session User - Login
            //var UserId = context.Session["UserId"].ToString();

            // Valite ProductId
            int ValidateInt = 0;
            bool ResultProductId = int.TryParse(ProductId, out ValidateInt);
            bool ResultMode =  string.IsNullOrWhiteSpace(FrmMode) ? false : true;


            if (ResultMode)
            {
                switch (FrmMode)
                {
                    case "I":
                        Item = new BEL_Product();
                        Item.Name = ProductName;
                        Item.Stock  = Convert.ToInt32(ProductStock);
                        Service.Product_Insert(Item);
                        ResultResponseJson = JsonData("OK-I", null,"I","","","");
                        break;
                    case "U":
                        //Valite ProductId in Database
                        if (ResultProductId)
                        {
                            ItemValidate = new BEL_Product();
                            ItemValidate = ValidateItem(Convert.ToInt32(ProductId));
                            if (ItemValidate != null)
                            {
                                ItemValidate.Name = ProductName;
                                ItemValidate.Stock  = Convert.ToInt32(ProductStock);
                                Service.Product_Update(ItemValidate);
                                ResultResponseJson = JsonData("OK-U", null,"U","","","");
                            }
                            else
                                ResultResponseJson = JsonData("DoesNotExist", null,"E","","","");
                        }
                        break;
                    case "D":
                        //Valite ProductId in Database
                        if (ResultProductId)
                        {
                            ItemValidate = new BEL_Product();
                            ItemValidate = ValidateItem(Convert.ToInt32(ProductId));
                            if (ItemValidate != null)
                            {
                                Service.Product_Delete(ItemValidate);
                                ResultResponseJson = JsonData("OK", null,"D","","","");
                            }
                            else
                                ResultResponseJson = JsonData("DoesNotExist", null,"E","","","");
                        }
                        break;
                    case "G":
                        if (ResultProductId)
                        {
                            Item = new BEL_Product();
                            Item = ValidateItem(Convert.ToInt32(ProductId));
                            if (Item != null)
                            {
                                ResultResponseJson = JsonData("OK", Item,"G","","","");
                            }
                            else
                                ResultResponseJson = JsonData("DoesNotExist", null,"E","","","");
                        }
                        break;
                    case "S":
                        var draw = context.Request["draw"];
                        //parameter to specify from what element the results should  start
                        var start = context.Request["start"];
                        //parameter to specify how many objects should we take (for pagination purposes)
                        var length = context.Request["length"];
                        //column to sort by:
                        var orderColumn = context.Request["order[0][column]"];
                        //direction to sort by
                        var orderDir = context.Request["order[0][dir]"];
                        //string to filter to (if any)
                        var searchValue = context.Request["search[value]"];

                        Func<BEL_Product, object> OrderItems = p =>
                        {
                            if (orderColumn == "0")
                            {
                                return p.Name;
                            }
                            return p.Name;
                        };

                        ListProductsItems = ListItems();


                        List<BEL_Product> filteredRows = new List<BEL_Product>();
                        if (!string.IsNullOrEmpty(searchValue))
                            filteredRows = ListProductsItems.Where(p => p.Name.Contains(searchValue)).ToList();
                        else
                            filteredRows = ListProductsItems;

                        
                        if (orderDir.ToLower() == "asc")
                            filteredRows = filteredRows.OrderBy(OrderItems).ToList();
                        else
                            filteredRows = filteredRows.OrderByDescending(OrderItems).ToList();


                        ResultResponseJson = JsonData("", filteredRows,"S",draw,filteredRows.Count().ToString(),filteredRows.Count().ToString());

                        break;
                }
            }
            else
                ResultResponseJson = JsonData("InvalidOperation", null,"E","","","");


        }
        catch (Exception ex)
        {
            Item = new BEL_Product();
            Item.ErrorMessage = ex.Message;
            ResultResponseJson = JsonData("Error", Item,"E","","","");
        }
        finally
        {
            context.Response.ContentType = "application/json";
            context.Response.Write(ResultResponseJson);
        }

    }

    public bool IsReusable {
        get {
            return false;
        }
    }

}