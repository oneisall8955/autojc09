#!/bin/bash

count=0

function remount_write() {
  mount -o remount,rw /
}
function remount_read() {
  mount -o remount,ro /
}

function recount() {
  count_file="/home/root/.tm70_disable_remote_count"
  if [ -f $count_file ]; then
    count=$(cat $count_file)
    count=$((count))
  fi

  if [[ $count -lt 0 ]]; then
    count=0
  fi
  ((count++))
  echo "$count" >"$count_file"
}

function handle_usr_bin() {
  mm_bin_files=(
    "mm-aging_test"
    "mm-auth"
    "mm-fota"
    "mm-monitor"
    "mm-test"
    "mm_app_cmd"
    "mm-keep-alive.sh"
    "mosquitto"
    "mosquitto_pub"
    "mosquitto_rr"
    "mosquitto_sub"
  )
  for bin_file in "${mm_bin_files[@]}"; do
    [ -f "/usr/bin/$bin_file" ] && mv "/usr/bin/$bin_file" "/usr/bin/$bin_file.bak_$count"
  done
}

function handle_etc_init_d() {
  mm_init_sh_files=("mm-agingtest.sh" "mm-auth.sh" "mm-fota.sh" "mm-monitor.sh")
  for init_sh_file in "${mm_init_sh_files[@]}"; do
    [ -f "/etc/init.d/$init_sh_file" ] &&
      cp "/etc/init.d/$init_sh_file" "/etc/init.d/$init_sh_file.bak_$count" &&
      echo "#! /bin/sh" >"/etc/init.d/$init_sh_file"
  done
}

function handle_fota_config() {
  [ -f "/etc/mm/fota_config.json" ] && sed -i".bak_$count" 's#https://ota\.mumuiot\.com:8181#127.0.0.1#g' "/etc/mm/fota_config.json"
  sed -i 's/"auto_update"\s*:\s*"1"/"auto_update": "0"/' "/etc/mm/fota_config.json"
}

function handle_hosts() {
  hosts_array=(
    "hyyrdz.com"
    "111.231.103.170"
    "203.107.6.88"
    "www.devupline.com"
    "devupline.com"
    "dm.yunqitec.com"
    "yunqitec.com"
    "ota-1253691939.file.myqcloud.com"
    "file.myqcloud.com"
    "myqcloud.com"
    "ota.mumuiot.com"
    "mumuiot.com"
    "reportinfo.freewo.com.cn"
    "fota.redstone.net.cn"
  )

  cp "/etc/hosts" "/etc/hosts.bak_$count"
  append_count=0
  for deny_host in "${hosts_array[@]}"; do
    grep -q "$deny_host" /etc/hosts || ((append_count++))
  done
  if [[ $append_count -gt 0 ]]; then
    echo "" >>/etc/hosts
  fi
  for deny_host in "${hosts_array[@]}"; do
    grep -q "$deny_host" /etc/hosts || echo "127.0.0.1 $deny_host" >>/etc/hosts
  done
}

function handle_mqtt_port() {
  #[ -f "/usr/sbin/iptables" ] && cp "/usr/sbin/iptables" "/usr/sbin/iptables.bak_$count"
  deny_mqtt_port_shell_path="/etc/init.d/deny_mqtt_port.sh"
  cat <<EOF >$deny_mqtt_port_shell_path
#!/bin/sh
sleep 5
watchdog_duration_min=10
watchdog_duration=\$((60 * watchdog_duration_min))
start_timestamp=\$(date +%s)
start_timestamp_str=\$(date -d @"\$start_timestamp" +'%Y-%m-%d %H:%M:%S')
end_timestamp=\$((start_timestamp + watchdog_duration))
end_timestamp_str=\$(date -d @"\$end_timestamp" +'%Y-%m-%d %H:%M:%S')
now_timestamp=\$(date +%s)
while [[ \$now_timestamp < \$end_timestamp ]]; do
  iptables -C INPUT -p tcp --dport 8883 -j DROP >/dev/null 2>&1 || iptables -A INPUT -p tcp --dport 8883 -j DROP
  iptables -C INPUT -p tcp --dport 1883 -j DROP >/dev/null 2>&1 || iptables -A INPUT -p tcp --dport 1883 -j DROP
  sleep 5
  now_timestamp=\$(date +%s)
done
EOF
  chmod 755 $deny_mqtt_port_shell_path
  hostname_shell_path="/etc/init.d/hostname.sh"
  grep -q $deny_mqtt_port_shell_path $hostname_shell_path || echo -e "\n/bin/bash $deny_mqtt_port_shell_path > /dev/null 2>&1 &" >>$hostname_shell_path
}

function main() {
  remount_write
  recount
  echo "第 $count 次去控制"
  handle_usr_bin
  handle_etc_init_d
  handle_fota_config
  handle_hosts
  handle_mqtt_port
  remount_read
  echo "去除远控已完成，请重启。。。"
}

main
