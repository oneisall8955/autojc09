/**
 * 移动网络小菜单的跳转
 * @param menuName 小菜单的唯一id
 * @param _this 传入当前的 dom
 */
var ussdIntervalId;
function checkNetworkMenu(menuName) {
    checkStatusNormal();
    // 关闭layui的短信展开显示
    layer.close(layer.index);
    // 短信单独状态
    if (menuName === '#msg') {
        // 开关
        if (document.getElementById("smsChildren").style.display === 'block') {
            // 隐藏
            document.getElementById("smsChildren").style.display = 'none';
            document.getElementById("network-msg-img").src = "../images/main/more_nav_arrow_down.png";
        } else {
            // 显示所有子菜单
            document.getElementById("smsChildren").style.display = 'block';
            document.getElementById("network-msg-img").src = "../images/main/more_nav_arrow_up.png";
        }
    } else {
        // 隐藏所有的内容
        hideNetworkRight();

        // 根据不同的 menuName 请求不同的后端接口
        switch (menuName) {
            case '#basic':
                //'后端接口请求'
                document.getElementById("network_basic").className = "network_menu_select";
                document.getElementById("nmBasic").className = "network_menu_text_select";
                document.getElementById("basic").style.display = "block";
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                // networkIntervalId = setInterval('setTimeout("mm_getXMLCfg(\'getMobileCfg\', setNetworkValue)",0)',1000*5);
                // resetNetworkStatusTimeoutId = setTimeout("resetNetworkStatus()",1000*21);
                mm_getXMLCfg("internetconn", setNetworkValue);
                break;
            case '#apn':
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("network_apn").className = "network_menu_select";
                document.getElementById("nmAPN").className = "network_menu_text_select";
                document.getElementById("apn").style.display = "block";
                mm_getXMLCfg("pin_apn_setting", setApnValue);
                break;
            case '#pin':
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("network_pin").className = "network_menu_select";
                document.getElementById("nmPinManage").className = "network_menu_text_select";
                document.getElementById("pin").style.display = "block";
                //mm_getXMLCfg("getPinLock", setPinValue);
                break;
            case '#sm':
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("msg-sm").className = "network_menu_select";
                document.getElementById("nmSendMsg").className = "network_menu_text_select";
                document.getElementById("sm").style.display = "block";
                // smsSend();
                break;
            case '#inbox':
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("msg-inbox").className = "network_menu_select";
                document.getElementById("nmInbox").className = "network_menu_text_select";
                document.getElementById("inbox").style.display = "block";
                selected = [];
                let inboxCount = 0;
                let inboxLimit = 0;
                var inboxUrl = LOCAL_HOST_IP + "jsonp_smsInbox";
                // 单独发送请求获取数据总数
                $.ajax({
                    url: inboxUrl,
                    dataType: "jsonp",
                    data: { pageIndex: 1 },
                    async: false,
                    cache: false,
                    success: function (res) {
                        inboxCount = res.totalRecords;
                        inboxLimit = res.recordsPerpage;
                    }
                })

                layui.use(['table', 'laypage', 'layer'], function () {

                    let table = layui.table;
                    let laypage = layui.laypage;

                    let index = "No."
                    let prev = "Prev"
                    let next = "Next"
                    let sender = "Sender"
                    let content = "Content"
                    let text = "No Message"
                    // 获取当前页面是什么语种
                    if (localStorage.language === "zh_cn") {
                        index = "序号"
                        prev = "上一页"
                        next = "下一页"
                        sender = "发件人"
                        content = "内容"
                        text = "无信息"
                    }

                    //收件箱（表格）
                    function inboxData(page) {
                        console.log("page: " + page);
                        var smsList = [];
                        $.ajax({
                            url: inboxUrl,
                            dataType: "jsonp",
                            data: { pageIndex: page },
                            async: false,
                            cache: false,
                            success: function (res) {
                                var arrayTableData = res["data"];
                                for (var i = 0; i < arrayTableData.length; i++) {
                                    let data = {
                                        "id": i + 1,
                                        "sender": arrayTableData[i].phoneNumber,
                                        "content": arrayTableData[i].smsContent,
                                        "message_id": arrayTableData[i].message_id
                                    }
                                    smsList.push(data);
                                }
                            }
                        })

                        table.render({
                            elem: '#inbox-table'
                            , data: smsList
                            , text: { none: text }
                            , title: 'Inbox'
                            , cols: [[
                                { field: 'id', title: index, width: 60, fixed: 'left' }
                                , { field: 'sender', title: sender, width: 140 }
                                , { field: 'content', title: content }
                                , { type: 'checkbox' }
                            ]]
                            , done: function (res) {
                            }
                        });

                        table.on('checkbox(inbox)', function (obj) {
                            selected = table.checkStatus('inbox-table').data;
                        });
                    }
                    //收件箱（分页）
                    laypage.render({
                        elem: 'inboxLimit'
                        , limit: inboxLimit
                        , count: inboxCount
                        , first: false
                        , last: false
                        , prev: prev                 //上一页文本
                        , next: next                 //下一页文本
                        , jump: function (obj, first) {
                            inboxData(obj.curr)
                        }
                    });
                });
                break;
            case '#outbox':
                clearInterval(networkIntervalId);
                clearInterval(ussdIntervalId);
                clearTimeout(resetNetworkStatusTimeoutId);
                // document.getElementById("msg-outbox").className = "network_menu_select";
                // document.getElementById("nmOutbox").className = "network_menu_text_select";
                document.getElementById("outbox").style.display = "block";
                let outboxCount = 0;
                var outBoxUrl = LOCAL_HOST_IP + "smsOutbox" + "&cur_time=" + new Date().getTime();
                // 单独发送请求获取数据总数
                $.ajax({
                    url: outBoxUrl,
                    dataType: "jsonp",
                    data: { page: 1 },
                    async: false,
                    cache: false,
                    success: function (res) {
                        outboxCount = res.totalCount;
                    }
                })
                layui.use(['table', 'laypage', 'layer'], function () {

                    let table = layui.table;
                    let laypage = layui.laypage;

                    let prev = "Prev"
                    let next = "Next"
                    let recipient = "receiver"
                    let content = "Content"
                    let text = "No Message"
                    // 获取当前页面是什么语种
                    if (localStorage.language === "zh_cn") {
                        prev = "上一页"
                        next = "下一页"
                        recipient = "收件人"
                        content = "内容"
                        text = "无信息"
                    }

                    //发件箱（表格）
                    function outboxData(page) {
                        table.render({
                            elem: '#outbox-table'
                            , url: outBoxUrl
                            , method: "post"
                            , where: {
                                page: page
                            }
                            , text: { none: text }
                            , title: 'Outbox'
                            , cols: [[
                                { field: 'id', title: '', width: 50, fixed: 'left' }
                                , { field: 'receiver', title: recipient, width: 140 }
                                , { field: 'content', title: content }
                            ]]
                            , parseData: function (res) { //将原始数据解析成 table 组件所规定的数据
                                // 自增加id
                                if (res.currentPage) {
                                    for (let i = 1; i <= res.currentPage.length; i++) {
                                        res.currentPage[i - 1].id = (page - 1) * 10 + i
                                    }
                                }
                                return {
                                    "code": 0, //解析接口状态
                                    "data": res.currentPage
                                };
                            }
                        });
                    }
                    //发件箱（分页）
                    laypage.render({
                        elem: 'outboxLimit'
                        , limit: 10
                        , count: outboxCount
                        , first: false
                        , last: false
                        , prev: prev                 //上一页文本
                        , next: next                 //下一页文本
                        , jump: function (obj) {
                            outboxData(obj.curr)
                        }
                    });
                });
                break;
            case '#esim':
                document.getElementById("network_esim").className = "network_menu_select";
                document.getElementById("nmESIM").className = "network_menu_text_select";
                document.getElementById("esim").style.display = "block";
                mm_getXMLCfg("esim_status", getESIMStatus);
                break;
            case '#ussd':
                clearInterval(networkIntervalId);
                clearInterval(ussdIntervalId);
                clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("network_ussd").className = "network_menu_select";
                document.getElementById("nmUSSD").className = "network_menu_text_select";
                document.getElementById("ussd").style.display = "block";
                // mm_getXMLCfg("getUssdReply", getUssdReply);
                // ussdIntervalId = setInterval('setTimeout("mm_getXMLCfg(\'getUssdReply\', getUssdReply)",0)',1000*5);
                // setTimeout("clearInterval(ussdIntervalId)",1000*31)
                break;
            case '#sum':
                //clearInterval(networkIntervalId);
                //clearInterval(ussdIntervalId);
                //clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("network_sum").className = "network_menu_select";
                document.getElementById("nmMobileCounter").className = "network_menu_text_select";
                document.getElementById("sum").style.display = "block";
                mm_getXMLCfg("datausagestatus", dataLimitGet);
                break;
            case '#ping':
                document.getElementById("network_ping").className = "network_menu_select";
                document.getElementById("nmPing").className = "network_menu_text_select";
                document.getElementById("ping").style.display = "block";
                break;

            case '#sim_id':
                // clearInterval(networkIntervalId);
                // clearInterval(ussdIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                document.getElementById("network_simid").className = "network_menu_select";
                document.getElementById("nmSimid").className = "network_menu_text_select";
                document.getElementById("simid").style.display = "block";
                mm_getXMLCfg("dual_esim_get", setSimIdValue);
                break;

            case "#wifi_menu_phonebook":
	            document.getElementById("wifi_menu_phonebook").className = "network_menu_select";
	            document.getElementById("wifi_text_phonebook").className = "network_menu_text_select";
	            document.getElementById("phonebook_page").style.display = "flex";
	            mm_getXMLCfg("phonebook_get_query?pageIndex=1", phonebook_callback);
	            //phonebook_callback();
	            //setClientsText();
            break;
            // case ...
        }
    }
}

