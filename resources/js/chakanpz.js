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
	function add(i) {
		return i > 10 ? i : '0' + i
	}

	//时间渲染
 	laydate.render({
		elem: '#date',
		type: 'month',
		range: true,
		done: function(value, date, endDate) {
			$('#start').val(date.year + '-' + add(date.month))
			$('#end').val(endDate.year + '-' + add(endDate.month))
		}
	});
	//获取一级流域
	var bs = -1;
	api.getBasins(bs, function(data) {
		if(data.status == true) {
			var html = '';
			html += '<option value="" >请选择</option>'
			$.each(data.data, function(i, v) {
				html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
			})
			$('.one ').html(html)
			$('.one1 ').html(html)
			form.render();
		}
	})
	form.on('select(province)', function(data) {
		var bs1 = data.value;
		api.getBasins(bs1, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						if(i==0){
							html += '<option value="' + v.bscd + '" >' + v.bsnm + '</option>'
						}
						else{
							html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
						}
					})
					$('.two ').html(html)
					$('.three ').html('<option value="">三级流域</option>')
					$('.cz ').html('<option value="">测站</option>')
				} else {
					layer.msg(data.msg);
					$('.two ').html('<option value="">三级流域</option>')

				}
				form.render();
			}
		})

	})
	form.on('select(city)', function(data) {
		var bs2 = data.value;
		api.getBasins(bs2, function(data) {
			if(data.status == true) {
				if(data.data != null) {
					$('.form1 .layui-btn').removeClass('layui-btn-disabled');
					$('.form1 .layui-btn').removeAttr('disabled');
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						if(i==0){
							html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
						}
						else{
							html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
						}
					})
					$('.three ').html(html)

				} else {
					$('.three ').html('<option value="">三级流域</option>')
				}
				form.render();
			}
		})

	})
	
	//获取测站
	form.on('select(reso)', function(data) {
		var resourceID = data.value;
		console.log(1)
		$('.three ').html('<option value="">三级流域</option>')
		$('.cz ').html('<option value="">测站</option>');
		$('.data_content').html('暂无数据');
		$('.two ').html('<option value="">二级流域</option>')
		form.render()
		form.on('select(area)', function(data) {
			var bss = data.value;
			api.getStations(resourceID, bss, function(data) {
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						$.each(data.data, function(i, v) {
							if(i==0){
							html += '<option value="' + v.stcd + '" selected="selected">' + v.stnm + '</option>'
						}
						else{
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						}
						})
						$('.cz').html(html)
					}
					form.render();
				} else {
					layer.msg(data.msg)
					$('.cz ').html('<option value="">测站</option>')
					$('.form .layui-btn').addClass('layui-btn-disabled');
					$('.form .layui-btn').attr('disabled');
					$('.data_content').html('暂无数据');
					form.render();
					return false;
				}
			})
		})
	})
	form.on('select(area)', function(data) {
		var bss = data.value;
		form.on('select(reso)', function(data) {
			var resourceID = data.value;
			api.getStations(resourceID, bss, function(data) {
				console.log(data)
				if(data.status == true) {
					if(data.data != null) {
						var html = '';
						$.each(data.data, function(i, v) {
							if(i==0){
							html += '<option value="' + v.stcd + '" selected="selected">' + v.stnm + '</option>'
						}
						else{
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						}
						})
						$('.cz').html(html)
						form.render();
					}

				} else {
					layer.msg(data.msg)
					
					$('.data_content').html('暂无数据');
					$('.cz ').html('<option value="">测站</option>')
					form.render();
					return false;
				}

			})
		})
	})
	//获取tag
	form.on('select(tag)',function(data){
		$('#tag').val(data.value)
		if(data.value==0){
			$('.cz').parent('.layui-input-inline').show();
		}
		else{
			$('.cz').parent('.layui-input-inline').hide();
		}
	})
	//查询
	form.on('submit(formDemo)',function(data){
		var resourceID=data.field.resourceID;
		var startDate = $('#start').val();
		var endDate = $('#end').val();
		var tag=$('#tag').val();
		if(tag==0){
			var code=data.field.stationCode;
			console.log(code)
			if(code!=''){
				api.issueConf(resourceID,code,tag,startDate,endDate,function(datas){
					console.log(datas)
					if(datas.status==true){
						var html = ''
						$.each(datas.data, function(i, v) {
							html += '<ul class="row">' +
						'                <li class="col-1">' + v.issueConfID + '</li>' ;
						if(v.issueMethods==true){
							html +='                <li class="col-1">手动发布</li>' ;
						}
						else{
							html +='                <li class="col-1">自动发布</li>' ;
						}
						html +='                <li class="col-1">' + v.resourceName + '</li>' +
						'                <li class="col-1">' + v.stationName + '</li>' ;
						if(v.issueSchema==true){
							html +='                <li class="col-1" class="schema">授权发布</li>' ;
						}
						else{
							html +='                <li class="col-1" class="schema">公开发布</li>' ;
						}
						if(v.authGrade==0){
							html +='                <li class="col-1" class="grade">A</li>' ;
						}
						else if(v.authGrade==1){
							html +='                <li class="col-1" class="grade">B</li>' ;
						}
						else if(v.authGrade==2){
							html +='                <li class="col-1" class="grade">C</li>' ;
						}
						else if(v.authGrade==null){
							html +='                <li class="col-1" class="grade">无</li>' ;
						}
						html +='                <li class="col-1">' + v.issueProgress + '</li>' +
						'                <li class="col-1">' + v.startDate + '</li>' +
						'                <li class="col-1">' + v.endDate + '</li>' +
						'                <li class="col-2"><button class="layui-btn layui-btn-normal add" data-info="'+v.issueConfID+'">编辑</button> <button class="remove"  data-info="'+v.issueConfID+'">删除</button></li>' +
						'            </ul>';
						})
						$('.data_content').html(html);
					}
					else{
                          if(datas.data==null){
                        	layer.msg(datas.msg)
                        	 layer.closeAll('loading');
                        }
                        else{
                        	layer.msg(datas.data[0].msg)
                        	 layer.closeAll('loading');
                        }
						$('.data_content').html('暂无数据');
					}
				})
			}
			else{
				layer.msg('测站不存在');
			}
		}
		else if(tag==1){
			var code=data.field.area;
			api.issueConf(resourceID,code,tag,startDate,endDate,function(datas){
				console.log(datas)
					if(datas.status==true){
						var html = ''
						$.each(datas.data, function(i, v) {
							html += '<ul class="row">' +
						'                <li class="col-1">' + v.issueConfID + '</li>' ;
						if(v.issueMethods==true){
							html +='                <li class="col-1">手动发布</li>' ;
						}
						else{
							html +='                <li class="col-1">自动发布</li>' ;
						}
						html +='                <li class="col-1">' + v.resourceName + '</li>' +
						'                <li class="col-1">' + v.stationName + '</li>' ;
						if(v.issueSchema==true){
							html +='                <li class="col-1" class="schema">授权发布</li>' ;
						}
						else{
							html +='                <li class="col-1" class="schema">公开发布</li>' ;
						}
						if(v.authGrade==0){
							html +='                <li class="col-1" class="grade">A</li>' ;
						}
						else if(v.authGrade==1){
							html +='                <li class="col-1" class="grade">B</li>' ;
						}
						else if(v.authGrade==2){
							html +='                <li class="col-1" class="grade">C</li>' ;
						}
						else if(v.authGrade==null){
							html +='                <li class="col-1" class="grade">无</li>' ;
						}
						html +='                <li class="col-1">' + v.issueProgress + '</li>' +
						'                <li class="col-1">' + v.startDate + '</li>' +
						'                <li class="col-1">' + v.endDate + '</li>' +
						'                <li class="col-2"><button class="layui-btn layui-btn-normal add" data-info="'+v.issueConfID+'">编辑</button> <button class="remove" data-info="'+v.issueConfID+'">删除</button></li>' +
						'            </ul>';
						})
						$('.data_content').html(html);
					}
					else{
                        if(datas.data==null){
                        	layer.msg(datas.msg)
                        	 layer.closeAll('loading');
                        }
                        else{
                        	layer.msg(datas.data[0].msg)
                        	 layer.closeAll('loading');
                        }
						$('.data_content').html('暂无数据');
					}
				})
		}
		return false;
	})
	//删除
	$(document).on('click','.data_content .remove',function(){
		var num=$(this).attr('data-info');
		var index=$(this).index('.data_content .remove');
        api.removeData(num,function (data) {
			console.log(data)
			if(data.status==true){
				layer.msg(data.msg)
				$('.data_content .remove').eq(index).parents('.row').remove();
			}
			else{
                layer.msg(data.msg)
			}
        })

	})

		$(document).on('click','.row .add', function() {
			$('.layer').fadeIn();
			var num=$(this).attr('data-info');
			 $('#num').val(num)
		})
		$(document).on('click','.add_catalog a', function() {
			$('.layer').fadeOut();
		})
		
		//时间渲染
	laydate.render({
			elem: '#stDate',
			type: 'month',
			done: function(value, date, endDate) {
				$('#start1').val(date.year + '-' + add(date.month))
			}
		});
		laydate.render({
			elem: '#endDate',
			type: 'month',
			done: function(value, date, endDate) {
				$('#end1').val(date.year + '-' + add(date.month))
			}
		});
		//权限监听
	form.on('switch(authGrades)', function(data){
		console.log(data.elem.checked)
	 if(data.elem.checked){
	 	$('#authGradess').val('false')
	 	$('.authGrade').parent('.layui-input-inline ').hide()
	 	
	 }
	 else{
	 	$('#authGradess').val('true')
	 	$('.authGrade').parent('.layui-input-inline ').show()
	 }
	}); 
	//权限等级
	form.on('select(authGrade)',function(data){
			if(data.value==0){
				$('#authGrade').val(data.value)
			}
			else if(data.value==1){
				$('#authGrade').val(data.value)
			}
			else if(data.value==2){
				$('#authGrade').val(data.value)
			}
			
		})
	//修改配置
	form.on('submit(formDemo1)',function(data){
		var issueSchema=$('#authGradess').val();
		var startDate=$('#start1').val();
		var endDate=$('#end1').val();
		var that=$(this);
		var num=$('#num').val();
		if(issueSchema=='true'){
			var authGrade=$('#authGrade').val();
			api.issueReConfs(num,startDate,endDate,issueSchema,authGrade,function(datas){
				console.log(datas)
				if(datas.status==true){
					layer.msg(datas.msg);
					$('.add_catalog a').trigger('click')
					$('.ziyuanleixing .form1 .layui-btn').trigger('click')
				}
				else{
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
		}
		else if(issueSchema=='false'){
			api.issueReConfs(num,startDate,endDate,issueSchema,authGrade,function(datas){
				console.log(datas)
				if(datas.status==true){
					layer.msg(datas.msg);
					$('.ziyuanleixing .form1 .layui-btn').trigger('click')
					$('.add_catalog a').trigger('click')
				}
				else{
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
			var authGrade='';
		}
		return false;
	})
});