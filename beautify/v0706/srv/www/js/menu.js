/**
 * Content块跳转
 * @param htmlPath 跳转指定的html  例如： /html/home.html
 * @param _this 当前的 document 对象
 */
function checkContentHtml(htmlPath, _this) {
    /* 思路：
     * 1、先改变图标颜色
     * 2、然后重新渲染content页面
     */

    // 目前选中的 document 对象
    var select = $(".menu_select")[0];
    // 背景样式
    select.className = 'menu_normal'
    _this.className = 'menu_select'
    // 图片地址
    select.children[0].src = select.children[0].src.replace('select', 'normal')
    _this.children[0].src = _this.children[0].src.replace('normal', 'select')
    // 字体颜色
    select.children[1].className = 'menu_text_normal'
    _this.children[1].className = 'menu_text_select'

    _xmlName = htmlPath;
    checkHtml(htmlPath);
}

function checkMainHtml(htmlPath) {
    var loginStatus = sessionStorage.getItem("loginStatus");
    console.log("checkMainHtml loginStatus=", loginStatus);
    if (loginStatus != "login") {
        self.location.href = "error.html";
        return;
    }

    // 关闭layui的短信展开显示
    layer.close(layer.index);
    switch (htmlPath) {
        case "home":
            setMenuNormal();
            document.getElementById("menu_home").className = "menu_select";
            document.getElementById("text_home").className = "menu_text_select";
            document.getElementById("img_home").src = "../images/main/nav_home_select.png";
            break;
        case "internet":
            setMenuNormal();
            document.getElementById("menu_internet").className = "menu_select";
            document.getElementById("text_internet").className = "menu_text_select";
            document.getElementById("img_internet").src = "../images/main/nav_internet_select.png";
            break;
        case "wifi":
            setMenuNormal();
            document.getElementById("menu_wifi").className = "menu_select";
            document.getElementById("text_wifi").className = "menu_text_select";
            document.getElementById("img_wifi").src = "../images/main/nav_wifi_select.png";
            break;
        case "network":
            /*if (mobileProvider === "NO SIM") {
                alert(I18N("j", "noSIM"));
                return;
            }*/
            /*if (mobileProvider === "NO Service") {
                alert(I18N("j", "noService"));
                return;
            }*/
            setMenuNormal();
            document.getElementById("menu_network").className = "menu_select";
            document.getElementById("text_network").className = "menu_text_select";
            document.getElementById("img_network").src = "../images/main/nav_mobile_network_select.png";
            break;
        case "lan":
            setMenuNormal();
            document.getElementById("menu_lan").className = "menu_select";
            document.getElementById("text_lan").className = "menu_text_select";
            document.getElementById("img_lan").src = "../images/main/nav_internet_select.png";
            break;
        case "clientList":
            setMenuNormal();
            document.getElementById("menu_terminal").className = "menu_select";
            document.getElementById("text_terminal").className = "menu_text_select";
            document.getElementById("img_terminal").src = "../images/main/nav_terminal_select.png";
            break;
        case "settings":
            setMenuNormal();
            document.getElementById("menu_setting").className = "menu_select";
            document.getElementById("text_settings").className = "menu_text_select";
            document.getElementById("img_settings").src = "../images/main/nav_settings_select.png";
            break;
    }
    _xmlName = htmlPath;
    // localStorage.setItem('xmlName', _xmlName);
    checkHtml(htmlPath);
}

var homeIntervalId;
var clientIntervalId;
var networkIntervalId;
var resetNetworkStatusTimeoutId;
function checkHtml(htmlName) {
    var loginStatus = sessionStorage.getItem("loginStatus");
    console.log("checkHtml loginStatus=", loginStatus);
    if (loginStatus != "login") {
        self.location.href = "error.html";
        return;
    }

    // 重新渲染content页面
    $("#Content").html($.ajax({
        type: "GET",
        url: window.location.origin + "/html/" + htmlName + ".html",
        dataType: "html",
        timeout: 30000,
        async: false,
        error: function() {
            console.log("checkHtml error");
            logOut();
        }
    }).responseText)
    // document.getElementById('Content').innerHTML = "";
    // document.getElementById('Content').innerHTML = callProductHTML("html/"+htmlName+".html");
    _xmlName = htmlName;
    // localStorage.setItem('xmlName', _xmlName);

    if ("" == DEFAULT_TITLE_LOGO_IMG) {
        document.getElementById("titleLogo").style.display = "none";
    } else {
        document.getElementById("titleLogo").src = DEFAULT_TITLE_LOGO_IMG;
        document.getElementById("titleLogo").style.display = "block";
    }
    document.getElementById("mTitle").innerHTML = I18N("j", "lRouter");
    document.getElementById("mWizard").innerHTML = I18N("j", "mWizard");
    document.getElementById("mLogOut").innerHTML = I18N("j", "mLogOut");
    document.getElementById("text_home").innerHTML = I18N("j", "mHome");
    document.getElementById("text_internet").innerHTML = I18N("j", "mInternet");
    document.getElementById("text_wifi").innerHTML = I18N("j", "mWifi");
    document.getElementById("text_network").innerHTML = I18N("j", "mNetwork");
    document.getElementById("text_lan").innerHTML = I18N("j", "mLan");
    document.getElementById("text_terminal").innerHTML = I18N("j", "mClients");
    document.getElementById("text_settings").innerHTML = I18N("j", "mMore");

    stone_getXMLCfg('battery_level', refreshBattery);

    //调用接口获取数据
    switch (htmlName) {
        case "home":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            var wifi_type = 0;
            if (DISPLAY_WIFI_2G == "block" && DISPLAY_WIFI_5G == "block") {
                wifi_type = 2;
            } else if (DISPLAY_WIFI_5G == "block") {
                wifi_type = 1;
            } else {
                wifi_type = 0;
            }
            $.ajax({
                type: "GET",
                'beforeSend': function (xhr) {
                    xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                },
                url: LOCAL_HOST_IP + 'jsonp_home_info',
                dataType: "jsonp",
                data: { wifi_type: wifi_type },
                async: false,
                success: function (data) {
                    setDashboardValue(data);
                },
                error: function() {
                    console.log("checkHtml home error");
                    logOut();
                }
            });
            // homeIntervalId = setInterval('setTimeout("stone_getXMLCfg(\'dashboard\', setDashboardValue)",0)',1000*10);
            setHomeText();
            break;
        case "internet":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            $.ajax({
                type: "GET",
                'beforeSend': function (xhr) {
                    xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                },
                url: LOCAL_HOST_IP + 'ethernet_get',
                dataType: "jsonp",
                data: { act_mode: SWITCH_WIFI_2G },
                async: false,
                success: function (data) {
                    setInternetValue(data);
                },
                error: function() {
                    console.log("checkHtml internet error");
                    logOut();
                }
            });
            setInternetText();
            break;
        case "wifi":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            if (DISPLAY_WIFI_2G == "block") {
                $.ajax({
                    type: "GET",
                    'beforeSend': function (xhr) {
                        xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                    },
                    url: LOCAL_HOST_IP + 'jsonp_24g_wifi_info',
                    dataType: "jsonp",
                    data: { act_mode: SWITCH_WIFI_2G },
                    async: false,
                    success: function (data) {
                        getTmpData2G(data);
                        setWifiInfo(data, 0);
                    },
                    error: function() {
                        console.log("checkHtml DISPLAY_WIFI_2G error");
                        logOut();
                    }
                });
            }
            if (DISPLAY_WIFI_5G == "block") {
                $.ajax({
                    type: "GET",
                    'beforeSend': function (xhr) {
                        xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
                    },
                    url: LOCAL_HOST_IP + 'jsonp_5g_wifi_info',
                    dataType: "jsonp",
                    data: { act_mode: SWITCH_WIFI_5G },
                    async: false,
                    success: function (data) {
                        getTmpData5G(data);
                        setWifiInfo(data, 1);
                    },
                    error: function() {
                        console.log("checkHtml DISPLAY_WIFI_5G error");
                        logOut();
                    }
                });
            }
            setWifiText();
            break;
        case "settings":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            stone_getXMLCfg("sysinfo", setRouterValue);
            setSettingsText();
            break;
        case "network":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            // networkIntervalId = setInterval('setTimeout("stone_getXMLCfg(\'getMobileCfg\', setNetworkValue)",0)',1000*5);
            // resetNetworkStatusTimeoutId = setTimeout("resetNetworkStatus()",1000*21);
            stone_getXMLCfg("internetconn", setNetworkValue);
            setNetworkText();
            break;
        case "lan":
            stone_getXMLCfg("lan", setDhcpValue);
            setLanText();
            break;
        case "clientList":
            // clearInterval(homeIntervalId);
            // clearInterval(clientIntervalId);
            // clearInterval(networkIntervalId);
            // clearTimeout(resetNetworkStatusTimeoutId);
            // clientIntervalId = setInterval('setTimeout("stone_getXMLCfg(\'getClientList\', devices_callback)",0)',1000*5);
            let wifitype;
            if (DISPLAY_WIFI_2G == "block" && DISPLAY_WIFI_5G == "block") {
                wifitype = 2;
            } else if (DISPLAY_WIFI_5G == "block") {
                wifitype = 1;
            } else {
                wifitype = 0;
            }
            stone_getXMLCfg("device_management_all?pageIndex=1&wifi_type=" + wifitype, devices_callback);
            setClientsText();
            break;

    }
}

