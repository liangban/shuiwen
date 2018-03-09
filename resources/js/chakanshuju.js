layui.use(['api', 'jquery', 'form', 'layer', 'laydate'], function() {
	$ = layui.jquery;
	var api = layui.api;
	form = layui.form;
	api.getResource();
	layer = layui.layer;
	laydate = layui.laydate;
	$(document).ajaxStart(function() {
		layer.load(2);
	});
	$(document).ajaxSuccess(function() {
		layer.closeAll('loading');
	});

	function add(i) {
		return i > 10 ? i : '0' + i
	}
	var bs = -1;
	api.getBasins(bs, function(data) {
		if(data.status == true) {
			var html = '';
			html += '<option value="" >一级流域</option>'
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
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.two ').html(html)
					$('.three ').html('<option value="">三级流域</option>')
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
					var html = '';
					html += '<option value="" >请选择</option>'
					$.each(data.data, function(i, v) {
						html += '<option value="' + v.bscd + '">' + v.bsnm + '</option>'
					})
					$('.three ').html(html)

				} else {
					$('.three ').html('<option value="">三级流域</option>')
					layer.msg(data.msg)

				}
				form.render();
			}
		})

	})
	//获取测站
	form.on('select(reso)', function(data) {
		var resourceID = data.value;
		form.on('select(area)', function(data) {
			var bss = data.value;
			api.getStations(resourceID, bss, function(data) {
				console.log(data)
				if(data.status == true) {
					if(data.data != null) {
						$('.form1 .layui-btn').removeClass('layui-btn-disabled');
						$('.form1 .layui-btn').removeAttr('disabled');
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
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
				if(data.status == true) {
					if(data.data != null) {
						$('.form1 .layui-btn').removeClass('layui-btn-disabled');
						$('.form1 .layui-btn').removeAttr('disabled');
						var html = '';
						html += '<option value="" >请选择</option>'
						$.each(data.data, function(i, v) {
							html += '<option value="' + v.stcd + '">' + v.stnm + '</option>'
						})
						$('.cz').html(html)
						form.render();
					}

				} else {
					layer.msg(data.msg)
					$('.form .layui-btn').addClass('layui-btn-disabled');
					$('.form .layui-btn').attr('disabled');
					$('.data_content').html('暂无数据');
					$('.cz ').html('<option value="">测站</option>')
					form.render();
					return false;
				}

			})
		})
	})
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
	//查询
	form.on('submit(formDemo)', function(data) {
		var resourceID = data.field.resourceID;
		var stationCode = data.field.stationCode;
		var startDate = $('#start').val();
		var endDate = $('#end').val();
		api.issueData(resourceID, stationCode, startDate, endDate, function(datas) {
			console.log(datas)
			if(datas.status == true) {
				if(datas.data != null) {
					var html = ''
					$.each(datas.data, function(i, v) {
						html += '<ul class="row">' +
							'                <li class="col-2">' + v.issueDataID + '</li>' +
							'                <li class="col-2">' + v.issueConfID + '</li>' +
							'                <li class="col-4">' + v.issueDataName + '</li>' +
							'                <li class="col-2">' + v.startDate + '</li>' +
							'                <li class="col-2">' + v.endDate + '</li>' +
							'            </ul>';
					})
					$('.data_content').html(html);
				} else {
					layer.msg(datas.msg)
					layer.closeAll('loading');
				}

			} else {
				if(datas.data == null) {
					layer.msg(datas.msg)
					layer.closeAll('loading');
				} else {
					layer.msg(datas.data[0].msg)
					layer.closeAll('loading');
				}

			}
		})
		return false;
	})
});