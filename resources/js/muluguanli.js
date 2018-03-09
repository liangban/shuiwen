layui.use(['api','form'], function(){
	  var api = layui.api,
	      $=layui.jquery;
	      api.getTree();
	      var form=layui.form;
//	     loading
            $(document).ajaxStart(function(){
                layer.load(2);
            });
            $(document).ajaxSuccess(function(){
                 layer.closeAll('loading');
            });
	      $('.catalog_tree a .add').on('.click',function(){
	      	var x=$(this).parents("a").text();
	      	console.log(x)
		  })
    	form.on('submit(formDemo)',function (data) {
			console.log(data)
            var pResourceID =data.field.rID;
			var resourceType = data.field.city;
			var resourceID =data.field.code;
			var resourceName=data.field.codeName;
			var info=data.field.info;
            api.addTree(pResourceID,resourceType,resourceID,resourceName,info,function (data) {
            	// console.log(data)
                if(data.status==true){
                	layer.msg(data.msg)
					window.location.reload();
				}
				else {
                    $.each(data.data,function(i,v){
                        if(i==0){
                            layer.msg(v.msg)
                            layer.closeAll('loading');
                        }
                    })
				}

            })
        })


});