function setMenuNormal() {
    document.getElementById("menu_home").className = "menu_normal";
    document.getElementById("menu_internet").className = "menu_normal";
    document.getElementById("menu_wifi").className = "menu_normal";
    document.getElementById("menu_network").className = "menu_normal";
    document.getElementById("menu_lan").className = "menu_normal";
    document.getElementById("menu_terminal").className = "menu_normal";
    document.getElementById("menu_setting").className = "menu_normal";

    document.getElementById("text_home").className = "menu_text_normal";
    document.getElementById("text_internet").className = "menu_text_normal";
    document.getElementById("text_wifi").className = "menu_text_normal";
    document.getElementById("text_network").className = "menu_text_normal";
    document.getElementById("text_lan").className = "menu_text_normal";
    document.getElementById("text_terminal").className = "menu_text_normal";
    document.getElementById("text_settings").className = "menu_text_normal";

    document.getElementById("img_home").src = "../images/main/nav_home_normal.png";
    document.getElementById("img_internet").src = "../images/main/nav_internet_normal.png";
    document.getElementById("img_wifi").src = "../images/main/nav_wifi_normal.png";
    document.getElementById("img_network").src = "../images/main/nav_mobile_network_normal.png";
    document.getElementById("img_lan").src = "../images/main/nav_internet_normal.png";
    document.getElementById("img_terminal").src = "../images/main/nav_terminal_normal.png";
    document.getElementById("img_settings").src = "../images/main/nav_settings_normal.png";

    document.getElementById("menu_internet").style.display = DISPLAY_INTERNET_MENU;
    if (DISPLAY_INTERNET_MENU == "flex") {
        document.getElementById("menu_lan").style.display = "none";
    } else {
        document.getElementById("menu_lan").style.display = "flex";
    }
}

//翻译home页面文字
function setHomeText() {
    document.getElementById("hInternet").innerHTML = I18N("j", "hInternet");
    document.getElementById("hRouter").innerHTML = I18N("j", "hRouter");
    document.getElementById("hClients").innerHTML = I18N("j", "hClients");
    // document.getElementById("hWanUpTime").innerHTML = I18N("j", "hWanUpTime");
    document.getElementById("hSysUpTime").innerHTML = I18N("j", "hSysUpTime");
    document.getElementById("hWanIpAdds").innerHTML = I18N("j", "hWanIpAdds");
}

//翻译internet页面文字
function setInternetText() {
    document.getElementById("iAccType").innerHTML = I18N("j", "iAccType");
    document.getElementById("iIPAdds").innerHTML = I18N("j", "iIPAdds");
    document.getElementById("iMask").innerHTML = I18N("j", "iMask");
    document.getElementById("iGateway").innerHTML = I18N("j", "iGateway");
    document.getElementById("iSave").innerHTML = I18N("j", "tSave");
    document.getElementById("preferedNoneText").innerHTML = I18N("j", "preferedNoneText");
    document.getElementById("internetSetting").innerHTML = I18N("j", "internetSetting");
    document.getElementById("internetIntroduce").innerHTML = I18N("j", "internetIntroduce");
    document.getElementById("iPPPoEUser").innerHTML = I18N("j", "iPPPoEUser");
    document.getElementById("iPPPoEPassword").innerHTML = I18N("j", "iPPPoEPassword");
    document.getElementById("iLAN").innerHTML = I18N("j", "iLAN");
}

//翻译wifi页面文字
function setWifiText() {
    document.getElementById("wifi_text_basic").innerHTML = I18N("j", "wmBasic")
    document.getElementById("wifi_text_access_control").innerHTML = I18N("j", "smAccessControl");
    // document.getElementById("wifi_text_WPS").innerHTML = I18N("j", "smWPS")
    // document.getElementById("wifi_text_time_off").innerHTML = I18N("j", "wmTiming")
    document.getElementById("wifi_text_visitor").innerHTML = I18N("j", "wmVisitor")

    document.getElementById("w2Gtitle").innerHTML = I18N("j", SWITCH_WIFI_2G == 1 ? "" : "2.4G");
    document.getElementById("wSwitch1").innerHTML = I18N("j", SWITCH_WIFI_2G == 1 ? "wSwitch2" : "wSwitch1");
    document.getElementById("wHide1").innerHTML = I18N("j", "wHide1");
    document.getElementById("wSSID1").innerHTML = I18N("j", "wSSID1");
    document.getElementById("wSecurity1").innerHTML = I18N("j", "wSecurity1");
    document.getElementById("wPassword1").innerHTML = I18N("j", "wPassword1");
    document.getElementById("wConnected1").innerHTML = I18N("j", "wConnected");
    document.getElementById("wChannel1").innerHTML = I18N("j", "wChannel1");
    document.getElementById("w2Gwifi").style.display = DISPLAY_WIFI_2G;

    document.getElementById("w5Gtitle").innerHTML = I18N("j", SWITCH_WIFI_5G == 1 ? "" : "5G");
    document.getElementById("wSwitch2").innerHTML = I18N("j", SWITCH_WIFI_5G == 1 ? "wSwitch2" : "wSwitch1");
    document.getElementById("wHide2").innerHTML = I18N("j", "wHide2");
    document.getElementById("wSSID2").innerHTML = I18N("j", "wSSID2");
    document.getElementById("wSecurity2").innerHTML = I18N("j", "wSecurity2");
    document.getElementById("wPassword2").innerHTML = I18N("j", "wPassword2");
    document.getElementById("wConnected2").innerHTML = I18N("j", "wConnected");
    document.getElementById("wChannel2").innerHTML = I18N("j", "wChannel2");
    document.getElementById("w5Gwifi").style.display = DISPLAY_WIFI_5G;

    document.getElementById("wSave").innerHTML = I18N("j", "tSave");

    document.getElementById("swaAccessControl").innerHTML = I18N("j", "swaAccessControl");
    document.getElementById("swaControlIntroduce").innerHTML = I18N("j", DISPLAY_WHITE_LIST == "none" ? "swaControlIntroduce" : "swaControlIntroduce2");
    document.getElementById("swaMACFiltering").innerHTML = I18N("j", "swaMACFiltering");
    document.getElementById("swaApply").innerHTML = I18N("j", "tApply");
    document.getElementById("wDisable").innerHTML = I18N("j", "wDisable");
    document.getElementById("wBlack").innerHTML = I18N("j", DISPLAY_WHITE_LIST == "none" ? "wDeny" : "wBlack");
    document.getElementById("wWhite").innerHTML = I18N("j", "wWhite");

    document.getElementById("swwWPS").innerHTML = I18N("j", "swwWPS");
    document.getElementById("swwWPSIntroduce").innerHTML = I18N("j", "swwWPSIntroduce");
    document.getElementById("swwEnableWPS").innerHTML = I18N("j", "swwEnableWPS");
    document.getElementById("swwSave").innerHTML = I18N("j", "tSave");
    document.getElementById("wifi_menu_WPS").style.display = DISPLAY_WIFI_WPS;

    document.getElementById("stime_off").innerHTML = I18N("j", "sTiming");
    document.getElementById("stime_offIntroduce").innerHTML = I18N("j", "sTimingIntroduce");
    document.getElementById("wtAddTiming").innerHTML = I18N("j", "wtAddTiming");
    document.getElementById("wtSave").innerHTML = I18N("j", "tSave");
    document.getElementById("wtlTime").innerHTML = I18N("j", "wtTime");
    document.getElementById("wtlTo").innerHTML = I18N("j", "wtTo");
    document.getElementById("wtlRepeat").innerHTML = I18N("j", "wtRepeat");
    document.getElementById("cancel").innerHTML = I18N("j", "tCancel");
    document.getElementById("wtlConfirm").innerHTML = I18N("j", "wtConfirm");
    document.getElementById("wifi_hide_2G").style.display = HIDE_WIFI_2G;
    document.getElementById("wifi_hide_5G").style.display = HIDE_WIFI_5G;
    document.getElementById("wifi_channel_2G").style.display = DISPLAY_WIFI_CHANNEL_2G;
    document.getElementById("wifi_channel_5G").style.display = DISPLAY_WIFI_CHANNEL_5G;
    document.getElementById("wWhite").style.display = DISPLAY_WHITE_LIST;

    $("#wtiMonday").attr("title", I18N("j", "tMon"));
    $("#wtiTuesday").attr("title", I18N("j", "tTue"));
    $("#wtiWednesday").attr("title", I18N("j", "tWed"));
    $("#wtiThursday").attr("title", I18N("j", "tThu"));
    $("#wtiFriday").attr("title", I18N("j", "tFri"));
    $("#wtiSaturday").attr("title", I18N("j", "tSat"));
    $("#wtiSunday").attr("title", I18N("j", "tSun"));

}

