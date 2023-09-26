- adb push atcmd /home/root
- adb shell
- mount -rw -o remount /
- chmod +x /home/root/atcmd
- ln -s /home/root/atcmd /usr/bin/atcmd
- atcmd "AT+CGSN"

-------------------------------------------------
查询串号：
- 指令AT+CGSN 对应命令行： `atcmd "AT+CGSN"`
- 指令AT+SPIMEI? 对应命令行： `atcmd "AT+SPIMEI?"`

修改串号：tm70实测用第一条
- 指令 AT+SPIMEI=0,"863897060944341" 对应命令行： `atcmd "AT+SPIMEI=0,\"863897060944341\""`
- 指令 AT+SPIMEI=1,"863897060944341" 对应命令行： `atcmd "AT+SPIMEI=1,\"863897060944341\""`
