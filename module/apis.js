var url = 'http://www.tomylee.top';
layui.define(['jquery','form'], function(exports) {
	var $ = layui.jquery;
	var form=layui.form;
	var obj = {
        register:function(loginName,password,verifyCode,callback){
        	var json={
        		"loginName":loginName,
        		"password":password,
        		"verifyCode":verifyCode,
			}
			$.ajax({
				url:url+'/signin',
                xhrFields: {withCredentials: true},
				type:'post',
				data:json,
				dataType:'json',
				success:callback,
			})
		},
		loginout:function(callback){
        	var json={}
        	$.ajax({
				url:url+'/signout',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
		forgetcodepassword:function(to,email,callback){
        	var json={
        		"to":to,
				"email":email,
			}
			$.ajax({
				url:url+'/verification/email',
                xhrFields: {withCredentials: true},
				type:'get',
				data:json,
				dataType:'json',
				success:callback,

			})
		},
        //修改忘记的密码
        forgetpassword:function (loginName,password,confirmPassword,captcha,callback) {
			var json={
				"loginName":loginName,
				"password":password,
				"confirmPassword":confirmPassword,
				"captcha":captcha,
			}
			$.ajax({
				url:url+'/password',
                xhrFields: {withCredentials: true},
                type:'put',
                data:json,
                dataType:'json',
                success:callback,
			})
        },
    //用户注册部分
		getcode:function(to,email,callback){
			var json={
				"to":to,
				"email":email
			}
			$.ajax({
				url:url+'/verification/email',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	用户注册下一步
		nextStep:function(to,captcha,callback){
            var json={
                "to":to,
                "captcha":captcha
            }
            $.ajax({
                url:url+'/verification/email',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
            })
		},
	//	注册账号
        registerAccount:function(userName,loginName,password,confirmPassword,phoneNumber,userProperty,companyName,callback){
			var json={
				"userName":userName,
				"loginName":loginName,
				"password":password,
				"confirmPassword":confirmPassword,
				"phoneNumber":phoneNumber,
				"userProperty":userProperty,
				"companyName":companyName,
			}
            $.ajax({
                url:url+'/signup',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
            })
		},
	//	获得个人信息
		getuser:function(userid,callback){
        	var json={}
        	$.ajax({
                url:url+'/user/'+userid+'/info',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	修改个人信息
		xiugaiuser:function(userid,userName,phoneNumber,userProperty,companyName,callback){
			var json={
				"userName":userName,
				"phoneNumber":phoneNumber,
				"userProperty":userProperty,
				"companyName":companyName,
			}
			$.ajax({
                url:url+'/user/'+userid+'/info',
                xhrFields: {withCredentials: true},
                type:'put',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	修改个人密码
		xiugaipassword:function(userid,oldPassword,password,confirmPassword,callback){
			var json={
				"oldPassword":oldPassword,
				"password":password,
				"confirmPassword":confirmPassword
			}
			$.ajax({
				url:url+'/user/'+userid+'/password',
                xhrFields: {withCredentials: true},
                type:'put',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	申请审核
		shenhe:function(IDCard_front,IDCard_back,CompanyCertification,cpurpose,callback){
			var json={
				"IDCard_front":IDCard_front,
				"IDCard_back":IDCard_back,
				"CompanyCertification":CompanyCertification,
				"cpurpose":cpurpose,
			}
				$.ajax({
					url:url+'/application',
                    xhrFields: {withCredentials: true},
                    type:'post',
                    data:json,
                    dataType:'json',
                    success:callback,
				})
		},
	//	下载清单
		down_cart:function(callback){
			var json={}
			$.ajax({
				url:url+'/cart',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
        // 购物车打包
        down_cartzip:function(callback){
            var json={}
            $.ajax({
                url:url+'/cart/zip',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 查询购物车打包进度
        cartzip_progress:function(callback){
            var json={}
            $.ajax({
                url:url+'/cart/zip/progress',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
        },
        // 下载文档接口
        downLoad_cart:function(callback){
            var json={}
            $.ajax({
                url:url+'/cart/zip/progress',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
        },
	//	删除订单
		delete_cart:function(itemid,callback){
			var json={};
			$.ajax({
				url:url+'/cart/'+itemid,
                xhrFields: {withCredentials: true},
                type:'delete',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	用户添加订单到购物车
		add_cart:function(downloadOrderID,callback){
			var json={
				"downloadOrderID":downloadOrderID
			}
			$.ajax({
                url:url+'/cart',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	用户下载历史
		cart_history:function(startDate,endDate,callback){
			var json={
				"startDate":startDate,
				"endDate":endDate
			}
			$.ajax({
				url:url+'/downloadOrder/history',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	用户提价某订单打包任务
		down_zip:function(orderid,callback){
			var json={}
			$.ajax({
				url:url+'/downloadOrder/'+orderid+'/zip',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
			})
		},
	//	用户查询某订单打包进度
		zip_date:function(orderid,callback){
            var json={}
            $.ajax({
                url:url+'/downloadOrder/'+orderid+'/progress',
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
		},
	//	用户下载打包完成后的单个订单
		zip_bao:function(fileurl,callback){
            var json={}
            $.ajax({
                url:url+fileurl,
                xhrFields: {withCredentials: true},
                type:'get',
                data:json,
                dataType:'json',
                success:callback,
            })
		},
	//	生成下载订单
		downOrder:function(station_resourceCodes,startDate,endDate,callback){
			var json={
				"station_resourceCodes":station_resourceCodes,
				"startDate":startDate,
				"endDate":endDate,
			}
            $.ajax({
                url:url+'/downloadOrder',
                xhrFields: {withCredentials: true},
                type:'post',
                data:json,
                dataType:'json',
                success:callback,
            })
		},
        /*
         * 数据下载
         */
        getSortRsou:function(){
            var json = {};
            $.ajax({
                type:"get",
                url:url + '/resource/tree',
                data:json,
                xhrFields: {withCredentials: true},
                dataType: "json",
                success:function(data){
                    if(data.status==true){
                        window.localStorage['getTree']=JSON.stringify(data.data);
                    }
                }
            });
        },
//		//获取下载
        getDown:function(station_resourceCodes,startDate,endDate,callback){
            var json={
                "station_resourceCodes":station_resourceCodes,
                "startDate":startDate,
                "endDate":endDate,
            }
            $.ajax({
                url:url+'/downloadOrder',
                xhrFields: {withCredentials: true},
                data:json,
                type:"post",
                dataType:'json',
                success:callback,
                error:function(XMLHttpRequest, textStatus, errorThrown){
                    layer.msg('请先登录')
                    setTimeout(function(){
                        window.location.href='../page/yonghudenglu.html'
                    }, 3000 )
                }
            })
        },
//		打包
        zip:function(downloadOrderID,callback){
            var json = {};
            $.ajax({
                type:"POST",
                xhrFields: {withCredentials: true},
                url:url + '/downloadOrder/'+downloadOrderID+'/zip ',
                data:json,
                dataType: "json",
                success:callback
            });
        },
        progress:function(downloadOrderID,callback){
            var json = {};
            $.ajax({
                type:"GET",
                xhrFields: {withCredentials: true},
                url:url + '/downloadOrder/'+downloadOrderID+'/progress ',
                data:json,
                dataType: "json",
                success:callback
            });
        },
        //下载文件
        downLoad:function(uri,callback){
            var json = {};
            $.ajax({
                type:"GET",
                xhrFields: {withCredentials: true},
                url:url +'/'+ uri,
                data:json,
                dataType: "json",
                success:callback
            });
        },
        toCart:function(downloadOrderID,callback){
            var json = {'downloadOrderID':downloadOrderID};
            $.ajax({
                type:"post",
                xhrFields: {withCredentials: true},
                url:url + '/cart',
                data:json,
                dataType: "json",
                success:callback
            });
        },
        // 联系我们
        contactUs:function(name,email,content,callback){
            var json={
                "name":name,
                "email":email,
                "content":content,
            }
            $.ajax({
                type:'post',
                xhrFields: {withCredentials: true},
                url:url+'/contactUs',
                data:json,
                dataType:'json',
                success:callback,
            })
        }
	}
	exports('apis', obj);
});