//翻译network页面文字
function setNetworkText() {
    document.getElementById("nmBasic").innerHTML = I18N("j", "nmBasic");
    document.getElementById("network_basic").style.display = DISPLAY_NETWORK_BASIC;
    document.getElementById("network_mode").style.display = DISPLAY_NETWORK_BASIC_MODE;
    document.getElementById("nmAPN").innerHTML = I18N("j", "nmAPN");
    document.getElementById("network_apn").style.display = DISPLAY_NETWORK_APN;
    document.getElementById("network_pin").style.display = DISPLAY_NETWORK_PINLOCK;
    document.getElementById("network_ping").style.display = DISPLAY_NETWORK_PING;
    document.getElementById("network_simid").style.display = DISPLAY_NETWORK_SIMID;
    document.getElementById("network_sum").style.display = DISPLAY_DATATRAFFIC;
    document.getElementById("network_ussd").style.display = DISPLAY_NETWORK_USSD;
    document.getElementById("nmPinManage").innerHTML = I18N("j", "nmPinManage");
    document.getElementById("nmSMS").innerHTML = I18N("j", "nmSMS");
    document.getElementById("nmSendMsg").innerHTML = I18N("j", "nmSendMsg");
    document.getElementById("nmInbox").innerHTML = I18N("j", "nmInbox");
    document.getElementById("nmPing").innerHTML = I18N("j", "nmPing");
    document.getElementById("nmSimid").innerHTML = I18N("j", "nmSimid");
    document.getElementById("sms").style.display = DISPLAY_NETWORK_MESSAGE;
    // document.getElementById("nmOutbox").innerHTML = I18N("j", "nmOutbox");
    document.getElementById("nmUSSD").innerHTML = I18N("j", "nmUSSD");
    document.getElementById("nmMobileCounter").innerHTML = I18N("j", "nmMobileCounter");
    document.getElementById("nmESIM").innerHTML = I18N("j", "nmESIM");
    document.getElementById("network_esim").style.display = DISPLAY_NETWORK_ESIM;

    document.getElementById("nDataNetwork").innerHTML = I18N("j", "nDataNetwork");
    document.getElementById("nNetworkMode").innerHTML = I18N("j", "nNetworkMode");
    document.getElementById("nNetworkSimname").innerHTML = I18N("j", "nNetworkSimname");
    document.getElementById("nSave1").innerHTML = I18N("j", "tSave");
    document.getElementById("nSave4").innerHTML = I18N("j", "tSave");

    document.getElementById("nAPN").innerHTML = I18N("j", "nAPN");
    document.getElementById("nAPNType").innerHTML = I18N("j", "nAPNType");
    document.getElementById("nUsername").innerHTML = I18N("j", "nUsername");
    document.getElementById("nPassword").innerHTML = I18N("j", "nPassword");
    document.getElementById("nAuthType").innerHTML = I18N("j", "nAuthType");
    document.getElementById("nAgreement").innerHTML = I18N("j", "nAgreement");
    document.getElementById("nRoamingAgreement").innerHTML = I18N("j", "nRoamingAgreement");
    document.getElementById("nCancel2").innerHTML = I18N("j", "tCancel");
    document.getElementById("nSave2").innerHTML = I18N("j", "tSave");

    //document.getElementById("nLock").innerHTML = I18N("j", "nLock");
    document.getElementById("nPINNum").innerHTML = I18N("j", "nPINNum");
    //document.getElementById("nCancel3").innerHTML = I18N("j", "tCancel");
    document.getElementById("nSave3").innerHTML = I18N("j", "tSave");

    document.getElementById("nTexting").innerHTML = I18N("j", "nTexting");
    document.getElementById("nFillRecipient").placeholder = I18N("j", "nFillRecipient");
    document.getElementById("nEnterMsg").placeholder = I18N("j", "nEnterMsg");
    document.getElementById("nSend").innerHTML = I18N("j", "tSend");

    document.getElementById("nInbox").innerHTML = I18N("j", "nInbox");
    document.getElementById("nOutbox").innerHTML = I18N("j", "nOutbox");
    document.getElementById("nDelete").innerHTML = I18N("j", "tDelete");

    document.getElementById("nEnableESIM").innerHTML = I18N("j", "nEnableESIM");
    //document.getElementById("sim_passwd_toast").innerHTML = I18N("j", "sim_passwd_toast");
    document.getElementById("sim_passwd_title").innerHTML = I18N("j", "sim_passwd_title");
    document.getElementById("sim_passwd_cancel").innerHTML = I18N("j", "sim_passwd_cancel");
    document.getElementById("sim_passwd_set").innerHTML = I18N("j", "sim_passwd_set");

    document.getElementById("nUssdCode").placeholder = I18N("j", "nUssdCode");
    document.getElementById("nSave5").innerHTML = I18N("j", "tSend");

    document.getElementById("nUsedTraffic").innerHTML = I18N("j", "nUsedTraffic");
    document.getElementById("nTrafficLimit").innerHTML = I18N("j", "nTrafficLimit");
    document.getElementById("nTrafficUpperLimit").innerHTML = I18N("j", "nTrafficUpperLimit");
    document.getElementById("nDataLimit").placeholder = I18N("j", "nEnterNumber");
    document.getElementById("nCancel6").innerHTML = I18N("j", "tCancel");
    document.getElementById("nSave6").innerHTML = I18N("j", "tSave");
    document.getElementById("nClean").innerHTML = I18N("j", "nClean");
    document.getElementById("nPingCheck").innerHTML = I18N("j", "nPingCheck");
    document.getElementById("pingCheck").innerHTML = I18N("j", "pingCheck");
    document.getElementById("npingTitle").innerHTML = I18N("j", "npingTitle");

    document.getElementById("wifi_menu_phonebook").style.display = DISPLAY_PHONEBOOK;
    document.getElementById("wifi_text_phonebook").innerHTML = I18N("j", "wifi_text_phonebook");
    document.getElementById("phonebook_title").innerHTML = I18N("j", "wifi_text_phonebook");
    document.getElementById("phonebook_title2").innerHTML = I18N("j", "madd");
    document.getElementById("mltOrder").innerHTML = I18N("j", "morder");
    document.getElementById("mltName").innerHTML = I18N("j", "mname");
    document.getElementById("mltNumber").innerHTML = I18N("j", "mnumber");
    document.getElementById("mltAction").innerHTML = I18N("j", "maction");
    document.getElementById("add_title").innerHTML = I18N("j", "madd");
    document.getElementById("update_title").innerHTML = I18N("j", "mupdate");
    document.getElementById("add_name_tv").innerHTML = I18N("j", "mname");
    document.getElementById("add_number_tv").innerHTML = I18N("j", "mnumber");
    document.getElementById("update_name_tv").innerHTML = I18N("j", "mname");
    document.getElementById("update_number_tv").innerHTML = I18N("j", "mnumber");
    document.getElementById("delete_title").innerHTML = I18N("j", "mdeletequery");
    document.getElementById("add_save").innerHTML = I18N("j", "mmsave");
    document.getElementById("add_cancel").innerHTML = I18N("j", "mmcancel");
    document.getElementById("update_save").innerHTML = I18N("j", "mmsave");
    document.getElementById("update_cancel").innerHTML = I18N("j", "mmcancel");
    document.getElementById("delete_save").innerHTML = I18N("j", "mmok");
    document.getElementById("delete_cancel").innerHTML = I18N("j", "mmcancel");
}

//翻译Clients页面文字
function setClientsText() {
    document.getElementById("ltOrder").innerHTML = I18N("j", "ltOrder");
    document.getElementById("ltDeviceStatus").innerHTML = I18N("j", "ltDeviceStatus");
    document.getElementById("ltIpAddress").innerHTML = I18N("j", "ltIpAddress");
    document.getElementById("ltMac").innerHTML = I18N("j", "ltMac");
    document.getElementById("ltPrev").innerHTML = I18N("j", "ltPrev");
    document.getElementById("ltNext").innerHTML = I18N("j", "ltNext");
}

function setLanText() {
    document.getElementById("text_menu_lan").innerHTML = I18N("j", "smDhcp");
    document.getElementById("text_menu_ip_filter").innerHTML = I18N("j", "smIPFilter");
    document.getElementById("text_menu_vpn").innerHTML = I18N("j", "smVPN");
    document.getElementById("text_menu_qos").innerHTML = I18N("j", "smQos");
    document.getElementById("text_menu_port_forward").innerHTML = I18N("j", "smPortF");
    document.getElementById("text_menu_port_map").innerHTML = I18N("j", "smPortM");

    document.getElementById("sidLAN").innerHTML = I18N("j", "sidLAN");
    document.getElementById("sidLanIntroduce").innerHTML = I18N("j", "sidLanIntroduce");
    document.getElementById("sidDhcpIP").innerHTML = I18N("j", "sidDhcpIP");
    document.getElementById("sidDhcpStart").innerHTML = I18N("j", "sidDhcpStart");
    document.getElementById("sidDhcpEnd").innerHTML = I18N("j", "sidDhcpEnd");
    document.getElementById("sidCancel").innerHTML = I18N("j", "tCancel");
    document.getElementById("sidSave").innerHTML = I18N("j", "tSave");

    document.getElementById("sfiIPFilter").innerHTML = I18N("j", "sfiIPFilter");
    document.getElementById("sfiIPFilterIntroduce").innerHTML = I18N("j", "sfiIPFilterIntroduce");
    document.getElementById("sfiIPFiltering").innerHTML = I18N("j", "sfiIPFiltering");
    document.getElementById("sfiApply").innerHTML = I18N("j", "tApply");
    document.getElementById("wDisable").innerHTML = I18N("j", "wDisable");
    document.getElementById("wDeny").innerHTML = I18N("j", "wDeny");
}

