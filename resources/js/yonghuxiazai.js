layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api;
	form = layui.form;
	api.getResource();
	layer = layui.layer;
	laydate = layui.laydate;
	  $(document).ajaxStart(function(){
            layer.load(2);
        });
        $(document).ajaxSuccess(function(){
             layer.closeAll('loading');
        });
	//查询
	form.on('submit(formDemos)', function(data) {
		console.log(data)
		var loginName=data.field.user;
		var startDate=$('#start').val();
		var endDate=$('#end').val();
		api.perrecord(loginName,startDate,endDate,function(datas){
			console.log(datas)
			if(datas.status == true) {
				var html = ''

				$.each(datas.data, function(i, v) {
					html += '<ul class="row">' +
						'                <li class="col-1">' + v.downloadOrder.downloadOrderID + '</li>' +
						'                <li class="col-3">' +  v.downloadOrder.downloadFileName + '</li>' +
						'                <li class="col-2">' +  v.downloadOrder.startTime + '</li>' +
						'                <li class="col-1">' + v.downloadOrder.endTime + '</li>' +
						'                <li class="col-4">' +  v.downloadOrder.fileUrl + '</li>' +
						
						'                <li class="col-1"><button class="remove" data-resourceDataID='+ v.downloadOrderID + ' data-v='+JSON.stringify(v)+'>查看</button></li>' +
						'            </ul>';
						
				})
				
				$('.data_name3').html(html);

			} else {
				if(datas.data==null){
                        	layer.msg(datas.msg)
                        	 layer.closeAll('loading');
                        }
                        else{
                        	layer.msg(datas.data[0].msg)
                        	 layer.closeAll('loading');
                        }

			}
			
		})
		return false;
	})

	function add(i) {
		return i > 10 ? i : '0' + i
	}
	//时间渲染
	laydate.render({
		elem: '#date',
		type: 'date',
		range: true,
		done: function(value, date, endDate) {
			console.log(date)
			$('#start').val(date.year + '-' + add(date.month)+ '-' + add(date.date))
			$('#end').val(endDate.year + '-' + add(endDate.month)+ '-' + add(endDate.date))
		}
	});
	$(function() {
		$('.form1 .add').on('click', function() {
			$('.layer').fadeIn();
		})
		$('.add_catalog a').on('click', function() {
			$('.layer').fadeOut();
		})
	})
	
	$(document).on('click','.remove',function(){
		var v=JSON.parse($(this).attr('data-v'))
						var html1=''
		layer.open({
					type:1,
					title:'详情',
					shadeClose:true,
					area:['1101px','600px'],
					content:$('.data_name1'),
					isOutAnim:true,
				})
		$.each(v.downloadOrderItems,function(i, v) {
					html1 += '<ul class="row">' +
						'                <li class="col-1">' + i + '</li>' +
						'                <li class="col-3">' + v.itemName + '</li>' +
						'                <li class="col-2">' + v.startDate + '</li>' +
						'                <li class="col-2">' + v.endDate + '</li>' +
						'                <li class="col-2">' + v.resourceName + '</li>' +
						'                <li class="col-2">' + v.stationName + '</li>' +
						'            </ul>';
					})
						$('.data_name2').html(html1);
	})
});