function checkStatusNormal() {
    document.getElementById("network_basic").className = "network_menu_normal";
    document.getElementById("network_apn").className = "network_menu_normal";
    document.getElementById("network_pin").className = "network_menu_normal";
    document.getElementById("sms").className = "network_menu_normal";
    document.getElementById("msg-sm").className = "network_menu_normal2";
    document.getElementById("msg-inbox").className = "network_menu_normal2";
    // document.getElementById("msg-outbox").className = "network_menu_normal2";
    document.getElementById("network_ussd").className = "network_menu_normal";
    document.getElementById("network_esim").className = "network_menu_normal";
    // document.getElementById("network_sum").className = "network_menu_normal";
    document.getElementById("network_ping").className = "network_menu_normal";
    document.getElementById("network_simid").className = "network_menu_normal";
    document.getElementById("network_sum").className = "network_menu_normal";
    document.getElementById("wifi_menu_phonebook").className = "network_menu_normal";
    document.getElementById("nmBasic").className = "network_menu_text_normal";
    document.getElementById("nmAPN").className = "network_menu_text_normal";
    document.getElementById("nmPinManage").className = "network_menu_text_normal";
    document.getElementById("nmSMS").className = "network_menu_text_normal";
    document.getElementById("nmSendMsg").className = "network_menu_text_normal";
    document.getElementById("nmInbox").className = "network_menu_text_normal";
    // document.getElementById("nmOutbox").className = "network_menu_text_normal";
    document.getElementById("nmESIM").className = "network_menu_text_normal";
    document.getElementById("nmUSSD").className = "network_menu_text_normal";
    document.getElementById("nmMobileCounter").className = "network_menu_text_normal";
    document.getElementById("nmPing").className = "network_menu_text_normal";
	document.getElementById("nmSimid").className = "network_menu_text_normal";
    document.getElementById("wifi_text_phonebook").className = "network_menu_text_normal";
}

