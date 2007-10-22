function ItemTable(source, element, options){
  var default_options = {
    
  }
  
  var dataTable;
  
  this.init = function(){
    this.options = updatetree({}, default_options, options);
     
    YAHOO.util.Event.addListener(window, "load", bind(function() {
                    var linkFormatter =function(elCell, oRecord, oColumn, oData) {
                            elCell.innerHTML = "<a href='"+oData.href+"' title='"+oData.description+"'>"+oData.description+"</a>"; 
                     } 
                    var dateFormatter = function(elCell, oRecord, oColumn, oData){
                        var date = YAHOO.util.DataSource.parseDate(oData.time);
                        elCell.innerHTML = date.getDate()+ "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    }
                    var myColumnDefs = [
                        {key:"data",  
                        formatter: dateFormatter,  
                        label: "Date", 
                        sortable: false, 
                        width: "5em", 
                        resizeable: false,
                        className: "yui-dt-col-date"},
                        
                        {key:"data",
                         formatter : linkFormatter, 
                         label: "Description",
                         sortable: false,
                         width: "35em",
                         resizeable: false,
                         className: "yui-dt-col-description"},
                         
                        {key:"tags",
                        label : "Tags",
                        sortable:false, 
                        width: "20em", 
                        resizeable: false},
                    ];
            
                    var myDataSource = new YAHOO.util.DataSource([]);
                    myDataSource.responseType = YAHOO.util.DataSource.TYPE_JSARRAY;
                    myDataSource.responseSchema = {
                        fields: ["tags", 
                                 "data", 
                        ]
                    };
                    
                    var configs = {
                        paginated:true, // Enables built-in client-side pagination
                        paginator:{ // Configurable options
                            containers: null, // Create container DIVs dynamically
                            currentPage: 1, // Show page 1
                            dropdownOptions: [25,50,100], // Show these in the rows-per-page dropdown
                            pageLinks: 8, // Show links to all pages
                            rowsPerPage: 50 // Show up to 500 rows per page
                        },
                    };
                    
                    
                    dataTable = new YAHOO.widget.DataTable(element,
                                myColumnDefs, myDataSource, configs);
                                
                    Utils.signals.connect(source, "update", bind(this.update, this));
                                
                    this.update();
                  }, this));
  }
  
  this.update = function(){
      dataTable.getRecordSet().replaceRecords(source.getItems());
      dataTable.refreshView();                                
  }
  
  this.init();                  
}