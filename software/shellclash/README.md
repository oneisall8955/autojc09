安装shellclash步骤：
- ssh 或 adb shell 登录
- 挂载目录为读写：`mount -o remount,rw /`
- 添加环境变量：`vi /etc/profile` 在 `PATH=xxx`这一行添加上 `:/sbin:/usr/sbin`
- 让环境变量生效：`source /etc/profile`
- 添加cron：
    ```shell
    mkdir -p /var/spool/cron \
    && chmod 777 /var/spool/cron \
    && echo '30 * * * *  /usr/bin/ntpdate-sync silent' >> /var/spool/root
    ```
- 下载shellclash压缩包：`curl -o /tmp/ShellClash.tar.gz https://fastly.jsdelivr.net/gh/juewuy/ShellClash@master/bin/ShellClash.tar.gz`
- 复制一份压缩包，安装错了重装可以避免重新下载：`cp /tmp/ShellClash.tar.gz /tmp/ShellClash2.tar.gz`
- 创建/tmp/SC_tmp目录并且解压缩：`mkdir -p /tmp/SC_tmp && tar -zxf '/tmp/ShellClash.tar.gz' -C /tmp/SC_tmp/` 
- 执行安装命令：`bash /tmp/SC_tmp/init.sh`，选择自定义安装目录：`/home/root`
- 安装好后重新让环境变量生效：`source /etc/profile`
- 执行shellclash命令进行后续配置：`clash`
- 安装面板，安装meta内核，切换dns为fake-ip模式等
- 创建shellclash自启脚本：/etc/init.d/clash.sh
    ```shell
    echo 'source /etc/profile && /home/root/clash/clash.sh -s start' > /etc/init.d/clash.sh \
    && chmod a+x /etc/init.d/clash.sh
    ```
- 开机自启动：`vi /etc/init.d/hostname.sh` 在行尾新建一行添加上 `bash /etc/init.d/clash.sh > /dev/null 2>&1 &`
- 重启

--------------------------

参考：[在Linux系统安装及使用ShellClash的教程](https://juewuy.github.io/zai-linux-xi-tong-an-zhuang-ji-shi-yong-shellclash-de-jiao-cheng/)

添加了文件：[ShellClash_20230820_v1.8.0.tar.gz](ShellClash_20230820_v1.8.0.tar.gz)，可以不在线下载，
使用adb push ShellClash_20230820_v1.8.0.tar.gz /tmp/
然后mv /tmp/ShellClash_20230820_v1.8.0.tar.gz /tmp/ShellClash.tar.gz
接着后续安装命令即可