function hideNetworkRight() {
    document.getElementById("basic").style.display = "none";
    document.getElementById("apn").style.display = "none";
    document.getElementById("pin").style.display = "none";
    document.getElementById("sm").style.display = "none";
    document.getElementById("inbox").style.display = "none";
    document.getElementById("outbox").style.display = "none";
    document.getElementById("esim").style.display = "none";
    document.getElementById("ussd").style.display = "none";
    document.getElementById("sum").style.display = "none";
    document.getElementById("ping").style.display = "none";
	document.getElementById("simid").style.display = "none";
    document.getElementById("phonebook_page").style.display = "none";
}

var sim_exist = 0;
function getESIMStatus(content) {
    var xml = content;
    console.log("getESIMStatus xml:", xml);

    let esimEnable = $(xml).find("esimEnable").text();
    sim_exist = parseInt($(xml).find("issim").text());
    console.log("esimEnable: ", esimEnable);

    if (esimEnable === "1") {
        // 开关开启
        console.log("set esimStatus true");
        document.getElementById("esimStatus").checked = true;
    } else {
        // 关闭开关
        console.log("set esimStatus false");
        document.getElementById("esimStatus").checked = false;
    }
}
function esim_changed() {
    console.log("sim_exist：" + sim_exist);
    if (0 == sim_exist) {
        alert(I18N("j", "noExtendSIM"));
        document.getElementById("esimStatus").checked = true;
        return
    }
    let esimEnable = document.getElementById("esimStatus").checked ? 1 : 0;
    console.log("esim_changed esimEnable = ", esimEnable);

    var esim_enable_param =
    {
        "esimEnable": esimEnable
    }
    console.log("esim_changed json: ", JSON.stringify(esim_enable_param));

    var url = LOCAL_HOST_IP + "esim_enable";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { esim_enable_param: JSON.stringify(esim_enable_param) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            var obj = content;
            console.log("esim_changed obj: " + JSON.stringify(obj));
            var state = obj.state;
            console.log("esim_changed state: " + state);
            if (state === 1) {
                // mm_getXMLCfg("esim_status", getESIMStatus);
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
                mm_getXMLCfg("esim_status", getESIMStatus);
            }
        }
    });
}

