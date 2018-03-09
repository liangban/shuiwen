layui.use(['laydate','layer','api','form','laypage'], function(){
    var api = layui.api,
        $=layui.jquery;
    // api.getTree();
    api.roleTree();
    // api.getworks();
    var form=layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var laypage = layui.laypage;
    var arr=[];
    var authorityID;
    var num;
    api.getroletree(function(data){
        // console.log(data)
        if(data.status == true) {
            var zNodes=data.data;
            var setting = {
                view: {
                    addHoverDom: addHoverDom,
                    removeHoverDom: removeHoverDom,
                    selectedMulti: false
                },
                check: {
                    enable: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                edit: {
                    enable: true,
                    showRemoveBtn: true,
                    showRenameBtn: false,
                },
                callback: {
                    onRemove: onRemove,
                    onCheck: zTreeOnCheck,
                    beforeRemove:false,
                }
                ,asyne:{
                    enable:true,
                    url:url+'admin/role/tree',
                    autoParam:["id"], 
                    dataType:"json", 
                }

            };
             

            function zTreeOnCheck(event, treeId, treeNode) {
                num=treeNode.id
                if($('.layer').is(":visible")==false){
                    $('.layer').fadeIn()
                    $('.layer .add_catalog').hide();
                    $('.layer .get_user').show();
                }
                arr.push(treeNode.id)
                var brr=new Array();
                $.each(arr,function(i,v){
                    var items=v;
                    num=v;
                    if($.inArray(items,brr)==-1) {
                        brr.push(items);
                    }
                })
                // console.log(brr)
                $('.get_user form input').val(brr)
               api.getworkauthority(num,function(data){
                console.log(data)
                if(data.status==true){
                    $.each(data.data,function(i,v){
                        var node_name=v.authorityName;
                        $.each($('.get_user .ztree li'),function(a,b){
                            // console.log($(this).find('.node_name').text())
                            if($(this).find('.node_name').text()==node_name){
                                // console.log($(this))
                                $(this).find(".chk").removeClass("checkbox_false_full").addClass("checkbox_true_full")
                                $(this).find(".chk").click()
                            }
                        })
                    arr.push("" + v.roleID + "");
                });
                }
            })
            };

            $(document).ready(function() {
                $.fn.zTree.init($("#role"), setting, zNodes);
                
            });

            function beforeRemove(treeId, treeNode,index){
                // alert(treeId, treeNode,index)
                layer.open({
                                title:'提示',
                                content: '确定删除？'
                                 ,btn: ['确定', '取消']
                                 ,yes: function(){
                                       return true
                                     }
                                 ,no: function(){
                                      //按钮【按钮二】的回调
                                        $('.layui-layer-close').click();
                                      //return false 开启该代码可禁止点击该按钮关闭
                                     }
                      
                                   ,cancel: function(){ 
                        
                                     }
                                 });
            }
            // 删除角色
            function onRemove(treeId, treeNode,index){
                
                $.ajax({
                    url:url+'admin/role/'+index.id,
                    dataType:'json',
                    type:'delete',
                     
                    success:function(data){
                        console.log(data);
                        if(data.status==true){
                           $("#" + index.tId).remove();
                           
                                      layer.msg(data.msg)
                        }
                        else if(data.status==false) {
                            if(data.data==null){
                                layer.msg(data.msg)
                            }
                            else{
                                layer.msg(data.data[0].msg)
                            }
                        }
                    },
                })
            }
            $(document).ready(function() {
                $.fn.zTree.init($("#role"), setting, zNodes);
            });
            var newCount = 1;
            function addHoverDom(treeId, treeNode) {
                var sObj = $("#" + treeNode.tId + "_span");
                sObj.parents('li.level0').attr('infoid',treeNode.id);
                if(treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
                var addStr = "<span class='button add' id='addBtn_" + treeNode.tId +
                    "' title='add node' onfocus='this.blur(); infoid='"+treeNode.id+"''></span>";
                sObj.after(addStr);
                var btn = $("#addBtn_" + treeNode.tId);
                if(btn) btn.bind("click", function() {
                    var zTree = $.fn.zTree.getZTreeObj("role");
                    // $('.layer').show();
                    if($('.layer').is(":visible")==false){
                        $('.layer').fadeIn()
                        $('.layer .add_catalog').hide();
                        $('.layer .add_role').show();
                        // $('select[name="pRoleID"]').val(treeNode.id)
                        $.each($('select[name="pRoleID"] option'),function(){
                            if($(this).val()==treeNode.id){
                                console.log($(this))
                                $(this).attr('selected','true');
                            }
                        })
                    }
                    form.render();
                    return false;
                });
            };
            function removeHoverDom(treeId, treeNode) {
                $("#addBtn_" + treeNode.tId).unbind().remove ();
            };
            var option=''
            $.each(data.data,function(i,v){
                // if(v.pid=='-1'){
                    // console.log($(this))
                    option+='<option value="'+v.id+'">'+v.name+'</option>'
                // }
            })
            $('.layui-input-block .parent_catalog').append(option);
            form.render();
        }
        else{
            if(data.data==null){
                    layer.msg(data.msg)
                }
                else{
                    layer.msg(data.data[0].msg)
                }
        }
    });
    $(document).on('click','.add_catalog b.layui-icon',function(){
        // console.log(1)
        $('.catalog #role .checkbox_true_full').click()
    })

    //重置表单
    $(document).on('click','button[name="reset"]',function(){
        console.log(1)
        // $('#myform')[0].reset();
        $(this).parents('form').find('')
    })
    function  addZero(i) {
        return i>10?i:'0'+i;
    }
      $(document).ajaxStart(function(){
            layer.load(2);
        });
        $(document).ajaxSuccess(function(){
             layer.closeAll('loading');
        });
    //执行一个laydate实例
    laydate.render({
        elem: '#test1' ,//指定元素
        type: 'datetime',
        range:true,
        done: function(value, date, endDate){
         
            $('.startData').val(date.year+'-'+date.month+'-'+date.date+' '+addZero(date.hours)+':'+addZero(date.minutes)+':'+addZero(date.seconds));
            $('.endData').val(endDate.year+'-'+endDate.month+'-'+endDate.date+' '+addZero(endDate.hours)+':'+addZero(endDate.minutes)+':'+addZero(endDate.seconds));

        }
    });
    form.on('submit(formDemo)',function (data) {
        // console.log(data)
        var startTime =data.field.startTime;
        var endTime = data.field.endTime;
        var loginName =data.field.email;
        // console.log(startTime,endTime,loginName)
        api.getlog(startTime,endTime,loginName,function (datas) {
        	console.log(datas)
            if(datas.status==true){
               if(datas.data!=null){

               	 var result='';
                   // $.each(datas.data,function(i,v){
                   //     if(v.status==1){
                   //         v.status='执行成功';
                   //     }
                   //     else{
                   //         v.status='执行失败';
                   //     }
                   //     if(v.exceptionMsg==null){
                   //         v.exceptionMsg='没有异常'
                   //     }
                   //     html='<ul class="row">'+
                   //         '<li class="col-2" data-ip="'+v.ip+'">'+v.operateUser+'</li>'+
                   //         // '<li class="col-2">'+v.ip+'</li>'+
                   //         // '<li class="col-1">'+v.requestURL+'</li>'+
                   //         // '<li class="col-1">'+v.requestMethod+'</li>'+
                   //         '<li class="col-2" data-requestURL="'+v.requestURL+'">'+v.operation+'</li>'+
                   //         '<li class="col-2" data-requestMethod="'+v.requestMethod+'">'+v.startTime+'</li>'+
                   //         '<li class="col-2" data-exceptionMsg="'+v.exceptionMsg+'">'+v.endTime+'</li>'+
                   //         '<li class="col-2" data-params="'+v.params+'">'+v.status+'</li>'+
                   //         '<li class="col-2 compile"><button class="active">详请</button></li>'+
                   //         '</ul>'
                   //     // console.log(html);
                   //
                   // })
                   laypage.render({
                       elem: 'rizhi' //注意，这里的 test1 是 ID，不用加 # 号
                       ,count: datas.data.length, //数据总数，从服务端得到
                       limit:20,
                       layout:['prev','page', 'next','limit', 'skip'],
                       limits:[10, 20, 30, 40, 50],
                       jump: function(obj, first) {
                                  var thisData = datas.data.concat().splice(obj.curr*obj.limit - obj.limit, obj.limit);
                           var  html='';
                               $.each(thisData,function(i,v){

                                   if(v.status==1){
                                       v.status='执行成功';
                                   }
                                   else{
                                       v.status='执行失败';
                                   }
                                   if(v.exceptionMsg==null){
                                       v.exceptionMsg='没有异常'
                                   }
                                   html+='<ul class="row">'+
                                       '<li class="col-2" data-ip="'+v.ip+'">'+v.operateUser+'</li>'+
                                       // '<li class="col-2">'+v.ip+'</li>'+
                                       // '<li class="col-1">'+v.requestURL+'</li>'+
                                       // '<li class="col-1">'+v.requestMethod+'</li>'+
                                       '<li class="col-2" data-requestURL="'+v.requestURL+'">'+v.operation+'</li>'+
                                       '<li class="col-2" data-requestMethod="'+v.requestMethod+'">'+v.startTime+'</li>'+
                                       '<li class="col-2" data-exceptionMsg="'+v.exceptionMsg+'">'+v.endTime+'</li>'+
                                       '<li class="col-2" data-params="'+v.params+'">'+v.status+'</li>'+
                                       '<li class="col-2 compile"><button class="active">详请</button></li>'+
                                       '</ul>'
                               })

                           $('.choose_data .data_content').html(html);
                           if (!first) {
                               //do something
                           }
                       }
                   });
               }
               else{
                $('.choose_data .data_content').html('暂无数据');
               	 layer.msg('暂无数据')
               }
            }
            else {
                if(datas.data==null){
                    layer.msg(datas.msg)
                }
                else{
                    layer.msg(datas.data[0].msg)
                }
            }
        })
    })
    $(document).on('click','.compile button',function(){
        // var text1=$(this).parents('.data_content').find('li:nth-child(1)').text();
        var text2=$(this).parents('.data_content').find('li[data-ip]').attr('data-ip');
        var text3=$(this).parents('.data_content').find('li[data-requestURL]').attr('data-requestURL');
        var text4=$(this).parents('.data_content').find('li[data-requestMethod]').attr('data-requestMethod');
        var text5=$(this).parents('.data_content').find('li[data-exceptionMsg]').attr('data-exceptionMsg');
        var text6=$(this).parents('.data_content').find('li[data-params]').attr('data-params');
        // var text7=$(this).parents('.data_content').find('li:nth-child(4)').text();
        // var text8=$(this).parents('.data_content').find('li:nth-child(5)').text();
        // $('.particulars .text').text(text1)
        $('.particulars .text2').text(text2)
        $('.particulars .text3').text(text3)
        $('.particulars .text4').text(text4)
        $('.particulars .text5').text(text5)
        $('.particulars .text6').text(text6)
        // $('.particulars .text7').text(text7)
        // $('.particulars .text8').text(text8)
        layer.open({
            type:1,
            title:'查看详情',
            content:$('.particulars'),
            area:'400px',
        })
    })
    // 添加角色
    form.on('submit(formadd)',function (data) {
        // console.log(data)
        var roleName =data.field.roleName;
        var roleType = data.field.roleType;
        var pRoleID =data.field.pRoleID;
        console.log(roleName,roleType,pRoleID)
        api.addrole(roleName,roleType,pRoleID,function (data) {
            if(data.status==true){
                $('.layer').hide()
                layer.msg(data.msg)
                window.location.reload()
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                }
                else{
                    layer.msg(data.data[0].msg)
                }
            }
        })
    })
    // 修改角色权限
        form.on('submit(add_authority)',function(data){
        var authorities=data.field.add_authority;
        // var num=
        console.log(num,authorities)
        api.editauthority(num,authorities,function(data){
            if(data.status==true){
                $('.layer').fadeOut();
                layer.msg(data.msg)
                setTimeout(function(){
                    window.location.reload()
                },2000)
                
            }
            else {
                if(data.data==null){
                    layer.msg(data.msg)
                }
                else{
                    layer.msg(data.data[0].msg)
                }
            }
        })
    })
    $('.data_content li button').on('click', function () {
        $('.layer').fadeIn();
        $('.layer .shenpi').animate({
            opacity:'show',
            marginTop:'12'
        },'slow',function(){
        })
    })
    $('.add_catalog h3 b').on('click', function () {
        $('.layer').fadeOut();
        $('.layer .shenpi').animate({
            opacity:'show',
            marginTop:'0'
        },'slow',function(){
        })
    })
});