layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api;
	form = layui.form;
	layer = layui.layer;
	laydate = layui.laydate;
	  $(document).ajaxStart(function(){
            layer.load(2);
        });
        $(document).ajaxSuccess(function(){
             layer.closeAll('loading');
        });
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
				$('#end').val(endDate.year + '-' + add(endDate.month)+ '-' + add(date.date))
			}
		});
		//查询
		form.on("submit(formDemo)",function(data){
			var startDate = $('#start').val();
			var endDate = $('#end').val();
			api.approveRecord(startDate,endDate,function(datas){
				console.log(datas)
				if(datas.status==true){
					if(datas.data!=null){
						var html = ''
							$.each(datas.data, function(i, v) {
								html += '<ul class="layui-row">' +
									'                <li class="layui-col-xs1">' + v.applyID + '</li>' +
									'                <li class="layui-col-xs2">' + v.applyUserLoginName + '</li>' +
									'                <li class="layui-col-xs2">' + v.applyTime + '</li>' +
									'                <li class="layui-col-xs2">' + v.approveTime + '</li>' +

									'                <li class="layui-col-xs2">' + v.approveUserLoginName + '</li>' ;
									if(v.approveResult==1){
										html+= '      <li class="layui-col-xs1">通过</li>' ;
									}
									else{
										html+= '      <li class="layui-col-xs1">不合格</li>' ;
									}
											
									html+=		
									'              <li class="layui-col-xs2">' + v.description + '</li>' +
									'            </ul>';
							})
							$('.data_content').html(html);
					}
					else{
						layer.msg(datas.msg)
						$('.data_content').html('暂无数据');
					}
				}
				else{
					layer.msg(datas.msg)
					$('.data_content').html('暂无数据');
				}
			})
			return false;
		})
});