var portIndexOpen;
function sim_switch_passwd() {
    portIndexOpen = layer.open({
        type: 1,
        title: [I18N("j", "sim_passwd_toast"),'font-size: 21px;font-weight:550;padding: 0px;text-align: center;'],
        area: ['660px', '200px'],
        offset:'150px',
        content: $('#sim_switch_passwd'),
        cancel: function(){
            document.getElementById("sim_switch_passwd").style.display = "none";
            mm_getXMLCfg("esim_status", getESIMStatus);
        }
    });
}

function sim_passwd_cancel() {
    layer.close(portIndexOpen);
    document.getElementById("sim_passwd_input").value = "";
    document.getElementById("sim_switch_passwd").style.display = "none";
    mm_getXMLCfg("esim_status", getESIMStatus);
}

function sim_passwd_set() {
    var mexport = $('#sim_passwd_input').val();

    var sim_switch_param =
    {
        "password": mexport
    }
    console.log("esim_changed json: ", JSON.stringify(sim_switch_param));

    // 密码应该由设备端校验
    var url = LOCAL_HOST_IP + "sim_switch_password";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { sim_switch_param: JSON.stringify(sim_switch_param) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            var xml = content;
            console.log("dataLimitGet xml:", xml);

            let SwitchKey = $(xml).find("SwitchKey").text();
            console.log("SwitchKey: " + SwitchKey);
            // if (hex_md5(mexport) == SwitchKey) {
            if("1"==="1") {
                esim_changed();
            } else {
                alert(I18N("j", "setFail"));
                mm_getXMLCfg("esim_status", getESIMStatus);
            }
        }
    });

    document.getElementById("sim_passwd_input").value = "";

    layer.close(portIndexOpen);
    document.getElementById("sim_switch_passwd").style.display = "none";
}


//流量控制页面数据获取回调
function dataLimitGet(content) {
    var xml = content;
    console.log("dataLimitGet xml:", xml);

    let dataUsed = $(xml).find("totalUsed").text();
    let dataLimit = $(xml).find("dataLimit").text();
    let dataLimitEnabled = $(xml).find("allowanceData").text();

    setLabelValue("nDataUsed", dataUsed + "MB");
    $("#nDataLimit").val(dataLimit);

    // 获取开关的dom
    let dataLimitSwitch = $("#nDataLimitEnabled").next();
    if (dataLimitEnabled == 1) {
        // 开关开启
        dataLimitSwitch[0].className = "layui-unselect layui-form-switch layui-form-onswitch";
        dataLimitSwitch.children()[0].innerHTML = "ON";
        document.getElementById("nDataLimitEnabled").checked = true;
    } else {
        // 关闭开关
        dataLimitSwitch[0].className = "layui-unselect layui-form-switch";
        dataLimitSwitch.children()[0].innerHTML = "OFF";
        document.getElementById("nDataLimitEnabled").checked = false;
    }
}

function dataUsedGet(content) {
    var xml = content;
    console.log("dataUsedGet xml:", xml);
    let dataUsed = $(xml).find("totalUsed").text();
    setLabelValue("nDataUsed", dataUsed + "MB");
}

//流量控制页面数据上传
function dataLimitSet() {
    let dataLimit = parseInt($("#nDataLimit").val());
    let dataLimitEnabled;

    if (window.isNaN(dataLimit) || dataLimit == 0) {
        alert(I18N("j", "limitNumErr"));
        return;
    }

    if ($('#nDataLimitEnabled').is(':checked')) {
        dataLimitEnabled = 1;
    } else {
        dataLimitEnabled = 0;
    }

    var data_usage_param =
    {
        "allowanceData": dataLimitEnabled,
        "dataLimit": dataLimit
    }

    var url = LOCAL_HOST_IP + "jsonp_datausage_set";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { data_usage_param: JSON.stringify(data_usage_param) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            console.log("issucess state " + content);
            var obj = content;
            console.log("state " + JSON.stringify(obj));
            var state = obj.state;
            console.log("state " + state);
            if (state == 1) {
                mm_getXMLCfg("datausagestatus", dataLimitGet);
                // networkIntervalId = setInterval('setTimeout("mm_getXMLCfg(\'getMobileCfg\', setNetworkValue)",0)',1000*5);
                // resetNetworkStatusTimeoutId = setTimeout("resetNetworkStatus()",1000*21);
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
            }
        }
    });

}

