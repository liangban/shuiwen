//注意：导航 依赖 element 模块，否则无法进行功能性操作
layui.use(['element', 'form', 'apis', 'laydate', 'laypage', 'layer', 'upload'], function () {
    var element = layui.element;
    var form = layui.form;
    var api = layui.apis;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var upload = layui.upload;
    var laypage=layui.laypage;
    var userid;
    var fileurl;
    var msg;

    $('.load_btn button').on('click', function () {
        console.log(1)
        var n = $(this).index('.load_btn li button')
        console.log(n)
        if (n == 0) {
            window.location.href = '../page/gerenzhongxin.html'
        }
        else if (n == 1) {
            window.location.href = '../page/gerenziliao.html'
        }
        else if (n == 2) {
            window.location.href = '../page/xiazaiqingdan.html'
        }
    })
    $.ajax({
        url: url + '/user',
        xhrFields: {withCredentials: true},
        type: 'get',
        success: function (data) {
            if (data.status == true) {
                console.log(data)
                userid = data.data.userID
                if (!userid == '') {
                    console.log(userid)
                    $('.login_2,.login_1').removeAttr('href')
                    $('.login_2 span').text(data.data.username)
                    $('.login_1 span').text('退出登录')


                    api.down_cart(function (data) {
                        console.log(data)
                        msg=data
                        if (data.status == true) {
                            laypage.render({
                                elem: 'down_page'
                                ,count: data.data.length
                                ,limit:10,
                                layout:['prev','page', 'next','limit', 'skip'],
                                limits:[10, 20, 30, 40, 50]
                                ,jump: function(obj){
                                    //模拟渲染
                                    var result = '';
                                        var thisData = data.data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                                    $.each(thisData, function (i, v) {
                                        // console.log("i:"+i,"v:"+v.itemID)
                                        var a = v.downloadOrder;
                                        var b = v.downloadOrderItems;
                                        fileurl = a.fileUrl;
                                        var results = ''
                                        $.each(b, function (c, d) {
                                            // console.log("c:"+c,"d:"+d.resourceName)
                                            var e = c + parseInt(1)
                                            results += '<ul class="clearfloat">' +
                                                '<li class="layui-col-md1"><i></i>' + e + '</li>' +
                                                '<li class="layui-col-md4">' + d.itemName + '</li>' +
                                                '<li class="layui-col-md2">' + d.stationName + '</li>' +
                                                '<li class="layui-col-md1">' + d.resourceName + '</li>' +
                                                '<li class="layui-col-md2">' + d.startDate + '</li>' +
                                                '<li class="layui-col-md2">' + d.endDate + '</li>' +
                                                '</ul>'
                                        })
                                        result += '<div class="zip_file">' +
                                            '<div class="down_doc">' +
                                            '<ul class="clearfloat">' +
                                            '<li class="layui-col-md3"><p class="clearfloat"><i></i><span>' + a.downloadFileName + '</span><span>订单编号：' + a.downloadOrderID + '</span></p></li>' +
                                            '<li class="layui-col-md6"><span>开始时间：' + a.startTime + '</span><span>结束时间：' + a.endTime + '</span></li>' +
                                            // '<li class="layui-col-md3">' + a.fileUrl + '</li>' +
                                            '<li class="layui-col-md3"><button data class="show">展开详请</button></li>' +
                                            '</ul>' +
                                            '<input type="checkbox" name="like1[read]" lay-skin="primary" itemID="' + v.itemID + '" info-data="0">' +
                                            '</div>' +
                                            '<div class="download">' +
                                            '<div class="down_name">' +
                                            '<ul class="clearfloat">' +
                                            '<li class="layui-col-md1">项目序号</li>' +
                                            '<li class="layui-col-md4">文件名称</li>' +
                                            '<li class="layui-col-md2">测站名称</li>' +
                                            '<li class="layui-col-md1">资源类别</li>' +
                                            '<li class="layui-col-md2">数据开始时间</li>' +
                                            '<li class="layui-col-md2">数据结束时间</li>' +
                                            '</ul>' +
                                            '</div>' +
                                            '<div class="down_catalog">' +
                                            results +
                                            '</div>' +
                                            '</div>' +
                                            '</div>'
                                    })
                                    $('.zip_fileds').html(result)
                                }

                            });

                            // console.log(results)

                            form.render()
                        }
                        else {
                            $.each(data.data, function (i, v) {
                                if (i == 0) {
                                    layer.msg(v.msg)
                                    layer.closeAll('loading');
                                }
                            })
                        }
                    })
                }
            }
            else {
                console.log(data)
                msg=data;
                $('.history_btn').hide()
                // layer.msg(data.msg)
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            // layer.msg('网络错误')
        }

    })
    $('.down_doc input').attr('info-data', '0');
    $(document).on('click', '.history_btn .compile', function () {
//            console.log(0)
        var data = $('.down_doc input').attr('info-data');
        var data_id=$(this).attr('data-id')
        if (data == 0) {
            $('.down_doc input').attr('info-data', '1');
            $(this).attr('data-id','1');
            $(this).text('批量删除');
            $('.history .down_doc li button').attr('class', 'remove')
            $('.history .down_doc li button').text('删除')
            $('.alldown').text('取消')
            $('.alldown').attr('class', 'quxiao')
            $('.layui-unselect').show();
        }
        else if (data_id == 1) {
            $.each($('.zip_fileds .zip_file .layui-form-checked'),function(num,obj){
                var itemid=$(this).prev().attr('itemid');
                var it=$(this);
                // console.log(obj)
                // var itemid=$(this).children().find('input').attr('itemid');
                // console.log(itemid);
                api.delete_cart(itemid, function (data) {
                    console.log(data)
                    console.log(itemid)
                    if (data.status == true) {
                        it.parents('.zip_file').remove();
                        layer.msg(data.msg)
                        if($('.zip_fileds .zip_file').length==0){
                            $('.zip_fileds').html('<p style="text-align: center">暂无数据</p>')
                            $('.history_btn').hide()
                        }
                        
                        // window.location.href = '../page/xiazaiqingdan.html'
                    }
                    else {
                        layer.msg(data.msg)
                    }
                })
            })
        }
    })
    var itemid
    $(document).on('click', '.history .down_doc li button', function () {
        var _this=$(this)
        if ($(this).attr('class') == 'show') {
            if($(this).text()=='展开详请'){
                $(this).text('收起详请')
                $(this).parents('.down_doc').next().toggle();
            }
            else{
                $(this).text('展开详请')
                $(this).parents('.down_doc').next().toggle();
            }
            
        }
        else {
            // $('.layui-form-checked').each(function(a,b){
            itemid = $(this).parents('ul').next().attr('itemid');
            console.log(itemid);
            api.delete_cart(itemid, function (data) {
                console.log(data)
                if (data.status == true) {
                    console.log($(this))
                    _this.parents('.zip_file').remove()
                    layer.msg(data.msg)
                    if($('.zip_fileds .zip_file').length==0){
                        $('.history_btn').hide()
                    }
                    // window.location.href = '../page/xiazaiqingdan.html'
                }
                else {
                    layer.msg(data.msg)
                }
            })
            // })
        }
    })

    $(document).on('click', '.alldown,.quxiao', function () {

        if ($(this).attr('class') == 'alldown') {
            var _this=$(this);

                api.down_cartzip(function(data){

                    if(data.status==true){
                        _this.html('打包中...')
                        _this.attr('disabled','disabled')
                        var i=setInterval(function progross(){
                            api.cartzip_progress(function(data){
                                console.log(data)
                                    if(data.status==true){
                                        if(data.msg==100){
                                            window.location.href=url+'/cart/download';
                                            clearInterval(i);
                                            _this.html('全部下载')
                                            _this.removeAttr('disabled')
                                        }
                                        else{
                                        }
                                    }
                                    else{
                                        layer.msg(data.msg)
                                    }
                                })
                },1000)
            }
            else{
                layer.msg(data.msg)
            }
            
        })
        }
        else {
            $('.down_doc input').attr('info-data', '0');
            $('.history_btn .compile').text('编辑清单');
            $('.history .down_doc li button').attr('class', 'show')
            $('.history .down_doc li button').text('展开详请')
            $(this).text('全部下载')
            $(this).attr('class', 'alldown')
            $('.layui-unselect').hide();
        }
    })
    form.on('submit(downData)', function (data) {
        var startDate = data.field.start;
        var endDate = data.field.end;
        console.log(msg)
        if(msg==undefined){
            layer.msg("请先登录！")
        }
        else if(msg.code=='-1'){
            layer.msg(msg.msg);
            setTimeout(function(){
                window.location.href='../page/yonghudenglu.html'
            },3000)
        }
        api.cart_history(startDate, endDate, function (data) {
            console.log(data);
            if (data.status == true) {
                // console.log(data.data);
                if(data.data==null){
                    console.log(data.data)
                    layer.msg('暂无历史记录')
                }
                // layer.msg(data.msg)
                else{

                    laypage.render({
                        elem: 'down_page'
                        ,count: data.data.length
                        ,limit:10,
                        layout:['prev','page', 'next','limit', 'skip'],
                        limits:[10, 20, 30, 40, 50]
                        ,jump: function(obj){
                            //模拟渲染
                            var result = '';
                            var thisData = data.data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                            $.each(thisData, function (i, v) {
                                // console.log("i:"+i,"v:"+v.itemID)
                                // console.log(i);
                                var a = v.downloadOrder;
                                var b = v.downloadOrderItems;
                                fileurl = a.fileUrl;
                                var results = ''
                                $.each(b, function (c, d) {
                                    // console.log("c:"+c,"d:"+d.resourceName)
                                    var e = c + parseInt(1)
                                    results += '<ul class="clearfloat">' +
                                        '<li class="layui-col-md1"><i></i>' + e + '</li>' +
                                        '<li class="layui-col-md4">' + d.itemName + '</li>' +
                                        '<li class="layui-col-md1">' + d.stationName + '</li>' +
                                        '<li class="layui-col-md2">' + d.resourceName + '</li>' +
                                        '<li class="layui-col-md2">' + d.startDate + '</li>' +
                                        '<li class="layui-col-md2">' + d.endDate + '</li>' +
                                        '</ul>'
                                })
                                result += '<div class="zip_file">' +
                                    '<div class="down_doc">' +
                                    '<ul class="clearfloat">' +
                                    '<li class="layui-col-md3"><p class="clearfloat"><i></i><span>' + a.downloadFileName + '</span><span>订单编号：' + a.downloadOrderID + '</span></p></li>' +
                                    '<li class="layui-col-md6"><span>开始时间：' + a.startTime + '</span><span>结束时间：' + a.endTime + '</span></li>' +
                                    // '<li class="layui-col-md3">' + a.fileUrl + '</li>' +
                                    '<li class="layui-col-md3"><button class="show">展开详请</button></li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '<div class="download">' +
                                    '<div class="down_name">' +
                                    '<ul class="clearfloat">' +
                                    '<li class="layui-col-md1">项目序号</li>' +
                                    '<li class="layui-col-md4">文件名称</li>' +
                                    '<li class="layui-col-md1">测站名称</li>' +
                                    '<li class="layui-col-md2">资源类别</li>' +
                                    '<li class="layui-col-md2">数据开始时间</li>' +
                                    '<li class="layui-col-md2">数据结束时间</li>' +
                                    '</ul>' +
                                    '</div>' +
                                    '<div class="down_catalog">' +
                                    results +
                                    '</div>' +
                                    '</div>' +
                                    '</div>'
                            })
                            $('.zip_filed').html(result)
                        }

                    });
                form.render()
                
               }
            }
            else {
                $.each(data.data, function (i, v) {
                    if (i == 0) {
                        layer.msg(v.msg)
                        layer.closeAll('loading');
                    }
                })
            }

        })
    })
})