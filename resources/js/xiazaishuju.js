layui.use(['element', 'form', 'apis', 'laydate', 'laypage', 'layer'], function () {
    var url = 'http://www.tomylee.top/'
    var element = layui.element;
    var form = layui.form;
    var api = layui.apis;
    var laydate = layui.laydate;
    var layer = layui.layer;

    function add(i) {
        return i > 10 ? i : '0' + i
    }

    var arr = [];
    //时间渲染
    laydate.render({
        elem: '#date1',
        type: 'month',
        range: true,
        done: function (value, date, endDate) {
            console.log(value)
            $('#start').val(date.year + '-' + add(date.month))
            $('#end').val(endDate.year + '-' + add(endDate.month))
        }
    });
    api.getSortRsou();
    var getTree = JSON.parse(window.localStorage['getTree']);
    var html = '';
    $.each(getTree, function (i, v) {
        if (v.pid == '-1') {
            html += '<option value="' + v.id + '">' + v.name + '</option>'
        }
    });
    $('.select1').append(html);

    form.on('select(select1)', function (data) {
        var html1 = '';
        var id = data.value;
        console.log(id)
        html1 += '<option value="">请选择</option>';
        $.each(getTree, function (i, v) {
            if (v.pid == id) {
                html1 += '<option value="' + v.id + '">' + v.name + '</option>'
            }
        });
        $('.select2').html(html1);
        form.render();
    });
    form.on('select(select2)', function (data) {
        var html1 = '';
        var id1 = data.value;
        clearSta()
        arr.length = 0;
        $('#station_resourceCodes').val('')
        $('.checkbox').html('提示：请先查看测站');
        console.log(arr)
        window.localStorage['sta'] = id1
    });
    form.render();
    var n = 0;//计数器
    var myChart = echarts.init(document.getElementById('eMap'));
    var myArray = []; //存储 下钻过程的  比如 -1，长江流域CD，湘江流域CD
    myArray.push("-1");

    var stationCache = {}; //用于存储后台获取的测站数据，可以实现缓存

    var myOption = {
        animation: true,
        tooltip: {
            trigger: 'item'
        },
        toolbox: {
            show: true,
            orient: 'vertical',
            x: 'right',
            y: 'top',
            padding: 20,
            itemSize: 20,
            feature: {
                myButton1: {
                    show: true,
                    title: '返回',
                    icon: 'image://../icons/up1.svg',
                    onclick: function () {
                        if (n > 1)
                            n--;
                        backToLast();
                    }
                },
                myButton3: {
                    show: true,
                    title: '显示测站',
                    icon: 'image://../icons/browse.svg',
                    onclick: function () {
                        getStations(myArray[myArray.length - 1], window.localStorage['sta'], function (stations) {
                            console.log(stations)
                            if (stations == null) {
                                clearSta()
                                layer.msg("该流域下无该类型测站信息");
                                $('.checkbox').html('提示：请先查看测站');
                            }
                            else {
                                console.log(stations.length + " : " + JSON.stringify(stations));
                                var html = ''
                                $.each(stations, function (i, v) {
                                    html += '<input type="checkbox" name="' + i + '" title="' + v.stnm + '" lay-skin="primary" value="' + v.stcd + '" lay-filter="' + v.stcd + '">'
                                });
                                $('.checkbox').html(html);
                                form.render();
                            }

                        });
                    }
                }
            }
        },
        visualMap: {
            show: false,
            min: 0,
            max: 1000,
            left: 'left',
            top: 'bottom',
            text: ['High', 'Low'],
            seriesIndex: [1],
            inRange: {
                color: ['#e0ffff', '#006edd']
            },
            calculable: true
        },
        geo: {
            map: '-1',
            label: {
                normal: {
                    show: true,
                    textStyle: {
                        color: 'rgba(0,0,0,0.4)'
                    }
                }
            },
            itemStyle: {
                normal: {
                    borderColor: 'rgba(0, 0, 0, 0.2)'
                },
                emphasis: {
                    areaColor: null,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                    shadowBlur: 20,
                    borderWidth: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            layoutCenter: ['50%', '51%'],
            layoutSize: '100%'
        },
        series: [{
            name: '测站',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbol: 'pin',
            symbolSize: 12,
            itemStyle: {
                normal: {
                    color: '#F06C00',
                    borderColor: '#F06C00',
                    borderWidth: 1
                },
                emphasis: {
                    color: '#F06C00',
                    borderColor: '#F06C00',
                    borderWidth: 5
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return "测站<br/>" + params.name + ":" + params.value[0] + "," + params.value[1];
                }
            },
            data: []
        },
            {
                name: '流域',
                type: 'map',
                geoIndex: 0,
                tooltip: {
                    trigger: 'item',
                    formatter: function (params) {
                        return "流域<br/>" + params.name;
                    }
                },
                data: []
            }
        ]
    };

    //初始化
    $(document).ready(function () {
        myChart.showLoading();
        $.getJSON('../json/-1.json', function (data) {
            echarts.registerMap("-1", data);
            myOption.series[1].data = convertDataColor(data.features);
            myChart.setOption(myOption);
            myChart.hideLoading();
        });

    });

    myChart.on("click", function (params) {
        if (n == myArray.length) {
            n = myArray.length;
        }
        else {
            n++;
        }
        if (myArray.length > 3) return;
        //获取当前地图的json数据
        var features = echarts.getMap(myArray[myArray.length - 1]).geoJson.features;
        var info = null;
        //找到点击区域的详细数据
        features.forEach(function (value, index) {
            if (value.properties.name == params.name)
                info = value.properties;
        });
        if (!info) return;

        //重复点击相同区域 防止,比如一个2级流域没有子流域了 这种现象出现
        if (info.BSCD == myArray[myArray.length - 1]) return;

        //先看原来是否已经注册过地图
        var old = echarts.getMap(info.BSCD);
        if (old) {
            myOption.geo.map = info.BSCD;
            myOption.series[0].data = [];
            myOption.series[1].data = convertDataColor(old.geoJson.features);
            myChart.setOption(myOption);
            myArray.push(info.BSCD);
        } else {
            myChart.showLoading();
            $.getJSON('../json/' + info.BSCD + '.json', function (geojson) {
                echarts.registerMap(info.BSCD, geojson);
                myOption.geo.map = info.BSCD;
                myOption.series[0].data = [];
                myOption.series[1].data = convertDataColor(geojson.features);
                myChart.setOption(myOption);
                myChart.hideLoading();
                myArray.push(info.BSCD);
            });
        }
    });

    //获得当前流域编码
    function getBSCD() {
        return myArray[myArray.length - 1];
    }

    //返回上一层
    function backToLast() {
        //判断几级流域tag,1级流域就不让了 上钻了
        if (myArray.length < 2)
            return;
        myArray.pop();
        myOption.geo.map = myArray[myArray.length - 1];
        myOption.series[0].data = [];
        myOption.series[1].data = convertDataColor(echarts.getMap(myArray[myArray.length - 1]).geoJson.features);
        myChart.setOption(myOption);
    }

    //获得测站信息 会将测站显示到地图上 并将获得的测站信息数组作为参数填入回调函数handleStation中
    //填入的数据是 null 或者 测站列表  比如下面
    //[{"stnm":"直门达","stcd":"60100700","lgtd":"97.2383300","lttd":"33.0127700"},{"stnm":"测试1","stcd":"60100701","lgtd":"97.2383300","lttd":"33.0127700"}]
    function getStations(BSCD, resourceID, handleStations) {
        //先检查 是否已经缓存了
        if (stationCache[BSCD]) {
            if (stationCache[BSCD][resourceID]) {
                showStationPoint(stationCache[BSCD][resourceID]);
                handleStations(stationCache[BSCD][resourceID]);
                return;
            }
        }
        //没有缓存就会从后台添加
        myChart.showLoading();
        $.ajax({
            type: 'get',
            url: "http://www.tomylee.top/stations", //地址
            data: {
                "BSCD": BSCD,
                "resourceID": resourceID
            },
            // async: false,
            success: function (data) {
                myChart.hideLoading();
                //成功返回数据
                if (data.status == true) {
                    if (data.data) {
                        if (stationCache[BSCD])
                            stationCache[BSCD][resourceID] = data.data;
                        else {
                            var aaa = {};
                            aaa[resourceID] = data.data;
                            stationCache[BSCD] = aaa;
                        }
                        showStationPoint(stationCache[BSCD][resourceID]);
                        handleStations(stationCache[BSCD][resourceID]);
                    } else
                        handleStations(null);
                } else {
                    // alert("该流域下无该类型测站信息");
                    handleStations(null);
                }
            },
            error: function () {
                myChart.hideLoading();
                layer.msg('请选择资源类别')
            }
        });
    }

    //地图上显示测站的点
    function showStationPoint(data) {
        var myStationPointData = new Array();
        $.each(data, function (n, value) {
            myStationPointData.push({
                name: value.stnm,
                value: [value.lgtd, value.lttd]
            });
        });
        myOption.series[0].data = myStationPointData;
        myChart.setOption(myOption);
    }

    function clearSta() {
        showStationPoint('')
    }

    //按照地图区域 修改颜色data
    function convertDataColor(features) {
        if (!features)
            return [];
        var temp = new Array();
        //找到点击区域的详细数据
        features.forEach(function (value, index) {
            temp.push({
                name: value.properties.name,
                value: randomValue()
            });
        });
        return temp;
    }

    //随机数
    function randomValue() {
        return Math.round(Math.random() * 1000);
    }

    form.on('submit(formDemo)', function (data) {
        arr.length = 0;
        console.log(data)
        var che = data.field
        $.each(che, function (i, v) {
            console.log(v)
            arr.push(v + '_' + window.localStorage['sta'])
        });
        console.log(arr)
        $('#station_resourceCodes').val(arr)
        var start = $('#start').val();
        var end = $('#end').val();
        api.getDown($('#station_resourceCodes').val(), start, end, function (data) {
            console.log(data)
            if (data.status == true) {
                var html = '';
                html += '<p class="down_zip clearfloat"> <span><i></i><span class="downname">' + data.data.downloadOrder.downloadFileName + '</span></span> <span class="down_btn"><button class="ass" data-id="' + data.data.downloadOrder.downloadOrderID + '">加入下载清单</button><button class="active" data-id="' + data.data.downloadOrder.downloadOrderID + '" data-uri="' + data.data.downloadOrder.fileUrl + '">立即下载</button></span> </p> <div class="down_name"> <ul class="clearfloat"> <li class="layui-col-md1">项目序号</li> <li class="layui-col-md4">文件名称</li> <li class="layui-col-md1">测站名称</li> <li class="layui-col-md2">资源类别</li> <li class="layui-col-md2">数据开始时间</li> <li class="layui-col-md2">数据结束时间</li> </ul> </div> <div class="down_catalog"> <ul class="clearfloat">';
                $.each(data.data.downloadOrderItems, function (i, v) {
                    i = parseInt(i) + parseInt(1);
                    html += '<li class="layui-col-md1">' + i + '</li><li class="layui-col-md4">' + v.itemName + '</li> <li class="layui-col-md1">' + v.stationName + '</li> <li class="layui-col-md2">' + v.resourceName + '</li> <li class="layui-col-md2">' + v.startDate + '</li> <li class="layui-col-md2">' + v.endDate + '</li>'
                });
                html += '</ul> </div>';
                $('.css').html(html)
            }
            else {
                if (data.data == null) {
                    layer.msg(data.msg)
                }
                else {
                    layer.msg(data.data[0].msg)
                }
                console.log(data.code)
                // alert("请先登录")
            }
        })
        return false;
    })
    //打包下载
    $(document).on('click', '.down_btn .active', function () {
        var downloadOrderID = $(this).attr('data-id');
        var uri = $(this).attr('data-uri');
        var uri = uri.slice(1, uri.length)
        var that = $(this)
        api.zip(downloadOrderID, function (data) {
            if (data.status == true) {
                that.html('打包中...')
                that.attr('disabled', 'disabled')
                var i = setInterval(function progross() {
                    api.progress(downloadOrderID, function (data) {
                        if (data.status == true) {
                            if (data.msg == 100) {
                                window.location.href = url + uri;
                                clearInterval(i);
                                that.html('开始下载')
                                that.removeAttr('disabled')
                            }
                            else {
                            }
                        }
                        else {
                            layer.msg(data.msg)
                        }
                    })
                }, 1000)
            }
            else {
                layer.msg(data.msg)
            }

        })
    })
    //加入购物车
    $(document).on('click', '.down_btn .ass', function () {
        var downloadOrderID = $(this).attr('data-id');
        var that = $(this)
        api.toCart(downloadOrderID, function (data) {
            console.log(data)
            if (data.status = true) {
                layer.msg(data.msg)
                that.remove();
            }
            else {
                layer.msg(data.msg)
            }
        })
    })
//全选反选
    $('.selectall').on('click', function () {
        $(".checkbox input[type='checkbox']").prop("checked", true);
        form.render('checkbox');
    })
    $('.noselect').on('click', function () {
        $("input[type='checkbox']").prop("checked", function (index, attr) {
            return !attr;
        });
        form.render('checkbox');

    })
})