function dataClear() {
    var url = LOCAL_HOST_IP + "jsonp_datausage_clean";
    $.ajax({
        url: url,
        dataType: "jsonp",
        //data: { data_usage_param: JSON.stringify(data_usage_param) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            console.log("issucess state " + content);
            var obj = content;
            console.log("state " + JSON.stringify(obj));
            var state = obj.state;
            console.log("state " + state);
            if (state == 1) {
                mm_getXMLCfg("datausagestatus", dataUsedGet);
            } else {
                alert(I18N("j", "setFail"));
            }
        }
    });
}

// sms发送短信
function smsSend() {
    var receiver = $("#nFillRecipient")[0].value;
    var content = $("#nEnterMsg")[0].value;

    if (!isMobileNum(receiver)) {
        alert(I18N("j", "mobileNumErr"));
        return;
    }

    console.log("content.length:" + content.length);
    if (content.length == 0 || content.length > 160) {
        alert(I18N("j", "smsgLength"));
        return;
    }

    var sms = {
        "phone_number": receiver,
        "content": content
    }
    //var wanPram = "wanCfg="+JSON.stringify(wanCfg);
    var url = LOCAL_HOST_IP + "sendMSG";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { sendMSG: JSON.stringify(sms) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            var obj = content;
            var state = obj.state;
            if (state === 1) {
                alert(I18N("j", "sendSuccess"));
                $("#nFillRecipient").val("");
                $("#nEnterMsg").val("");
            } else {
                alert(I18N("j", "sendFail"));
            }
        }
    });
}

//apn页面数据获取回调
function setApnValue(content) {
    var xml = content;
    console.log("setApnValue xml:", xml);

    $("#apn_apn").val($(xml).find("mApnapn").text());
    $("#apn_type").val($(xml).find("mApntype").text());
    $("#apn_username").val($(xml).find("mApnuser").text());
    $("#apn_password").val($(xml).find("mApnpassword").text());
    $("#apn_authType").val(parseInt($(xml).find("mAuthtype").text()));
    $("#apn_normalProtocal").val(parseInt($(xml).find("mApnprotocol").text()));
    $("#apn_roamingProtocal").val(parseInt($(xml).find("mApnprotocol").text()));
}

function checkAPNInput(input, name) {
    if (input === "") {
        alert(name + I18N("j", "inputEmpty"));
        return false;
    }

    if (input.indexOf(" ") !== -1) {
        alert(name + I18N("j", "inputSpace"));
        return false;
    }

    if (!checkword(input) || (input.indexOf("\"") !== -1) || (input.indexOf("\'") !== -1)) {
        alert(name + I18N("j", "inputCharacters"));
        return false;
    }

    if (input.length > 32 || input.length < 1) {
        alert(name + I18N("j", "inputLength"));
        return false;
    }

    return true;
}

//apn页面数据上传
function sendApn() {
    var apn = $("#apn_apn").val();
    var apnType = $("#apn_type").val();
    var user = $("#apn_username").val();
    var password = $("#apn_password").val();
    var authType = $("#apn_authType").val();
    var normalProtocol = $("#apn_normalProtocal").val();
    var roamingProtocol = $("#apn_roamingProtocal").val();

    if (!checkAPNInput(apn, I18N("j", "nAPN"))) {
        return false;
    }
    if (!checkAPNInput(apnType, I18N("j", "nAPNType"))) {
        return false;
    }

    if(authType==="0"){
        console.log("no need user pwd,authType is:",authType);
    }

    if (apn === "" || apnType === "") {
        alert(I18N("j", "unfilledData"));
        return false;
    }

    var apnParam = {
        "apn": apn,
        "apnType": apnType,
        "user": user,
        "password": password,
        "authType": parseInt(authType),
        "normalProtocol": parseInt(normalProtocol),
        "roamingProtocol": parseInt(roamingProtocol)
    }
    //var wanPram = "wanCfg="+JSON.stringify(wanCfg);
    var url = LOCAL_HOST_IP + "sendApn";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { apnParam: JSON.stringify(apnParam) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            console.log("issucess state " + content);
            var obj = content;
            console.log("state " + JSON.stringify(obj));
            var state = obj.state;
            console.log("state " + state);
            if (state === 1) {
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
            }
        }
    });
}