//翻译Settings页面文字
function setSettingsText() {
    document.getElementById("text_menu_router").innerHTML = I18N("j", "smRouter");
    document.getElementById("text_menu_update").innerHTML = I18N("j", "smUpdate");
    document.getElementById("text_menu_internet").innerHTML = I18N("j", "smNetwork");
    document.getElementById("internet_text_LAN").innerHTML = I18N("j", "smDhcp");
    document.getElementById("internet_text_IPV6").innerHTML = I18N("j", "smIPV6");
    document.getElementById("text_menu_port").innerHTML = I18N("j", "sidPort");

    if (DISPLAY_INTERNET_MENU == "flex") {
        document.getElementById("setting_menu_lan").style.display = "block";
    } else {
        document.getElementById("setting_menu_lan").style.display = "none";
    }
    document.getElementById("setting_menu_firewall").style.display = DISPLAY_SETTING_FIREWALL;
    // document.getElementById("internet_text_Qos").innerHTML = I18N("j", "smQos");
    // document.getElementById("text_menu_wifi").innerHTML = I18N("j", "smWLAN");
    // document.getElementById("wifi_text_advanced").innerHTML = I18N("j", "smAdvanced");
    // document.getElementById("wifi_text_relay").innerHTML = I18N("j", "smRelay");
    document.getElementById("text_menu_firewall").innerHTML = I18N("j", "smFirewall");
    document.getElementById("firewall_text_mac").innerHTML = I18N("j", "smMACFilter");
    document.getElementById("firewall_text_ip").innerHTML = I18N("j", "smIPFilter");
    document.getElementById("firewall_text_url").innerHTML = I18N("j", "smURLFilter");
    document.getElementById("firewall_text_advanced").innerHTML = I18N("j", "smAdvanced");
    // document.getElementById("text_menu_system").innerHTML = I18N("j", "smSystem");
    document.getElementById("text_menu_password").innerHTML = I18N("j", "smPassword");
    document.getElementById("text_menu_internet_time").innerHTML = I18N("j", "smNetworkTime");
    // document.getElementById("system_text_system_log").innerHTML = I18N("j", "smSystemLog");
    document.getElementById("text_menu_recovery").innerHTML = I18N("j", "smRecovery");
    document.getElementById("smReboot").innerHTML = I18N("j", "smReboot");
    document.getElementById("smPoweroff").innerHTML = I18N("j", "smPoweroff");

    document.getElementById("srBasic").innerHTML = I18N("j", "srBasic");
    document.getElementById("srDeviceModel").innerHTML = I18N("j", "srDeviceModel");
    document.getElementById("srDeviceSn").innerHTML = I18N("j", "srDeviceSn");
    document.getElementById("srSwVersion").innerHTML = I18N("j", "srSwVersion");
    document.getElementById("srHwVersion").innerHTML = I18N("j", "srHwVersion");
    document.getElementById("srIPV4").innerHTML = I18N("j", "srIPV4");
    document.getElementById("srMAC").innerHTML = I18N("j", "srMAC");
    document.getElementById("srRouterIp1").innerHTML = I18N("j", "srRouterIp");
    document.getElementById("srNetMask").innerHTML = I18N("j", "srNetMask");
    document.getElementById("srIPV6").innerHTML = I18N("j", "srIPV6");
    document.getElementById("srLinkLocalAddr").innerHTML = I18N("j", "srLinkLocalAddr");
    document.getElementById("srRouterIp2").innerHTML = I18N("j", "srRouterIp");
    document.getElementById("srSystemInfo").innerHTML = I18N("j", "srSystemInfo");
    document.getElementById("srSystemUpTIme").innerHTML = I18N("j", "srSystemUpTIme");
    document.getElementById("srBuildTime").innerHTML = I18N("j", "srBuildTime");
    document.getElementById("srCPUUsage").innerHTML = I18N("j", "srCPUUsage");
    document.getElementById("srFreeMem").innerHTML = I18N("j", "srFreeMem");
    document.getElementById("srTotalMem").innerHTML = I18N("j", "srTotalMem");

    document.getElementById("suOnlineUpgrade").innerHTML = I18N("j", "suOnlineUpgrade");
    document.getElementById("suDfBuildVersion").innerHTML = DEFAULT_BUILD_VERSION;
    document.getElementById("suLatestVersion").innerHTML = I18N("j", "suLatestVersion");
    //document.getElementById("suUpdateTime").innerHTML = I18N("j", "suUpdateTime");
    document.getElementById("suDetectVersion").innerHTML = I18N("j", "suDetectVersion");
    document.getElementById("suUpgradeVersion").innerHTML = I18N("j", "suUpgradeVersion");
    document.getElementById("suLocalUpgrade").innerHTML = I18N("j", "suLocalUpgrade");
    document.getElementById("update_filename").innerHTML = I18N("j", "suFileName");
    document.getElementById("suUploadFile").innerHTML = I18N("j", "suLocalUpgrade");

    document.getElementById("sidLAN").innerHTML = I18N("j", "sidLAN");
    document.getElementById("sidLanIntroduce").innerHTML = I18N("j", "sidLanIntroduce");
    document.getElementById("sidDhcpIP").innerHTML = I18N("j", "sidDhcpIP");
    document.getElementById("sidDhcpStart").innerHTML = I18N("j", "sidDhcpStart");
    document.getElementById("sidDhcpEnd").innerHTML = I18N("j", "sidDhcpEnd");
    document.getElementById("sidCancel").innerHTML = I18N("j", "tCancel");
    document.getElementById("sidSave").innerHTML = I18N("j", "tSave");

    document.getElementById("siiIPV61").innerHTML = I18N("j", "siiIPV6");
    document.getElementById("siiIPV62").innerHTML = I18N("j", "siiIPV6");
    document.getElementById("siiIPV6Introduce").innerHTML = I18N("j", "siiIPV6Introduce");
    document.getElementById("siiSave").innerHTML = I18N("j", "tSave");

    document.getElementById("siqQos1").innerHTML = I18N("j", "siqQos");
    document.getElementById("siqQos2").innerHTML = I18N("j", "siqQos");
    document.getElementById("siqQosIntroduce").innerHTML = I18N("j", "siqQosIntroduce");
    document.getElementById("siqSave").innerHTML = I18N("j", "tSave");
    document.getElementById("iqOrder").innerHTML = I18N("j", "iqOrder");
    document.getElementById("iqIPAddress").innerHTML = I18N("j", "iqIPAddress");
    document.getElementById("iqDownload").innerHTML = I18N("j", "iqDownload");
    document.getElementById("iqUpload").innerHTML = I18N("j", "iqUpload");
    document.getElementById("iqOperate").innerHTML = I18N("j", "iqOperate");
    document.getElementById("QosIPAddress").placeholder = I18N("j", "QosIPAddress");

    //document.getElementById("swaAdvanced").innerHTML = I18N("j", "swaAdvanced");

    // document.getElementById("swrRelay").innerHTML = I18N("j", "swrRelay");
    // document.getElementById("swrRelayIntroduce").innerHTML = I18N("j", "swrRelayIntroduce");
    // document.getElementById("swrSwitchIntroduce").innerHTML = I18N("j", "swrSwitchIntroduce");
    // document.getElementById("swrSave").innerHTML = I18N("j", "tSave");

    document.getElementById("sfmMACFilter").innerHTML = I18N("j", "sfmMACFilter");
    document.getElementById("sfmMACFilterIntroduce").innerHTML = I18N("j", "sfmMACFilterIntroduce");
    document.getElementById("sfmMACFiltering").innerHTML = I18N("j", "sfmMACFiltering");
    document.getElementById("sfmApply").innerHTML = I18N("j", "tApply");

    document.getElementById("sfiIPFilter").innerHTML = I18N("j", "sfiIPFilter");
    document.getElementById("sfiIPFilterIntroduce").innerHTML = I18N("j", "sfiIPFilterIntroduce");
    document.getElementById("sfiIPFiltering").innerHTML = I18N("j", "sfiIPFiltering");
    document.getElementById("sfiApply").innerHTML = I18N("j", "tApply");

    document.getElementById("sfuURLFilter").innerHTML = I18N("j", "sfuURLFilter");
    document.getElementById("sfuURLFilterIntroduce").innerHTML = I18N("j", "sfuURLFilterIntroduce");
    document.getElementById("sfuURLFiltering").innerHTML = I18N("j", "sfuURLFiltering");
    document.getElementById("sfuApply").innerHTML = I18N("j", "tApply");

    document.getElementById("sfaAdvanced").innerHTML = I18N("j", "sfaAdvanced");
    document.getElementById("sfaDefenseDos").innerHTML = I18N("j", "sfaDefenseDos");
    document.getElementById("sfaSave").innerHTML = I18N("j", "tSave");

    document.getElementById("ssmModify").innerHTML = I18N("j", "ssmModify");
    document.getElementById("ssmModifyIntroduce").innerHTML = I18N("j", "ssmModifyIntroduce");
    document.getElementById("ssmNewName").innerHTML = I18N("j", "ssmNewName");
    document.getElementById("ssmNewPsw").innerHTML = I18N("j", "ssmNewPsw");
    document.getElementById("ssmRePsw").innerHTML = I18N("j", "ssmRePsw");
    document.getElementById("ssmSave").innerHTML = I18N("j", "tSave");

    document.getElementById("ssnNetTime").innerHTML = I18N("j", "ssnNetTime");
    document.getElementById("ssnNetTimeIntroduce").innerHTML = I18N("j", "ssnNetTimeIntroduce");
    document.getElementById("ssnSysTime").innerHTML = I18N("j", "ssnSysTime");
    document.getElementById("ssnAutomaticTimeZone").innerHTML = I18N("j", "ssnAutomaticTimeZone");
    document.getElementById("ssnTimeZone").innerHTML = I18N("j", "ssnTimeZone");
    document.getElementById("systemTimeStatus").innerHTML = I18N("j", "systemTimeStatus");
    document.getElementById("ssnSave").innerHTML = I18N("j", "tSave");
    document.getElementById("setting_menu_internet_time").style.display = DISPLAY_SETTING_TIME;
    document.getElementById("setting_menu_port").style.display = DISPLAY_SETTING_PORT;

    document.getElementById("sslLog1").innerHTML = I18N("j", "sslLog");
    document.getElementById("sslLog2").innerHTML = I18N("j", "sslLog");
    document.getElementById("sslLogIntroduce").innerHTML = I18N("j", "sslLogIntroduce");
    document.getElementById("sslSave").innerHTML = I18N("j", "tSave");

    document.getElementById("ssrRecovery").innerHTML = I18N("j", "ssrRecovery");
    document.getElementById("ssrRecoveryIntroduce").innerHTML = I18N("j", "ssrRecoveryIntroduce");
    document.getElementById("ssrDoRecovery").innerHTML = I18N("j", "ssrDoRecovery");
    document.getElementById("ssrConfiguration").innerHTML = I18N("j", "ssrConfiguration");
    document.getElementById("ssrConfigurationIntroduce").innerHTML = I18N("j", "ssrConfigurationIntroduce");
    document.getElementById("ssrExport").innerHTML = I18N("j", "ssrExport");

    document.getElementById("ssrVpnTitle").innerHTML = I18N("j", "ssrVpnTitle");
    document.getElementById("nConnectionType").innerHTML = I18N("j", "nConnectionType");
    document.getElementById("nConnectionStatus").innerHTML = I18N("j", "nConnectionStatus");
    document.getElementById("nEnableL2TP").innerHTML = I18N("j", "nEnableL2TP");
    document.getElementById("nLNSAddress").innerHTML = I18N("j", "nLNSAddress");
    document.getElementById("nHostName").innerHTML = I18N("j", "nHostName");
    document.getElementById("nTunnelPassword").innerHTML = I18N("j", "nTunnelPassword");
    document.getElementById("nHandshakeInterval").innerHTML = I18N("j", "nHandshakeInterval");
    document.getElementById("nPPPUserName").innerHTML = I18N("j", "nPPPUserName");
    document.getElementById("nPPPPassword").innerHTML = I18N("j", "nPPPPassword");
    document.getElementById("nAuthentication").innerHTML = I18N("j", "nAuthentication");
    document.getElementById("nVpnApply").innerHTML = I18N("j", "nVpnApply");

    document.getElementById("sidPort").innerHTML = I18N("j", "sidPort");
    document.getElementById("portIntroduce").innerHTML = I18N("j", "portIntroduce");
    document.getElementById("portOrder").innerHTML = I18N("j", "Order");
    document.getElementById("externalPort").innerHTML = I18N("j", "externalPort");
    document.getElementById("internalPort").innerHTML = I18N("j", "internalPort");
    document.getElementById("internalIP").innerHTML = I18N("j", "internalIP");
    document.getElementById("portProtocol").innerHTML = I18N("j", "portProtocol");
    document.getElementById("portOperate").innerHTML = I18N("j", "portOperate");
    document.getElementById("wtportAddTiming").innerHTML = I18N("j", "wtportAddTiming");
    document.getElementById("addExter").innerHTML = I18N("j", "externalPort");
    document.getElementById("addInter").innerHTML = I18N("j", "internalPort");
    document.getElementById("addIP").innerHTML = I18N("j", "internalIP");
    document.getElementById("addPortCancel").innerHTML = I18N("j", "wtCancel");
    document.getElementById("addPortConfirm").innerHTML = I18N("j", "wtConfirm");

    document.getElementById("sstConfigure").innerHTML = I18N("j", "sstConfigure");
    document.getElementById("sstTr").innerHTML = I18N("j", "sstTr");
    document.getElementById("sstAcs").innerHTML = I18N("j", "sstAcs");
    document.getElementById("sstAccount").innerHTML = I18N("j", "sstAccount");
    document.getElementById("sstPassword").innerHTML = I18N("j", "sstPassword");
    document.getElementById("sstPeriodic").innerHTML = I18N("j", "sstPeriodic");
    document.getElementById("sstInterval").innerHTML = I18N("j", "sstInterval");
    document.getElementById("sstConnection").innerHTML = I18N("j", "sstConnection");
    document.getElementById("sstCertifacation").innerHTML = I18N("j", "sstCertifacation");
    document.getElementById("sstRequestAccount").innerHTML = I18N("j", "sstRequestAccount");
    document.getElementById("sstRequestPassword").innerHTML = I18N("j", "sstRequestPassword");
    document.getElementById("sstPath").innerHTML = I18N("j", "sstPath");
    document.getElementById("sstPort").innerHTML = I18N("j", "sstPort");
    document.getElementById("sstReset").innerHTML = I18N("j", "sstReset");
    document.getElementById("sstSave").innerHTML = I18N("j", "sstSave");
    document.getElementById("sstManagement").innerHTML = I18N("j", "sstManagement");
    document.getElementById("sstUpload").innerHTML = I18N("j", "sstUpload");

}

