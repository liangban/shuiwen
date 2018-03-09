layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api,
	form = layui.form,
	layer = layui.layer,
	laydate = layui.laydate,
		html='';
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
				$('#end').val(endDate.year + '-' + add(endDate.month)+ '-' + add(endDate.date))
			}
		});
		//查询
		form.on("submit(formDemo)",function(data){
			var startDate = $('#start').val();
			var endDate = $('#end').val();
			console.log(startDate,endDate)
			api.appliCation(startDate,endDate,function(datas){

                console.log(datas)
                if(datas.status==true){
					if(datas.data!=null){
						var html = ''
						window.localStorage['dataLen']=datas.data.length
				$.each(datas.data, function(i, v) {
					html += '<ul class="row">' +
						'                <li class="col-2">' + v.applyID + '</li>' +
						'                <li class="col-2">' + v.applyUserLoginName + '</li>' +
						'                <li class="col-2">' + v.applyTime + '</li>';
						if(v.purpose!=null){
							html+='                <li class="col-2">' + v.purpose + '</li>' ;
						}
						else{
							html+='                <li class="col-2">无</li>' ;
						}

						html+='                <li class="col-2"><a href="#" data-id='+ v.applyID + ' class="chak">查看</a></li>' +
						'                <li class="col-2 compile" data-num="'+v.applyID+'"><button class="layui-btn layui-btn-normal" data-ok="true">通过</button><button data-ok="false">拒绝</button>' +
						'            </ul>';
				})
				$('.data_content').html(html);
					}
					else{
						layer.msg(datas.msg)
					}
				}
				else{
					layer.msg('暂无数据')
				}
			})
			return false;
		})
		//删除
		$(document).on('click','.compile button',function(){
			$('#ok').val($(this).attr('data-ok'))
			$('#applicationID').val($(this).parent().attr('data-num'))
			var description=$('#description').val();
			$('.com').attr('data-id',$(this).parent().attr('data-num'))
			layer.open({
				type:1,
				title:'审批描述',
				// shadeClose:true,
				area:['600px','403px'],
				content:$(".add_catalog2"),
				// isOutAnim:true,
			})

		})
		$(document).on('click','.shenpi .active',function(){
			var num=$('.com').attr('data-id')
			var dataLen=window.localStorage['dataLen'];
			console.log(num,dataLen)
			if($('.layer2 textarea').val()==''){
				$('.layer2 textarea').css('border-color','red');
				layer.msg('填写不能为空')
			}
			else{
				$('.layui-layer-shade').trigger('click');
				var description=$('.layer2 textarea').val();
				var ok=$('#ok').val()
				var applicationID=$('#applicationID').val()
				console.log(description,ok,applicationID)
				api.applicationID(applicationID,ok,description,function(data){
				if(data.status==true){
						for(var i=0;i<dataLen;i++ ){
							var nums=$('.data_content ul:eq('+i+') .compile').attr('data-num')
							if(nums==num){
								$('.data_content ul:eq('+i+')').remove()
							}
						}
						$('textarea').val('');
						layer.msg(data.msg)
					}
					else{
						layer.msg(data.msg)
					}
				})

			}
			return false;
		})
		$(document).on('click','.chak',function(){
			var applicationID=$(this).attr('data-id');
			console.log(applicationID)
			var IDCard_front="http://www.tomylee.top/admin/application/"+applicationID+"/IDCard_front";
			var IDCard_back="http://www.tomylee.top/admin/application/"+applicationID+"/IDCard_back";
			var companyCertification="http://www.tomylee.top/admin/application/"+applicationID+"/companyCertification";
			$('#example1 img').attr('src',IDCard_front)
			$('#example2 img').attr('src',IDCard_back)
			$('.company_prove img').attr('src',IDCard_back)
			layer.open({
				type:1,
				title:'审批描述',
				// shadeClose:true,
				area:['600px','405px'],
				content:$(".prove"),
				// isOutAnim:true,
			})
		})

});