function chancleApn() {
    mm_getXMLCfg("pin_apn_setting", setApnValue);
}

//PIN管理页面数据获取回调
function setPinValue(content) {
    var xml = content;
    console.log("setApnValue xml:", xml);

    var pinLock = xml["pinLock"];

    // 获取开关的dom
    let pinLockSwitch = $("#pinLock").next();
    if (pinLock === 1) {
        // 开关开启
        pinLockSwitch[0].className = "layui-unselect layui-form-switch layui-form-onswitch";
        pinLockSwitch.children()[0].innerHTML = "ON";
        document.getElementById("pinLock").checked = true;
    } else {
        // 关闭开关
        pinLockSwitch[0].className = "layui-unselect layui-form-switch";
        pinLockSwitch.children()[0].innerHTML = "OFF";
        document.getElementById("pinLock").checked = false;
    }
}

//PIN管理页面数据上传
function unlockPin() {
    var PINNum = $("#pin_num").val();

    if (PINNum === "") {
        alert(I18N("j", "pinEmpty"));
        return false;
    }

    var pin = {
        "pin": PINNum.toString(),
    }
    //var wanPram = "wanCfg="+JSON.stringify(wanCfg);
    var url = LOCAL_HOST_IP + "unlockPin";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { pin: JSON.stringify(pin) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        /*
        success: function (content) {
            var state = content.state;
            if (state === 1) {
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
            }
        }*/
        success: function (data) {
            var ret = $(data).find("result").text();
            var remaining = $(data).find("remaining").text();

            switch (ret) {
                case '-1' :
                    alert(I18N("j", "setFail"));
                    break;
                case '0' :
                    alert(I18N("j", "pinError", remaining));
                    break;
                case '1' :
                    alert(I18N("j", "setSuccess"));
                    break;
                case '2' :
                    alert(I18N("j", "nPinNoLock"));
                    break;
            }
        }
    });
}

function chanclePin() {
    $("#pin_num").val("");
    mm_getXMLCfg("getPinLock", setPinValue);
}

//USSD页面数据上传
function sendUssd() {
    var ussdCode = $("#nUssdCode").val();

    if (ussdCode.length < 3 || ussdCode.length > 16) {
        alert(I18N("j", "ussdCodeErr"));
        return false;
    }

    var ussdParam = {
        "ussd_number": ussdCode.replace('/#/g', "%23")
    }
    //var wanPram = "wanCfg="+JSON.stringify(wanCfg);
    var url = LOCAL_HOST_IP + "ussdsend";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { ussd_param: JSON.stringify(ussdParam) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        // success: function (content) {
        //     console.log("issucess state " + content);
        //     var obj = content;
        //     console.log("state " + JSON.stringify(obj));
        //     var state = obj.state;
        //     console.log("state " + state);
        //     if (state === 1) {
        //         clearInterval(ussdIntervalId);
        //         mm_getXMLCfg("ussdback", getUssdReply);
        //         ussdIntervalId = setInterval('setTimeout("mm_getXMLCfg(\'getUssdReply\', getUssdReply)",0)', 1000 * 5);
        //         setTimeout("clearInterval(ussdIntervalId)", 1000 * 31)
        //         alert(I18N("j", "setSuccess"));
        //     } else {
        //         alert(I18N("j", "setFail"));
        //     }
        // }
        success: function (content) {
            console.log("ussd send : " + content);
            var ret = $(content).find("ussdResult").text();
            setLabelValue("ussdReply", ret.toString());
        }
    });
}

//获取USSD信息回调
function getUssdReply(content) {
    var xml = content;
    console.log("getUssdReply xml:", xml);

    var ussdReply = xml["ussdResult"];
    setLabelValue("ussdReply", ussdReply.toString());
}

var selected = [];
function deleteSms() {
    console.log("delete sms: " + selected.length);

    if (selected.length > 0) {
        var deleteList = new Array();
        for (let i = 0; i < selected.length; i++) {
            let param = {
                "id": selected[i].message_id
            }
            deleteList.push(param);
        }
        console.log(deleteList);

        var data = { "data": deleteList };

        $.ajax({
            url: LOCAL_HOST_IP + "DeleteList",
            dataType: "jsonp",
            data: { deleList: JSON.stringify(data) },
            async: false,
            cache: false,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                xhr.setRequestHeader("Expires", "-1");
                xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
                xhr.setRequestHeader("Pragma", "no-cache");
            },
            success: function (data) {
                if (data.state === 1) {
                    alert(I18N("j", "deleteSuccess"));
                    checkNetworkMenu("#inbox");
                } else {
                    alert(I18N("j", "deleteFail"));
                }
            }
        });
        selected = [];
    } else {
        console.log("no selected");
    }
};