var needLogin;
var needLoginIntervalId;
function getNeedLogin(content) {
    var xml = content;
    console.log("getNeedLogin xml:", xml);

    needLogin = xml["needLogin"];
    if (needLogin == 1) {
        clearInterval(needLoginIntervalId);
        logOut();
    }
}

//获取首页数据回调
var mobileProvider = "";
var issim = "";
function setDashboardValue(content) {

    var xml = content;
    var isWan = 0;
    console.log("objdashboard xml:", xml);

    var wanIp = $(xml).find("WANIP").text();
    var wanUpTime = $(xml).find("networkRunTime").text();
    var systemUpTime = $(xml).find("systemRunTime").text();
    var preferedConnection = "Mobile";
    // needLogin = xml["router"].needLogin;
    // if (needLogin == 1) {
    //     logOut();
    // }

    var mobileSignal = $(xml).find("strengthLevel").text();
    mobileProvider = $(xml).find("operatorName").text();
    if (mobileProvider === "Internet") {
        isWan = 1;
    }

    issim = $(xml).find("issim").text();
    if (0 == issim) {
        mobileProvider = "NO SIM";
    } else {
        if ("" == mobileProvider) {
            mobileProvider = "NO Service";
        }
    }
    var mobileConnType = $(xml).find("networkType").text();

    var clientNum = $(xml).find("client_num").text();

    var wifiStatus, wifiStatus5G, wifiSsid, wifiSsid5G
    wifiStatus = "ON";
    wifiSsid = $(xml).find("wifi24Ghotname").text();
    wifiStatus5G = "ON";
    wifiSsid5G = $(xml).find("wifi5Ghotname").text();

    //if (wanIp === "") {
    //    document.getElementById("status_connect").style.display = "none";
    //    document.getElementById("status_unconnect").style.display = "block";
    //} else {
        document.getElementById("status_connect").style.display = "block";
        document.getElementById("status_unconnect").style.display = "none";
    //}

    setLabelValue("wan_ip", wanIp);
    // setLabelValue("wan_up_time", wanUpTime);
    setLabelValue("system_up_time", systemUpTime);
    setLabelValue("client_num", clientNum);

    document.getElementById("mobile_connType").style.visibility = "visible";
    document.getElementById("mobile_signal").style.visibility = "visible";
    document.getElementById("mobile_provider").style.visibility = "visible";

    if (preferedConnection == "Ethernet") {
        document.getElementById("mobile_signal").src = "../images/main/ethernet_select.png";
        setLabelValue("mobile_provider", I18N("j", "hEthernet"));
        setLabelValue("mobile_connType", "");
    } else if (preferedConnection == "Mobile") {
        switch (parseInt(mobileSignal)) {
            case 1:
                document.getElementById("mobile_signal").src = "../images/main/signal1.png";
                break;
            case 2:
                document.getElementById("mobile_signal").src = "../images/main/signal2.png";
                break;
            case 3:
                document.getElementById("mobile_signal").src = "../images/main/signal3.png";
                break;
            case 4:
                document.getElementById("mobile_signal").src = "../images/main/signal4.png";
                break;
            default:
                document.getElementById("mobile_signal").src = "../images/main/signal0.png";
                break;
        }

        if (isWan == 1) {
            setLabelValue("mobile_provider", "Internet");
        } else if (mobileProvider === "NO SIM") {
            setLabelValue("mobile_provider", I18N("j", "noSIM"));
        } else if (mobileProvider === "NO Service") {
            setLabelValue("mobile_provider", I18N("j", "noService"));
        } else {
            setLabelValue("mobile_provider", mobileProvider);
        }

        setLabelValue("mobile_connType", mobileConnType);
    } else {
        document.getElementById("mobile_connType").style.visibility = "hidden";
        document.getElementById("mobile_signal").style.visibility = "hidden";
        document.getElementById("mobile_provider").style.visibility = "hidden";
    }

    if (DISPLAY_WIFI_2G == "block") {
        setLabelValue("wifi_ssid", wifiSsid);
    } else {
        setLabelValue("wifi_ssid", "");
    }
    if (DISPLAY_WIFI_5G == "block") {
        setLabelValue("wifi_ssid_5G", wifiSsid5G);
    } else {
        setLabelValue("wifi_ssid_5G", "");
    }

}

