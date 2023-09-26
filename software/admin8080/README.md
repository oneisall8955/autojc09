- adb push r106.tar.gz /home/root
- adb shell
- mount -rw -o remount /
- cd /home/root
- tar zxf r106.tar.gz
- echo '/home/root/r106/run.sh > /dev/null 2>&1 &' >> /etc/init.d/hostname.sh
- rm r106.tar.gz
- /home/root/r106/run.sh > /dev/null 2>&1 &

----------------
cmd 窗口中执行 reg8080.exe 输入序列号回车即可