function pingCheck() {
    $.ajax({
        url: LOCAL_HOST_IP + "jsonp_ping_check",
        dataType: "jsonp",
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (data) {
            var ret = $(data).find("result").text();
            switch (ret) {
                case '0' :
                    alert(I18N("j", "nPing4G"));
                    break;
                case '1' :
                    alert(I18N("j", "nPingChange4G"));
                    break;
                case '2' :
                    alert(I18N("j", "nPing5G"));
                    break;
                case '3' :
                    alert(I18N("j", "noSIM"));
                    break;
            }
        }
    });
}

function setSimIdValue(content) {
    var xml = content;
	console.log("setSimIdValue xml:", xml);
	var simindex=$(xml).find("simid").text();
	var simint=parseInt($(xml).find("simid").text());
	console.log("setSimIdValue simindex:", simindex);
	console.log("setSimIdValue simint:", simint);
    //$("#net_simid").val(simint);
    $("#net_simid").val(simint);
//$(document).ready(function () {
//	console.log("setSimIdValue ready simindex:", simindex);
//		$("#net_simid").val(simint);
 //   })

}

function setSimId() {
    var id = $("#net_simid").val();
	console.log("setSimId,id:", id);
    var setId = {
        "simid": parseInt(id),
    }
    //var wanPram = "wanCfg="+JSON.stringify(wanCfg);
    var url = LOCAL_HOST_IP + "jsonp_dual_esim_set";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { set_id: JSON.stringify(setId) },
        async: false,
        cache: false,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
            xhr.setRequestHeader("Expires", "-1");
            xhr.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            xhr.setRequestHeader("Pragma", "no-cache");
        },
        success: function (content) {
            console.log("issucess state " + content);
            var obj = content;
            console.log("state " + JSON.stringify(obj));
            var state = obj.state;
            console.log("state " + state);
            if (state === 1) {
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
            }
        }
    });
}

var curpageClient = 1;
var totalpageClient = 1;
var select_index=0;
function switchPhonebookPage(flag) {
    let wifitype;
    if (DISPLAY_WIFI_2G == "block" && DISPLAY_WIFI_5G == "block") {
        wifitype = 2;
    } else if (DISPLAY_WIFI_5G == "block") {
        wifitype = 1;
    } else {
        wifitype = 0;
    }

    let pageIndex = curpageClient;
    if (flag == 0) {
        if (pageIndex > 1) {
            pageIndex--;
        } else {
            pageIndex = 1;
        }
    } else {
        if (pageIndex < totalpageClient) {
            pageIndex++;
        } else {
            pageIndex = totalpageClient;
        }
    }

    mm_getXMLCfg("phonebook_get_query?pageIndex=" + pageIndex, phonebook_callback);
}
function phonebook_add_callback(data)
{
	var xml = data;
	console.log("phonebook_add_callback xml:", xml);
	var statuss = xml["status"];
	mm_getXMLCfg("phonebook_get_query?pageIndex="+totalpageClient, phonebook_callback);
}
function phonebook_update_callback(data)
{
	var xml = data;
	console.log("phonebook_update_callback xml:", xml);
	var statuss = xml["status"];
	mm_getXMLCfg("phonebook_get_query?pageIndex="+curpageClient, phonebook_callback);
}
function pb_table_click()
{
	var td = event.srcElement;
	var line=td.parentElement.parentElement.rowIndex;
	var index=td.parentElement.cellIndex;
	console.log("pb_table_click:"+line+"/"+index);
	select_index=line;
	//$(this).parent
}
function phonebook_callback(data) {
    var xml = data;
    console.log("phonebook_callback xml:", xml);
    //xml = JSON.parse('{"curPage":1,"startRowNum":1,"endRowNum":4,"recordsPerpage":5,"totalPage":2,"totalRecords":3,"data":[{"name":"jack","number":"13918345010"},{"name":"jack","number":"13918345010"}]}');
    var arrayTableData = xml["data"];
    curpageClient = xml["curPage"];
    totalpageClient = xml["totalPage"];
    var tableConnectedDevice = document.getElementById('tableConnectedDevice');
    var tBodytableConnectedDevice = tableConnectedDevice.getElementsByTagName('tbody')[0];
    clearTabaleRows('tableConnectedDevice');

    if (arrayTableData.length === 0) {
        var row1 = tBodytableConnectedDevice.insertRow(0);
        var rowCol1 = row1.insertCell(0);
        rowCol1.colSpan = 7;
        rowCol1.innerHTML = I18N("j", "ltEmpty");
    } else {
        for (var i = 0; i < arrayTableData.length; i++) {
            var trow = getPbDataRow(arrayTableData[i], i); //定义一个方法,返回tr数据
            tBodytableConnectedDevice.appendChild(trow);
        }
    }

    document.getElementById('clientIndex').innerHTML = curpageClient + "/" + totalpageClient;
}