//获取wifi页面数据回调
function setWifiInfo(content, index) {
    var xml = content;
    console.log("getWifiCfg xml:", xml);
    var arrayChannel2G = [0,5,6,7,8,9,10,11];
    var arrayChannel5G = [0,36,40,44,48,149,153,157,161];
    var arrayChannelSelect = [0];

    if (index == 0) {
        var wifiMax2G = parseInt($(xml).find("wifi24GMaxcount").text());
        var wifiChannel2G = parseInt($(xml).find("wifi24GChannel").text());
        var wifiStatus2G = $(xml).find("wifi24Gsta").text() == 'true' ? 1 : 0;
        var wifiHide2G = $(xml).find("wifi24GHide").text() == 'true' ? 1 : 0;
        var wifiSsid2G = $(xml).find("wifi24Ghotname").text();
        var wifiPasswd2G = $(xml).find("wifi24GPassword").text();
        var wifiSecurity2G = parseInt($(xml).find("wifi24Gsafetype").text());

        if (wifiStatus2G == 1) {
            document.getElementById("wifi_status2G").checked = true;
        } else {
            document.getElementById("wifi_status2G").checked = false;
        }

        if (wifiHide2G == 1) {
            document.getElementById("wifi_hide2G").checked = true;
        } else {
            document.getElementById("wifi_hide2G").checked = false;
        }

        if (SWITCH_WIFI_2G == 1 && wifiStatus2G == 1) {
            arrayChannelSelect = arrayChannel5G;
        } else if (SWITCH_WIFI_2G == 1 && wifiStatus2G == 0) {
            arrayChannelSelect = arrayChannel2G;
        } else {
            arrayChannelSelect = arrayChannel2G;
        }

        if (document.getElementById("wifi_Channel2G").options.length == 0) {
            for (let i = 0; i < arrayChannelSelect.length; i++) {
                let option = document.createElement("option");

                if (i == 0) {
                    option.text = "auto";
                    option.value = 0;
                } else {
                    option.text = arrayChannelSelect[i];
                    option.value = arrayChannelSelect[i];
                }
                document.getElementById("wifi_Channel2G").appendChild(option);
            }
        }

        $("#wifi_ssid2G").val(wifiSsid2G);
        $("#wifi_safety_strategy2G").val(wifiSecurity2G);
        if ($('#wifi_safety_strategy2G').val() == 0) {
            $("#wifi_psd2G").val();
            $("#wifi_psd2G").attr("disabled", "disabled");
            $("#wifi_psd2G").css("background-color", "#e6e6e6");
        } else {
            $("#wifi_psd2G").val(wifiPasswd2G);
            $("#wifi_psd2G").removeAttr("disabled");
            $("#wifi_psd2G").css("background-color", "");
        }
        $("#wifi_max_connect2G").val(wifiMax2G);
        $("#wifi_Channel2G").val(wifiChannel2G);
    } else {
        var wifiMax5G = parseInt($(xml).find("wifi5GMaxcount").text());
        var wifiChannel5G = parseInt($(xml).find("wifi5GChannel").text());
        var wifiStatus5G = $(xml).find("wifi5Gsta").text() == 'true' ? 1 : 0;
        var wifiHide5G = $(xml).find("wifi5GHide").text() == 'true' ? 1 : 0;
        var wifiSsid5G = $(xml).find("wifi5Ghotname").text();
        var wifiPasswd5G = $(xml).find("wifi5GPassword").text();
        var wifiSecurity5G = parseInt($(xml).find("wifi5Gsafetype").text());

        if (wifiStatus5G == 1) {
            document.getElementById("wifi_status5G").checked = true;
        } else {
            document.getElementById("wifi_status5G").checked = false;
        }

        if (wifiHide5G == 1) {
            document.getElementById("wifi_hide5G").checked = true;
        } else {
            document.getElementById("wifi_hide5G").checked = false;
        }

        if (SWITCH_WIFI_5G == 1 && wifiStatus5G == 1) {
            arrayChannelSelect = arrayChannel5G;
        } else if (SWITCH_WIFI_5G == 1 && wifiStatus5G == 0) {
            arrayChannelSelect = arrayChannel2G;
        } else {
            arrayChannelSelect = arrayChannel5G;
        }

        if (document.getElementById("wifi_Channel5G").options.length == 0) {
            for (let i = 0; i < arrayChannelSelect.length; i++) {
                let option = document.createElement("option");

                if (i == 0) {
                    option.text = "auto";
                    option.value = 0;
                } else {
                    option.text = arrayChannelSelect[i];
                    option.value = arrayChannelSelect[i];
                }
                document.getElementById("wifi_Channel5G").appendChild(option);
            }
        }

        $("#wifi_ssid5G").val(wifiSsid5G);
        $("#wifi_safety_strategy5G").val(wifiSecurity5G);
        if ($('#wifi_safety_strategy5G').val() == 0) {
            $("#wifi_psd5G").val();
            $("#wifi_psd5G").attr("disabled", "disabled");
            $("#wifi_psd5G").css("background-color", "#e6e6e6");
        } else {
            $("#wifi_psd5G").val(wifiPasswd5G);
            $("#wifi_psd5G").removeAttr("disabled");
            $("#wifi_psd5G").css("background-color", "");
        }
        $("#wifi_max_connect5G").val(wifiMax5G);
        $("#wifi_Channel5G").val(wifiChannel5G);
    }
}

//wifi数据修改上传
function changeWifiCfg() {
    var status2, hide2, ssid2, password2, security2, channel2, max2;
    var status5, hide5, ssid5, password5, security5, channel5, max5;
    var Newstr2,Newstr,Newstr3,Newstr4;
    var re,re2;
    if (DISPLAY_WIFI_2G == "block") {

        if ($('#wifi_status2G').is(':checked')) {
            status2 = 1
        } else {
            status2 = 0
        }

        if ($('#wifi_hide2G').is(':checked')) {
            hide2 = 1
        } else {
            hide2 = 0
        }

        ssid2 = $.trim($('#wifi_ssid2G').val());
        password2 = $.trim($('#wifi_psd2G').val());
        security2 = $.trim($('#wifi_safety_strategy2G').val());
        max2 = $.trim($('#wifi_max_connect2G').val());
        channel2 = $.trim($('#wifi_Channel2G').val());

        if (ssid2 === "") {
            alert(I18N("j", "ssidEmpty"));
            return false;
        }

        if (ssid2.indexOf(" ") !== -1) {
            alert(I18N("j", "ssidSpace"));
            return false;
        }

        if (!checkword(ssid2) || (ssid2.indexOf("\"") !== -1) || (ssid2.indexOf("\'") !== -1)) {
            alert(I18N("j", "ssidCharacters"));
            return false;
        }

        if (ssid2.length > 32 || ssid2.length < 1) {
            alert(I18N("j", "ssidLength"));
            return false;
        }

        if (security2 > 0) {
            if (password2 === "") {
                alert(I18N("j", "psdEmpty"));
                return false;
            }

            if (password2.indexOf(" ") !== -1) {
                alert(I18N("j", "psdSpace"));
                return false;
            }

            if (!checkword(password2) || (password2.indexOf("\"") !== -1) || (password2.indexOf("\'") !== -1)) {
                alert(I18N("j", "psdCharacters"));
                return false;
            }

            if (password2.length > 32 || password2.length < 8) {
                alert(I18N("j", "psdLength"));
                return false;
            }
	    re = new RegExp("s","g");
	    Newstr2 = password2.replace(re, "#%01");
	    re2 = new RegExp("S","g");
	    Newstr = Newstr2.replace(re2, "#%02");
        }
    }

    if (DISPLAY_WIFI_5G == "block") {

        if ($('#wifi_status5G').is(':checked')) {
            status5 = 1
        } else {
            status5 = 0
        }

        if ($('#wifi_hide5G').is(':checked')) {
            hide5 = 1
        } else {
            hide5 = 0
        }

        ssid5 = $.trim($('#wifi_ssid5G').val());
        password5 = $.trim($('#wifi_psd5G').val());
        security5 = $.trim($('#wifi_safety_strategy5G').val());
        max5 = $.trim($('#wifi_max_connect5G').val());
        channel5 = $.trim($('#wifi_Channel5G').val());

        if (ssid5 === "") {
            alert(I18N("j", "ssidEmpty"));
            return false;
        }

        if (ssid5.indexOf(" ") !== -1) {
            alert(I18N("j", "ssidSpace"));
            return false;
        }

        if (!checkword(ssid5) || (ssid5.indexOf("\"") !== -1) || (ssid5.indexOf("\'") !== -1)) {
            alert(I18N("j", "ssidCharacters"));
            return false;
        }

        if (ssid5.length > 32 || ssid5.length < 1) {
            alert(I18N("j", "ssidLength"));
            return false;
        }

        if (security5 > 0) {
            if (password5 === "") {
                alert(I18N("j", "psdEmpty"));
                return false;
            }

            if (password5.indexOf(" ") !== -1) {
                alert(I18N("j", "psdSpace"));
                return false;
            }

            if (!checkword(password5) || (password5.indexOf("\"") !== -1) || (password5.indexOf("\'") !== -1)) {
                alert(I18N("j", "psdCharacters"));
                return false;
            }

            if (password5.length > 32 || password5.length < 8) {
                alert(I18N("j", "psdLength"));
                return false;
            }
	    re = new RegExp("s","g");
	    Newstr3 = password5.replace(re, "#%01");
	    re2 = new RegExp("S","g");
	    Newstr4 = Newstr3.replace(re2, "#%02");
        }

    }

    var state2 = 1;
    var state5 = 1;

    if (DISPLAY_WIFI_2G == "block") {
        var info2G =
        {
            "username": ssid2,
            "password": Newstr,
            "wifitype": parseInt(security2),
            "wifimode": SWITCH_WIFI_2G,
            "wifimodeaction": status2,
            "wifihide": hide2,
            "wifichannel": channel2,
            "maxcount": max2
        }
        $.ajax({
            url: LOCAL_HOST_IP + "24g_wifi_info_set",
            dataType: "jsonp",
            data: { '24g_wifi_info_set': JSON.stringify(info2G) },
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
                state2 = obj.state;
            }
        });

    }

    if (DISPLAY_WIFI_5G == "block") {
        var info5G =
        {
            "username": ssid5,
            "password": Newstr4,
            "wifitype": parseInt(security5),
            "wifimode": SWITCH_WIFI_5G,
            "wifimodeaction": status5,
            "wifihide": hide5,
            "wifichannel": channel5,
            "maxcount": max5
        }
        $.ajax({
            url: LOCAL_HOST_IP + "5g_wifi_info_set",
            dataType: "jsonp",
            data: { '5g_wifi_info_set': JSON.stringify(info5G) },
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
                state5 = obj.state;
            }
        });
    }

    if (state2 == 1 && state5 == 1) {
        document.getElementById("mNotice").style.display = "flex";
        document.getElementById("full_screen_notice_msg").innerHTML = I18N("j","saveTimeWait");
        setTimeout(() => {
            document.getElementById("mNotice").style.display = "none";
        }, 4500);
        setTimeout(() => {
            alert(I18N("j", "setWifiSuccess"));
        }, 5000);
    } else {
        alert(I18N("j", "setFail"));
    }
}

//获取internet页面数据回调
function setInternetValue(content) {
    var xml = content;
    console.log("setInternetValue xml:", xml);

    var wanType = parseInt($(xml).find("ethernet").text());
    $("#access_type").val(wanType);
}

//internet页面数据修改上传
function changeWanCfg() {
    var wanType = $("#access_type").val();

    var wanCfg =
    {
        "mode": parseInt(wanType)
    }
    var url = LOCAL_HOST_IP + "ethernet_set";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { ethernet: JSON.stringify(wanCfg) },
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
            if (state == 0) {
                alert(I18N("j", "setFail"));
            } else if (state == 1) {
                alert(I18N("j", "iLanToast"));
            } else if (state == 2) {
                alert(I18N("j", "iWanToast"));
            }
        }
    });
}

var showPPPoE = false
function showPPPoEPassword() {
    if (showPPPoE) {
        document.getElementById("PPPoE_password").type = "password";
        document.getElementById("showPPPoEPassword").src = "../images/login/login_password_no.png";
        showPPPoE = false;
    } else {
        document.getElementById("PPPoE_password").type = "text";
        document.getElementById("showPPPoEPassword").src = "../images/login/login_password_yes.png";
        showPPPoE = true;
    }
}

function setLabelValue(id, value) {
    document.getElementById(id).innerHTML = value;
}

function formatTime(time) {
    var sec = 0;
    var min = 0;
    var hour = 0;
    var day = 0;
    var timeString;

    if (time > 0) {
        sec = time % 60;
        min = Math.floor(time / 60) % 60;
        hour = Math.floor(time / 3600) % 24;
        day = Math.floor(time / 86400);

        if (parseInt(day) > 1) {
            timeString = day + I18N("j", "tdays") + " " + hour + I18N("j", "thour") + " " + min + I18N("j", "tmin");
        } else {
            timeString = day + I18N("j", "tday") + " " + hour + I18N("j", "thour") + " " + min + I18N("j", "tmin");
        }
    } else {
        timeString = "";
    }
    return timeString;
}

//跳转设置向导
function toWizard() {
    self.location.href = "../html/wizard.html";
}

function quitWizard() {
    self.location.href = "../html/main.html";
}

//获取network页面数据回调
var preferedConnectionNetwork;
function setNetworkValue(content) {
    var xml = content;
    console.log("setNetworkValue xml:", xml);

    var mobileEnable = $(xml).find("isDataOpen").text() == "true" ? 1 : 0;
    var netType = $(xml).find("netType").text();
    var networkStatus = $(xml).find("isDataOpen").text() == "true" ? 1 : 0;
    preferedConnectionNetwork = "";

    let networkStatusString;
    $("#networkNetType").addClass("disable");
    switch (networkStatus) {
        case 0:
            if (mobileEnable === 0) {
                // clearInterval(networkIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                networkStatusString = I18N("j", "nNetworkStatus0");
                document.getElementById("nSave1").disabled = false;
                document.getElementById("nSave1").style.backgroundColor = "#519CE5";
                document.getElementById("nSave1").style.cursor = "pointer";
                document.getElementById("network_mobileEnable").disabled = false;
                $("#networkNetType").removeClass("disable");
            } else {
                networkStatusString = I18N("j", "nNetworkStatus2");
                document.getElementById("nSave1").disabled = true;
                document.getElementById("nSave1").style.backgroundColor = "#868686";
                document.getElementById("nSave1").style.cursor = "default";
                document.getElementById("network_mobileEnable").disabled = true;
                $("#networkNetType").addClass("disable");
            }
            break;
        case 1:
            if (mobileEnable === 1) {
                // clearInterval(networkIntervalId);
                // clearTimeout(resetNetworkStatusTimeoutId);
                networkStatusString = I18N("j", "nNetworkStatus1");
                document.getElementById("nSave1").disabled = false;
                document.getElementById("nSave1").style.backgroundColor = "#519CE5";
                document.getElementById("nSave1").style.cursor = "pointer";
                document.getElementById("network_mobileEnable").disabled = false;
                $("#networkNetType").removeClass("disable");
            } else {
                networkStatusString = I18N("j", "nNetworkStatus2");
                document.getElementById("nSave1").disabled = true;
                document.getElementById("nSave1").style.backgroundColor = "#868686";
                document.getElementById("nSave1").style.cursor = "default";
                document.getElementById("network_mobileEnable").disabled = true;
                $("#networkNetType").addClass("disable");
            }
            break;
        case 2:
            networkStatusString = I18N("j", "nNetworkStatus2");
            document.getElementById("nSave1").disabled = true;
            document.getElementById("nSave1").style.backgroundColor = "#868686";
            document.getElementById("nSave1").style.cursor = "default";
            document.getElementById("network_mobileEnable").disabled = true;
            $("#networkNetType").addClass("disable");
            break;
    }

    setLabelValue("networkStatus", networkStatusString);

    // 获取开关的dom
    if (mobileEnable === 1) {
        // 开关开启
        document.getElementById("network_mobileEnable").checked = true;
    } else {
        // 关闭开关
        document.getElementById("network_mobileEnable").checked = false;
    }

    // 下拉框回显
    $(document).ready(function () {
        $("#network_netType").val(netType);
    })


    if (preferedConnectionNetwork === "Ethernet") {
        document.getElementById("nSave1").disabled = true;
        document.getElementById("nSave1").style.backgroundColor = "#868686";
        document.getElementById("nSave1").style.cursor = "default";
        document.getElementById("network_mobileEnable").disabled = true;
        $("#networkNetType").addClass("disable");
    }
}

function resetNetworkStatus() {
    // clearInterval(networkIntervalId);
    setLabelValue("networkStatus", I18N("j", ""));
    document.getElementById("nSave1").disabled = false;
    document.getElementById("nSave1").style.backgroundColor = "#519CE5";
    document.getElementById("nSave1").style.cursor = "pointer";
    document.getElementById("network_mobileEnable").disabled = false;
    $("#networkNetType").removeClass("disable");
    if (preferedConnectionNetwork === "Ethernet") {
        document.getElementById("nSave1").disabled = true;
        document.getElementById("nSave1").style.backgroundColor = "#868686";
        document.getElementById("nSave1").style.cursor = "default";
        document.getElementById("network_mobileEnable").disabled = true;
        $("#networkNetType").addClass("disable");
    }
}

//network 基本设置数据修改上传
function changeMobileCfg() {
    var mobileEnable = 0;
    if ($('#network_mobileEnable').is(':checked')) {
        mobileEnable = 1;
    } else {
        mobileEnable = 0;
    }
    var netType = parseInt($("#network_netType").val());

    var changeNetwork =
    {
        "isdataopen": mobileEnable,
        "type": netType
    }

    var url = LOCAL_HOST_IP + "changeNetwork";
    $.ajax({
        url: url,
        dataType: "jsonp",
        data: { changeNetwork: JSON.stringify(changeNetwork) },
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
                stone_getXMLCfg("internetconn", setNetworkValue);
                // networkIntervalId = setInterval('setTimeout("stone_getXMLCfg(\'getMobileCfg\', setNetworkValue)",0)', 1000 * 5);
                // resetNetworkStatusTimeoutId = setTimeout("resetNetworkStatus()", 1000 * 21);
                alert(I18N("j", "setSuccess"));
            } else {
                alert(I18N("j", "setFail"));
            }
        }
    });
}

var curpageClient = 1;
var totalpageClient = 1;
function switchPage(flag) {
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

    stone_getXMLCfg("device_management_all?pageIndex=" + pageIndex + "&wifi_type=" + wifitype, devices_callback);
}

//获取设备列表信息
function devices_callback(data) {
    var xml = data;
    console.log("devices_callback xml:", xml);
    // xml = JSON.parse('{"curPage":1,"startRowNum":1,"endRowNum":4,"recordsPerpage":6,"totalPage":2,"totalRecords":3,"data":[{"mac":"40:4D:8E:6D:80:7D","ip":"192.168.1.1","status":"REACHABLE"},{"mac":"40:4D:8E:6D:80:7D","ip":"192.168.1.2","status":"REACHABLE"},{"mac":"40:4D:8E:6D:80:7D","ip":"192.168.1.3","status":"REACHABLE"}]}');
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
            var trow = getDataRow(arrayTableData[i], i); //定义一个方法,返回tr数据
            tBodytableConnectedDevice.appendChild(trow);
        }
    }
    document.getElementById('clientIndex').innerHTML = curpageClient + "/" + totalpageClient;
}

function getDataRow(data, i) {
    var row = document.createElement('tr'); //创建行

    var idCell = document.createElement('td'); //创建第一列id
    idCell.innerHTML = i + 1; //填充数据
    row.appendChild(idCell); //加入行  ，下面类似

    var statusCell = document.createElement('td');//创建第二列status
    let sta = data.status
    if ("REACHABLE" == sta) {
        sta = I18N("j", "ltConnected");
    }
    statusCell.innerHTML = sta;
    row.appendChild(statusCell);

    var ipCell = document.createElement('td');//创建第三列ip
    ipCell.innerHTML = data.ip;
    row.appendChild(ipCell);

    var macCell = document.createElement('td');//创建第三列mac
    macCell.innerHTML = data.mac;
    row.appendChild(macCell);
    return row;
}

/*ip地址 0.0.0.0~255.255.255.255*/
function isValidIP(ip) {
    var reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
    return reg.test(ip);
}

//用户名验证 必须是6-16位字母+数字组合
function isName(name) {
    var reg = /^[a-zA-Z0-9]{4,16}$/;
    return reg.test(name);
}