function getPbDataRow(data, i) {
    var row = document.createElement('tr'); //创建行

    var idCell = document.createElement('td'); //创建第一列id
    idCell.innerHTML = i + 1; //填充数据
    row.appendChild(idCell); //加入行  ，下面类似

    var nameCell = document.createElement('td');//创建第三列ip
    nameCell.innerHTML = data.name;
    row.appendChild(nameCell);

    var numCell = document.createElement('td');//创建第三列mac
    numCell.innerHTML = data.number;
    row.appendChild(numCell);

	//var board = document.getElementById("board");
	var actionCell = document.createElement("td");
    var btn1 = document.createElement("img");
    btn1.type = "button";
    btn1.value = "12";
	btn1.src="../images/mobile/icon_edit.png"
	btn1.onclick=btn1click;
	var btn2 = document.createElement("img");
	btn2.type = "button";
    btn2.value = "34";
	btn2.src="../images/mobile/icon_delete.png"
	btn2.onclick=btn2click;

    var object = actionCell.appendChild(btn1);
	var object2 = actionCell.appendChild(btn2);
	row.appendChild(actionCell);
    return row;
}

function btn1click(){
	console.log("btn1click");
	document.getElementById("update_pb").style.display="block";
}

function saveUpdate(){
	//var pageindex=parseInt(curpageClient)-1;
	var index=(curpageClient-1)*5+select_index-1;
	console.log("saveUpdate,index="+index);
	var name=document.getElementById("update_name").value;
	var number=document.getElementById("update_number").value;

	if ($.trim(name) === "") {
	    alert(I18N("j", "nameError"));
	    return false;
    }
	if ($.trim(number) === "") {
	    alert(I18N("j", "numberError"));
	    return false;
    }

	var data_send='{"updateIndex":'+index+',"data":{"name":"'+name+'","number":"'+number+'"}}';
	mm_getXMLCfg("phonebook_update_query?updateOne="+data_send, phonebook_update_callback);
	document.getElementById("update_pb").style.display="none";
}

function cancelUpdate(){
	console.log("cancelUpdate");
	document.getElementById("update_pb").style.display="none";
}
function phonebook_delete_callback(data)
{
	var xml = data;
	console.log("phonebook_delete_callback xml:", xml);
	var statuss = xml["status"];
	mm_getXMLCfg("phonebook_get_query?pageIndex="+curpageClient, phonebook_callback);
}
function saveDelete(){
	//var pageindex=parseInt(curpageClient)-1;
	var index=(curpageClient-1)*5+select_index-1;
	console.log("saveDelete,index="+index);
	var data_send='[{"id":'+index+'}]';
	mm_getXMLCfg("phonebook_delete_query?deleteIndex="+data_send, phonebook_delete_callback);
	document.getElementById("delete_pb").style.display="none";
}

function cancelDelete(){
	console.log("cancelDelete");
	document.getElementById("delete_pb").style.display="none";
}
function btn2click(){
	console.log("btn2click");
	document.getElementById("delete_pb").style.display="block";
}

function saveAdd(){
	console.log("saveAdd");
	var name=document.getElementById("add_name").value;
	var number=document.getElementById("add_number").value;
    if ($.trim(name) === "") {
        alert(I18N("j", "nameError"));
        return false;
    }
    if ($.trim(number) === "") {
        alert(I18N("j", "numberError"));
        return false;
    }
	var data_send='{"name":"'+name+'","number":"'+number+'"}';
	mm_getXMLCfg("phonebook_add_query?addOne="+data_send, phonebook_add_callback);
	document.getElementById("add_pb").style.display="none";
}

function cancelAdd(){
	console.log("cancelAdd");
	document.getElementById("add_pb").style.display="none";
}

function  pbOneAdd(){
	console.log("pbOneAdd");
	document.getElementById("add_pb").style.display="block";
}