function change(type) {
    if (type === "") {
        type = "AUTO";
    }
    if (type === "AUTO") {
        $("#static_method").hide();
        $("#PPPoE").show();
        $("#iLAN").hide();
    }
    if (type === "DHCP") {
        $("#static_method").hide();
        $("#PPPoE").hide();
        $("#iLAN").hide();
    }
    if (type === "STATIC") {
        $("#static_method").show();
        $("#PPPoE").hide();
        $("#iLAN").hide();
    }
    if (type === "PPPoE") {
        $("#static_method").hide();
        $("#PPPoE").show();
        $("#iLAN").hide();
    }
    if (type === "LAN") {
        $("#static_method").hide();
        $("#PPPoE").hide();
        $("#iLAN").show();
    }
}

function loadMainHtml() {
    var loginStatus = sessionStorage.getItem("loginStatus");
    console.log("loadMainHtml loginStatus=", loginStatus);
    if (loginStatus != "login") {
        self.location.href = "error.html";
        return;
    }

    _xmlName = localStorage.getItem('xmlName');
    if (_xmlName == null || _xmlName == "") {
        checkMainHtml("home");
    } else {
        checkMainHtml(_xmlName);
    }

    // needLoginIntervalId = setInterval('setTimeout("stone_getXMLCfg(\'needLogin\', getNeedLogin)",0)',1000*10);
    document.getElementById("mBatteryUnit").style.display = DISPLAY_BATTERY;
    _batteryIntervalID = setInterval('setTimeout("stone_getXMLCfg(\'battery_level\', refreshBattery)",0)', 1000 * 10);
    _tempIntervalID = setInterval('setTimeout("gettemp()")', 1000 * 10);
    gettemp();
}
function gettemp(){
    $.ajax({
        url: R106_8080_API_PREFIX+"/api/get/sysinfo",
        dataType: "json",
        type:"GET",
        success: function (data) {
            var cpuMaxTempTip="";
            var batteryTempTip = "";
            if (data.Code === 0 && data.Data) {
                if (data.Data.CPU_TEMP){
                    data.Data.CPU_TEMP.sort(function (a, b) {
                        return b-a;
                    });
                    var max = data.Data.CPU_TEMP[0];
                    cpuMaxTempTip = "CPU:"+(max/1000).toFixed(2)+"℃";
                }
                if (data.Data.POWER_SUPPLY_TEMP){
                    batteryTempTip = "BATTERY:" + (data.Data.POWER_SUPPLY_TEMP/10).toFixed(1)+"℃";
                }
            }

            $("#temp").html(cpuMaxTempTip+" "+batteryTempTip)
        }
    })
}

function refreshBattery(content) {
    var xml = content;
    console.log("refreshBattery xml:", xml);
    if (DISPLAY_BATTERY == "block") {
        var _isChanging = $(xml).find("isChanging").text();
        var _percent = $(xml).find("batteryPercent").text();//(Math.random() * 100).toFixed(0);

        document.getElementById("mBattery").innerHTML = _percent + '%';
        if (_percent > 90) {
            document.getElementById("mBatteryIcon").src = "../images/main/nav_top_icon_battery3_normal.png";
        } else if (_percent > 50) {
            document.getElementById("mBatteryIcon").src = "../images/main/nav_top_icon_battery2_normal.png";
        } else {
            document.getElementById("mBatteryIcon").src = "../images/main/nav_top_icon_battery_normal.png";
        }

        if (_isChanging == "1") {
            document.getElementById("mBatteryCharge").style.opacity = 1;
        } else {
            document.getElementById("mBatteryCharge").style.opacity = 0;
        }
    }

    if (mobileProvider == "NO SIM" /*|| mobileProvider == "NO Service"*/) {
        document.getElementById("mNetworkIcon").src = "../images/main/nav_top_network_information2.png";
    } else {
        document.getElementById("mNetworkIcon").src = "../images/main/nav_top_network_information.png";
    }
}

function checkLogin() {
    console.log("checkLogin run")
    let username = sessionStorage.getItem('username')
    let password = sessionStorage.getItem('password')
    doLogin(username, password, checkLoginBack)
}

function checkLoginBack(login_done) {
    if (login_done === 0) {
        logOut();
    }
}
function batinfoajax(){
    $.ajax({
        type: "GET",
        url: R106_8080_API_PREFIX+"/api/get/sysinfo",
        dataType: "json",
        success: function (data) {
            if (!(data.Code === 0 && data.Data)) {
                return
            }
            data=data.Data
            if(data.POWER_SUPPLY_STATUS=="Discharging"){
                document.getElementById("chargediv").style.display = "none";
            }else if(data.POWER_SUPPLY_STATUS=="Charging"){
                document.getElementById("chargediv").style.display = "flex";
                $('#disable_charge').attr( "checked", true);
            }else if(data.POWER_SUPPLY_STATUS=="Not charging"){
                document.getElementById("chargediv").style.display = "flex";
                $('#disable_charge').attr( "checked", false);
            }else if(data.POWER_SUPPLY_STATUS=="Full"){
                document.getElementById("chargediv").style.display = "flex";
                $('#disable_charge').attr( "checked", true);
            }
            document.getElementById("bat_status").innerHTML = data.POWER_SUPPLY_STATUS; // 充电状态
            document.getElementById("bat_health").innerHTML = data.POWER_SUPPLY_HEALTH; // 电池状态
            document.getElementById("bat_voltage_now").innerHTML = data.POWER_SUPPLY_VOLTAGE_NOW/1000+ " mV"; // 当前电压
            document.getElementById("bat_voltage_avg").innerHTML = data.POWER_SUPPLY_VOLTAGE_AVG/1000+ " mV"; // 平均电压
            document.getElementById("bat_capacity").innerHTML = data.POWER_SUPPLY_CAPACITY + " %"; // 电量百分比
            document.getElementById("bat_full").innerHTML = data.POWER_SUPPLY_CHARGE_FULL/1000 + " mah"; //总容量
            document.getElementById("bat_charge_current").innerHTML = data.POWER_SUPPLY_CONSTANT_CHARGE_CURRENT/1000 + " mA"; // 当前充电电流
            document.getElementById("bat_current_limit").innerHTML = data.POWER_SUPPLY_INPUT_CURRENT_LIMIT/1000+" mA"; // 充电电流限制
            document.getElementById("bat_current_now").innerHTML = data.POWER_SUPPLY_CURRENT_NOW/1000+" mA"; // 当前电流
            document.getElementById("bat_current_avg").innerHTML = data.POWER_SUPPLY_CURRENT_AVG/1000+" mA"; // 平均电流
            document.getElementById("bat_charge_count").innerHTML = data.POWER_SUPPLY_CHARGE_COUNTER/1000+" mAh"; // 当前容量
            document.getElementById("bat_online").innerHTML = parseInt(data.POWER_SUPPLY_ONLINE)?"USB供电":"电池供电"; // 电源状态
            document.getElementById("bat_temp").innerHTML = (data.POWER_SUPPLY_TEMP/10).toFixed(1) +" ℃"; // 电池温度
        }
    });
}
var showbatajax_id;
function showBatInfo() {
    batinfoajax();
    showbatajax_id = setInterval('batinfoajax()',1000*5);
    document.getElementById("mBatDetail").style.display = "flex";
}
function hideBatInfo() {
    clearInterval(showbatajax_id);
    document.getElementById("mBatDetail").style.display = "none";
}
function disable_charge(){
    var openCharge = false;
    if($('#disable_charge').is(":checked")){
        openCharge = true;
    }
    $.ajax({
        type: "POST",
        url: R106_8080_API_PREFIX+"/api/set/charge/state",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ "CHARGE_STATE": openCharge }),
        success: function (data) {
            stone_getXMLCfg('battery_level', refreshBattery);
            var batStatus=document.getElementById("bat_status").innerHTML
            if ((!data) || (data.Code === 0)) {
                if (batStatus==="Full"){
                    alert("请求成功，但电池已经满电，状态可能被重置")
                }
            }else {
                alert("操作失败，Error="+data ? data.Error:"")
            }
        }
    });
}
function showDetailInfo() {
    $.ajax({
        type: "GET",
        'beforeSend': function (xhr) {
            xhr.setRequestHeader("Authorization", getAuthHeader("GET"));
        },
        url: LOCAL_HOST_IP + 'jsonp_internet_info',
        dataType: "jsonp",
        async: false,
        success: function (data) {
            document.getElementById("detail_operator").innerHTML = $(data).find("operatorName").text();
            document.getElementById("detail_network").innerHTML = $(data).find("networkType").text();
            document.getElementById("detail_band").innerHTML = $(data).find("band").text();
            document.getElementById("detail_earfcn").innerHTML = $(data).find("earfcn").text();
            document.getElementById("detail_rsrp").innerHTML = $(data).find("rsrp").text() + " dBm";
            document.getElementById("detail_rssi").innerHTML = $(data).find("rssi").text() + " dBm";
            document.getElementById("detail_rsrq").innerHTML = $(data).find("rsrq").text() + " dB";
            document.getElementById("detail_cellid").innerHTML = $(data).find("cellid").text();
            document.getElementById("detail_pci").innerHTML = $(data).find("pci").text();
            document.getElementById("detail_mcc").innerHTML = $(data).find("mcc").text();
            document.getElementById("detail_mnc").innerHTML = $(data).find("mnc").text();
            document.getElementById("detail_iccid").innerHTML = $(data).find("iccid").text();
            document.getElementById("detail_imei").innerHTML = $(data).find("imei").text();
        }
    });

    if (mobileProvider != "NO SIM" /*&& mobileProvider != "NO Service"*/) {
        document.getElementById("mInternetDetail").style.display = "flex";
    }
}

function hideDetailInfo() {
    document.getElementById("mInternetDetail").style.display = "none";
}

function hideNotice() {
    document.getElementById("mNotice").style.display = "none";
}
