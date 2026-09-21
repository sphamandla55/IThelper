export type StepType = 'question' | 'action' | 'resolved' | 'escalate';

export interface Option {
  label: string;
  nextId: string;
}

export interface Step {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  options?: Option[];
  tips?: string[];
}

export interface Category {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  steps: Record<string, Step>;
  startId: string;
}

export const categories: Category[] = [
  {
    id: 'internet',
    title: 'Internet / Network',
    icon: 'Wifi',
    description: 'Connection drops, slow speeds, or no internet',
    color: 'blue',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'What best describes your internet issue?',
        options: [
          { label: 'No internet connection at all', nextId: 'no_connection' },
          { label: 'Internet is very slow', nextId: 'slow_internet' },
          { label: 'Wi-Fi connects but no internet access', nextId: 'wifi_no_internet' },
          { label: 'Connection keeps dropping', nextId: 'intermittent' },
        ],
      },
      no_connection: {
        id: 'no_connection',
        type: 'action',
        title: 'Check your router and modem',
        description: 'Look at the lights on your router/modem. Are they all showing as normal (typically solid green)?',
        tips: ['Power lights should be solid', 'Internet/WAN light should be on', 'If any lights are red or off, that\'s a clue'],
        options: [
          { label: 'Yes, lights look normal', nextId: 'restart_router' },
          { label: 'No, lights look abnormal or device is off', nextId: 'power_cycle' },
        ],
      },
      power_cycle: {
        id: 'power_cycle',
        type: 'action',
        title: 'Power cycle your modem and router',
        description: 'Unplug both your modem and router from the wall. Wait 30 seconds, then plug the modem back in first. Wait 1 minute, then plug in the router. Wait another 2 minutes.',
        tips: ['Always restart modem before router', 'Wait for full boot cycle', 'Check if your ISP has an outage in your area'],
        options: [
          { label: 'Internet is back!', nextId: 'resolved_restart' },
          { label: 'Still no internet', nextId: 'isp_outage' },
        ],
      },
      restart_router: {
        id: 'restart_router',
        type: 'action',
        title: 'Restart your router',
        description: 'Even if lights look normal, a quick restart often resolves hidden connection issues. Unplug the router, wait 30 seconds, then plug it back in.',
        options: [
          { label: 'Internet is back!', nextId: 'resolved_restart' },
          { label: 'Still no internet', nextId: 'device_test' },
        ],
      },
      device_test: {
        id: 'device_test',
        type: 'question',
        title: 'Test another device',
        description: 'Try connecting a different device (phone, tablet, another computer) to the same network. Does that device have internet?',
        options: [
          { label: 'Yes, other devices work fine', nextId: 'device_specific' },
          { label: 'No, no devices can connect', nextId: 'isp_outage' },
        ],
      },
      device_specific: {
        id: 'device_specific',
        type: 'action',
        title: 'The issue is with this specific device',
        description: 'Try forgetting the Wi-Fi network and reconnecting. Go to your network settings, find your Wi-Fi name, select "Forget" or "Remove", then reconnect with your password.',
        tips: ['Make sure you know your Wi-Fi password before forgetting the network'],
        options: [
          { label: 'That fixed it!', nextId: 'resolved_reconnect' },
          { label: 'Still not working', nextId: 'network_adapter' },
        ],
      },
      network_adapter: {
        id: 'network_adapter',
        type: 'action',
        title: 'Reset your network adapter',
        description: 'On Windows: Open Command Prompt as Administrator and run "netsh winsock reset". On Mac: Go to System Settings > Network, select your Wi-Fi adapter, and click the minus button to remove it, then add it back.',
        options: [
          { label: 'That fixed it!', nextId: 'resolved_adapter' },
          { label: 'Still not working', nextId: 'escalate_it' },
        ],
      },
      isp_outage: {
        id: 'isp_outage',
        type: 'action',
        title: 'Check for ISP outages',
        description: 'Use your phone\'s mobile data to check your Internet Service Provider\'s website or social media for reported outages in your area. You can also check sites like Downdetector.com.',
        options: [
          { label: 'There is a known outage — I\'ll wait', nextId: 'resolved_outage' },
          { label: 'No outage reported', nextId: 'escalate_isp' },
        ],
      },
      slow_internet: {
        id: 'slow_internet',
        type: 'action',
        title: 'Run a speed test',
        description: 'Go to fast.com or speedtest.net on your browser and run a speed test. Compare the result to the internet speed you\'re paying for (check your bill or ISP account).',
        options: [
          { label: 'Speed is much lower than expected', nextId: 'slow_diagnose' },
          { label: 'Speed seems OK — issue might be the app/website', nextId: 'resolved_app_issue' },
        ],
      },
      slow_diagnose: {
        id: 'slow_diagnose',
        type: 'question',
        title: 'Are multiple devices slow?',
        description: 'Check if the slow speeds affect all devices in your home or just one.',
        options: [
          { label: 'All devices are slow', nextId: 'restart_for_speed' },
          { label: 'Only this device is slow', nextId: 'device_slow' },
        ],
      },
      restart_for_speed: {
        id: 'restart_for_speed',
        type: 'action',
        title: 'Restart your router and check peak hours',
        description: 'Restart your router (unplug for 30 seconds). Also check if it\'s peak usage time in your area (evenings). Try connecting via ethernet cable directly to the router if possible.',
        options: [
          { label: 'Speeds improved!', nextId: 'resolved_speed' },
          { label: 'Still slow', nextId: 'escalate_isp' },
        ],
      },
      device_slow: {
        id: 'device_slow',
        type: 'action',
        title: 'Check for background activity on your device',
        description: 'Open your Task Manager (Windows: Ctrl+Shift+Esc) or Activity Monitor (Mac: Spotlight → Activity Monitor). Look for apps using lots of network bandwidth or CPU.',
        tips: ['Updates, backups, and syncs can hog bandwidth', 'Close unnecessary browser tabs and applications'],
        options: [
          { label: 'Found and stopped the culprit', nextId: 'resolved_background' },
          { label: 'Nothing obvious found', nextId: 'escalate_it' },
        ],
      },
      wifi_no_internet: {
        id: 'wifi_no_internet',
        type: 'action',
        title: 'Check the router\'s internet light',
        description: 'Look at your router — find the "Internet" or "WAN" indicator light. Is it on and green (or your router\'s normal color)?',
        options: [
          { label: 'The internet light is off or red', nextId: 'power_cycle' },
          { label: 'Internet light looks normal', nextId: 'dns_issue' },
        ],
      },
      dns_issue: {
        id: 'dns_issue',
        type: 'action',
        title: 'Try changing your DNS settings',
        description: 'Your DNS server might be having issues. Try using Google\'s public DNS: On Windows, go to Network Settings > Change adapter options > Properties > IPv4. Set preferred DNS to 8.8.8.8 and alternate to 8.8.4.4.',
        tips: ['DNS is like the phone book of the internet — if it\'s down, addresses can\'t be found', 'On Mac: System Settings > Network > DNS'],
        options: [
          { label: 'That fixed it!', nextId: 'resolved_dns' },
          { label: 'Still not working', nextId: 'escalate_it' },
        ],
      },
      intermittent: {
        id: 'intermittent',
        type: 'question',
        title: 'When does the connection drop?',
        description: 'Understanding the pattern helps diagnose the cause.',
        options: [
          { label: 'It drops at random times', nextId: 'check_interference' },
          { label: 'It drops when I move away from the router', nextId: 'signal_strength' },
          { label: 'It drops at predictable times (e.g. evenings)', nextId: 'restart_for_speed' },
        ],
      },
      check_interference: {
        id: 'check_interference',
        type: 'action',
        title: 'Check for wireless interference',
        description: 'Other devices can interfere with Wi-Fi: microwaves, baby monitors, neighboring routers, and Bluetooth devices. Try moving your router away from these, or switch your router to use the 5GHz band in its settings.',
        options: [
          { label: 'That fixed it!', nextId: 'resolved_interference' },
          { label: 'Still dropping', nextId: 'update_firmware' },
        ],
      },
      signal_strength: {
        id: 'signal_strength',
        type: 'action',
        title: 'Improve your Wi-Fi signal',
        description: 'Move your router to a more central location in your home. Keep it elevated and away from walls, metal objects, and electronics. Consider a Wi-Fi extender or mesh system for large spaces.',
        options: [
          { label: 'Connection is stable now!', nextId: 'resolved_signal' },
          { label: 'Still having issues', nextId: 'escalate_it' },
        ],
      },
      update_firmware: {
        id: 'update_firmware',
        type: 'action',
        title: 'Update your router firmware',
        description: 'Log into your router\'s admin panel (usually 192.168.1.1 or 192.168.0.1 in a browser). Look for a firmware update option in the settings. Outdated firmware can cause instability.',
        options: [
          { label: 'Updated and working now!', nextId: 'resolved_firmware' },
          { label: 'Still dropping', nextId: 'escalate_it' },
        ],
      },
      resolved_restart: { id: 'resolved_restart', type: 'resolved', title: 'Great! Your internet is back.', description: 'A router restart fixed the issue. If this happens frequently, consider scheduling regular restarts or upgrading your router.' },
      resolved_reconnect: { id: 'resolved_reconnect', type: 'resolved', title: 'Excellent! You\'re back online.', description: 'Reconnecting to the network cleared the issue. This can happen when the device stores a stale network configuration.' },
      resolved_adapter: { id: 'resolved_adapter', type: 'resolved', title: 'Network adapter reset worked!', description: 'Resetting the network stack cleared corrupted settings. Your connection should be stable now.' },
      resolved_app_issue: { id: 'resolved_app_issue', type: 'resolved', title: 'Your internet speed is fine.', description: 'The slowness may be specific to a website or app. Try clearing your browser cache or checking if the service has an outage.' },
      resolved_speed: { id: 'resolved_speed', type: 'resolved', title: 'Speeds are back to normal!', description: 'The router restart helped. If speeds remain slow during peak hours, contact your ISP about upgrading your plan.' },
      resolved_background: { id: 'resolved_background', type: 'resolved', title: 'Problem solved!', description: 'Background apps were consuming your bandwidth. Consider disabling automatic updates or backups during work hours.' },
      resolved_dns: { id: 'resolved_dns', type: 'resolved', title: 'DNS change worked!', description: 'Your original DNS server was having issues. Google\'s DNS (8.8.8.8) is faster and more reliable for most users.' },
      resolved_interference: { id: 'resolved_interference', type: 'resolved', title: 'Interference was the culprit!', description: 'Moving away from interference sources improved your Wi-Fi stability.' },
      resolved_signal: { id: 'resolved_signal', type: 'resolved', title: 'Signal strength improved!', description: 'Repositioning the router made a big difference. A Wi-Fi extender or mesh system can help if you have a large home.' },
      resolved_firmware: { id: 'resolved_firmware', type: 'resolved', title: 'Firmware update fixed it!', description: 'Outdated firmware was causing instability. Keep your router firmware updated for best performance and security.' },
      resolved_outage: { id: 'resolved_outage', type: 'resolved', title: 'Confirmed ISP outage.', description: 'This is out of your control. Your ISP is working on it. Check their website for estimated restoration times.' },
      escalate_isp: { id: 'escalate_isp', type: 'escalate', title: 'Contact your Internet Service Provider', description: 'The issue appears to be on your ISP\'s end. Call their support line or use their chat support. Mention that you\'ve already restarted your equipment and confirmed there\'s no known outage.' },
      escalate_it: { id: 'escalate_it', type: 'escalate', title: 'Escalate to IT Support', description: 'You\'ve tried the common fixes. It\'s time to contact your IT support team. They can run deeper diagnostics on your network adapter and device settings.' },
    },
  },
  {
    id: 'computer_wont_start',
    title: 'Computer Won\'t Start',
    icon: 'Power',
    description: 'Black screen, no power, or won\'t boot',
    color: 'red',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'What happens when you press the power button?',
        options: [
          { label: 'Absolutely nothing — no lights, no sound', nextId: 'no_power' },
          { label: 'Fans spin and lights come on, but screen is black', nextId: 'black_screen' },
          { label: 'It starts but gets stuck on the loading screen', nextId: 'stuck_loading' },
          { label: 'It beeps or shows an error message', nextId: 'beep_error' },
        ],
      },
      no_power: {
        id: 'no_power',
        type: 'action',
        title: 'Check your power connections',
        description: 'Make sure the power cable is firmly plugged in at both ends — the computer and the wall outlet. Try a different outlet. If using a power strip or surge protector, test the outlet directly.',
        options: [
          { label: 'It powers on now!', nextId: 'resolved_power' },
          { label: 'Still nothing', nextId: 'battery_check' },
        ],
      },
      battery_check: {
        id: 'battery_check',
        type: 'question',
        title: 'Is this a laptop?',
        options: [
          { label: 'Yes, it\'s a laptop', nextId: 'laptop_battery' },
          { label: 'No, it\'s a desktop', nextId: 'escalate_hardware' },
        ],
      },
      laptop_battery: {
        id: 'laptop_battery',
        type: 'action',
        title: 'Test the laptop battery and charger',
        description: 'Remove the battery (if removable) and try running only on the charger. Check if the charger LED is lit when plugged in. Try a different power adapter if you have one available.',
        options: [
          { label: 'It works on the charger!', nextId: 'resolved_battery' },
          { label: 'Still not powering on', nextId: 'escalate_hardware' },
        ],
      },
      black_screen: {
        id: 'black_screen',
        type: 'question',
        title: 'Is the monitor/screen receiving power?',
        description: 'Check if the monitor has a power indicator light. Is it on? Is the monitor turned on separately?',
        options: [
          { label: 'Monitor is on but showing "No Signal"', nextId: 'display_cable' },
          { label: 'Monitor is off', nextId: 'monitor_power' },
          { label: 'It\'s a laptop — built-in screen is black', nextId: 'laptop_screen' },
        ],
      },
      display_cable: {
        id: 'display_cable',
        type: 'action',
        title: 'Check your display cable',
        description: 'Unplug and firmly re-plug the cable connecting your computer to your monitor (usually HDMI, DisplayPort, or VGA). Try a different cable or port if available. Make sure the monitor is set to the correct input source.',
        options: [
          { label: 'Display came back!', nextId: 'resolved_display' },
          { label: 'Still showing "No Signal"', nextId: 'escalate_hardware' },
        ],
      },
      monitor_power: {
        id: 'monitor_power',
        type: 'action',
        title: 'Turn on the monitor',
        description: 'Press the power button on your monitor (usually on the front or bottom edge). Make sure its power cable is plugged in securely.',
        options: [
          { label: 'That was it — all good now!', nextId: 'resolved_monitor' },
          { label: 'Monitor is on but still no image', nextId: 'display_cable' },
        ],
      },
      laptop_screen: {
        id: 'laptop_screen',
        type: 'action',
        title: 'Try a hard reset',
        description: 'Hold the power button for 10 seconds to fully shut down. Then press it once to restart. If there\'s a small reset pinhole on the bottom, try pressing it with a paperclip.',
        options: [
          { label: 'Screen came back on!', nextId: 'resolved_hard_reset' },
          { label: 'Still a black screen', nextId: 'escalate_hardware' },
        ],
      },
      stuck_loading: {
        id: 'stuck_loading',
        type: 'action',
        title: 'Force shut down and restart',
        description: 'Hold the power button for 10 seconds until the computer turns off. Wait 30 seconds, then press the power button once to start it. If it gets stuck again, try to access Safe Mode.',
        tips: ['On Windows, press F8 or F11 during startup to access recovery options', 'On Mac, hold Command+R during startup for recovery mode'],
        options: [
          { label: 'It booted normally!', nextId: 'resolved_reboot' },
          { label: 'Still stuck', nextId: 'safe_mode' },
        ],
      },
      safe_mode: {
        id: 'safe_mode',
        type: 'action',
        title: 'Boot into Safe Mode',
        description: 'On Windows: Hold Shift while clicking Restart, then choose Troubleshoot > Advanced Options > Startup Settings > Restart, then press 4. On Mac: Hold Shift during startup until you see the Apple logo.',
        options: [
          { label: 'It booted into Safe Mode successfully', nextId: 'safe_mode_success' },
          { label: 'Can\'t get into Safe Mode either', nextId: 'escalate_hardware' },
        ],
      },
      safe_mode_success: {
        id: 'safe_mode_success',
        type: 'action',
        title: 'Safe Mode worked — likely a software issue',
        description: 'Since Safe Mode works, a recently installed app or driver is likely causing the problem. In Safe Mode, uninstall any software you installed recently. Then restart normally.',
        options: [
          { label: 'Restarted and it works now!', nextId: 'resolved_safe_mode' },
          { label: 'Still having issues', nextId: 'escalate_it' },
        ],
      },
      beep_error: {
        id: 'beep_error',
        type: 'action',
        title: 'Note the error or beep pattern',
        description: 'Count the beeps (e.g. 1 long + 2 short) or write down the exact error message on screen. This code helps identify the specific hardware issue — search it online or report it to IT.',
        options: [
          { label: 'I found a solution for the specific error', nextId: 'resolved_error_code' },
          { label: 'I need help interpreting the error', nextId: 'escalate_hardware' },
        ],
      },
      resolved_power: { id: 'resolved_power', type: 'resolved', title: 'Power connection was the fix!', description: 'A loose power cable was preventing the computer from starting. Make sure cables are always firmly seated.' },
      resolved_battery: { id: 'resolved_battery', type: 'resolved', title: 'Battery issue confirmed!', description: 'Your laptop battery needs replacing. It can still be used while plugged in. Contact IT or a repair shop to get a replacement battery.' },
      resolved_display: { id: 'resolved_display', type: 'resolved', title: 'Display cable was the issue!', description: 'The connection between your computer and monitor was loose. Consider replacing the cable if this happens frequently.' },
      resolved_monitor: { id: 'resolved_monitor', type: 'resolved', title: 'Monitor just needed to be turned on!', description: 'All is well now.' },
      resolved_hard_reset: { id: 'resolved_hard_reset', type: 'resolved', title: 'Hard reset worked!', description: 'The laptop was in a hung state. A hard reset cleared it. If this happens often, there may be an underlying software issue worth investigating.' },
      resolved_reboot: { id: 'resolved_reboot', type: 'resolved', title: 'Back up and running!', description: 'The computer recovered after a forced restart. This may have been caused by an incomplete update. Make sure all updates are allowed to finish completely.' },
      resolved_safe_mode: { id: 'resolved_safe_mode', type: 'resolved', title: 'Software conflict resolved!', description: 'A recently installed program was preventing startup. The issue is now resolved.' },
      resolved_error_code: { id: 'resolved_error_code', type: 'resolved', title: 'Error resolved!', description: 'Great troubleshooting! Make note of what caused it in case it happens again.' },
      escalate_hardware: { id: 'escalate_hardware', type: 'escalate', title: 'Hardware repair needed', description: 'The issue appears to be a hardware failure. Contact IT support or a certified repair technician. Do not attempt to open the device yourself as it may void the warranty.' },
      escalate_it: { id: 'escalate_it', type: 'escalate', title: 'Contact IT Support', description: 'You\'ve tried the standard steps. IT support can run diagnostics and may need to repair or reinstall the operating system.' },
    },
  },
  {
    id: 'slow_performance',
    title: 'Slow Performance',
    icon: 'Gauge',
    description: 'Computer feels sluggish or unresponsive',
    color: 'amber',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'How is the slowness affecting you?',
        options: [
          { label: 'Everything is slow — apps, typing, loading', nextId: 'check_resources' },
          { label: 'Only specific apps are slow', nextId: 'specific_app' },
          { label: 'Computer gets slow after using it for a while', nextId: 'heat_issue' },
          { label: 'It\'s slow right after startup', nextId: 'startup_apps' },
        ],
      },
      check_resources: {
        id: 'check_resources',
        type: 'action',
        title: 'Check what\'s using your resources',
        description: 'Open Task Manager (Windows: Ctrl+Shift+Esc) or Activity Monitor (Mac: Spotlight → Activity Monitor). Look at the CPU and Memory columns. Is anything using more than 80%?',
        options: [
          { label: 'Yes, I found something using lots of resources', nextId: 'high_usage' },
          { label: 'No, everything looks normal', nextId: 'disk_space' },
        ],
      },
      high_usage: {
        id: 'high_usage',
        type: 'action',
        title: 'Stop the resource-heavy process',
        description: 'In Task Manager / Activity Monitor, click on the process using the most CPU or Memory, then click "End Task" (Windows) or "Force Quit" (Mac). If it\'s a system process, note the name instead.',
        tips: ['Antivirus scans can temporarily spike CPU usage', 'System updates often run in the background', 'If the process restarts immediately, it may be malware'],
        options: [
          { label: 'Performance improved after stopping it', nextId: 'resolved_process' },
          { label: 'It came back or I couldn\'t stop it', nextId: 'malware_check' },
        ],
      },
      malware_check: {
        id: 'malware_check',
        type: 'action',
        title: 'Run a malware scan',
        description: 'Open Windows Security (Windows) or your installed antivirus software and run a full scan. This can take 30–60 minutes. On Mac, use Malwarebytes (free version) for a scan.',
        options: [
          { label: 'Malware was found and removed', nextId: 'resolved_malware' },
          { label: 'No malware found, still slow', nextId: 'disk_space' },
        ],
      },
      disk_space: {
        id: 'disk_space',
        type: 'action',
        title: 'Check your disk space',
        description: 'Open File Explorer (Windows) or Finder > About This Mac > Storage (Mac). Is your main drive more than 85% full? Low disk space severely impacts performance.',
        options: [
          { label: 'Yes, disk is very full', nextId: 'free_space' },
          { label: 'No, plenty of space available', nextId: 'restart_computer' },
        ],
      },
      free_space: {
        id: 'free_space',
        type: 'action',
        title: 'Free up disk space',
        description: 'On Windows: Search for "Disk Cleanup" and run it. On Mac: Go to Apple menu > About This Mac > Storage > Manage. Empty the Recycle Bin / Trash. Uninstall apps you no longer use.',
        tips: ['Aim to keep at least 15% of your drive free', 'Downloads folder is often a hidden source of large files', 'Move old photos/videos to an external drive or cloud storage'],
        options: [
          { label: 'Freed up space — performance improved!', nextId: 'resolved_disk_space' },
          { label: 'Freed space but still slow', nextId: 'restart_computer' },
        ],
      },
      restart_computer: {
        id: 'restart_computer',
        type: 'action',
        title: 'Restart your computer',
        description: 'A proper restart (not just sleep/hibernate) clears memory, installs pending updates, and gives the system a fresh start. Save your work and choose Restart from the Start/Apple menu.',
        options: [
          { label: 'Much faster after restart!', nextId: 'resolved_restart' },
          { label: 'Still slow after restart', nextId: 'hardware_age' },
        ],
      },
      hardware_age: {
        id: 'hardware_age',
        type: 'question',
        title: 'How old is your computer?',
        options: [
          { label: 'Less than 3 years old', nextId: 'escalate_it' },
          { label: '3–6 years old', nextId: 'upgrade_ram' },
          { label: 'More than 6 years old', nextId: 'old_hardware' },
        ],
      },
      upgrade_ram: {
        id: 'upgrade_ram',
        type: 'action',
        title: 'Consider a hardware upgrade',
        description: 'For computers 3–6 years old, adding more RAM or replacing the hard drive with an SSD can dramatically improve performance. Contact IT support to discuss upgrade options.',
        options: [
          { label: 'Got an upgrade — runs great now!', nextId: 'resolved_upgrade' },
          { label: 'I need help deciding', nextId: 'escalate_it' },
        ],
      },
      old_hardware: {
        id: 'old_hardware',
        type: 'escalate',
        title: 'Hardware replacement may be needed',
        description: 'A computer over 6 years old may struggle with modern software demands. Discuss with IT about whether an upgrade or replacement is more cost-effective.',
      },
      specific_app: {
        id: 'specific_app',
        type: 'action',
        title: 'Restart the slow app',
        description: 'Close the app completely (make sure it\'s not running in the background/system tray) and reopen it. Also check if there are updates available for that specific app.',
        options: [
          { label: 'App is faster now!', nextId: 'resolved_app_restart' },
          { label: 'Still slow after restart', nextId: 'app_cache' },
        ],
      },
      app_cache: {
        id: 'app_cache',
        type: 'action',
        title: 'Clear the app\'s cache',
        description: 'Many apps store temporary data that can slow them down. In your browser: Settings > Clear Browsing Data. In other apps, look for "Clear Cache" in their settings or preferences menu.',
        options: [
          { label: 'Clearing cache helped!', nextId: 'resolved_cache' },
          { label: 'Still slow', nextId: 'reinstall_app' },
        ],
      },
      reinstall_app: {
        id: 'reinstall_app',
        type: 'action',
        title: 'Reinstall the app',
        description: 'Uninstall the application completely, then download and reinstall the latest version from the official website or app store. This fixes corrupted files.',
        options: [
          { label: 'Reinstalling fixed it!', nextId: 'resolved_reinstall' },
          { label: 'Still having issues', nextId: 'escalate_it' },
        ],
      },
      heat_issue: {
        id: 'heat_issue',
        type: 'action',
        title: 'Check for overheating',
        description: 'Feel the bottom and sides of your laptop, or the sides of your desktop tower. Is it very hot? Make sure vents are not blocked. For laptops, use on hard flat surfaces — not beds or pillows.',
        tips: ['Compressed air can clear dust from vents (do this every 6 months)', 'Cooling pads help with laptops that run hot', 'Thermal throttling automatically slows the CPU to prevent damage'],
        options: [
          { label: 'It was very hot — I\'ve improved ventilation', nextId: 'resolved_heat' },
          { label: 'Temperature seems fine', nextId: 'check_resources' },
        ],
      },
      startup_apps: {
        id: 'startup_apps',
        type: 'action',
        title: 'Disable unnecessary startup apps',
        description: 'On Windows: Open Task Manager > Startup tab, right-click and disable anything you don\'t need at startup. On Mac: System Settings > General > Login Items — remove unnecessary apps.',
        tips: ['Only keep essential security software and hardware drivers at startup', 'You can still open other apps manually when needed'],
        options: [
          { label: 'Startup is much faster!', nextId: 'resolved_startup' },
          { label: 'Helped a little but still slow', nextId: 'check_resources' },
        ],
      },
      resolved_process: { id: 'resolved_process', type: 'resolved', title: 'Resource hog stopped!', description: 'Closing that process freed up your system. Monitor Task Manager occasionally to catch runaway processes early.' },
      resolved_malware: { id: 'resolved_malware', type: 'resolved', title: 'Malware removed!', description: 'Your antivirus found and removed the threat. Schedule regular scans and keep your security software up to date.' },
      resolved_disk_space: { id: 'resolved_disk_space', type: 'resolved', title: 'More space = more speed!', description: 'Freeing up disk space improved performance. Try to keep at least 15% of your drive free at all times.' },
      resolved_restart: { id: 'resolved_restart', type: 'resolved', title: 'Restart did the trick!', description: 'Regular restarts are recommended — try to restart at least once a week instead of leaving the computer in sleep mode.' },
      resolved_upgrade: { id: 'resolved_upgrade', type: 'resolved', title: 'Hardware upgrade successful!', description: 'New hardware has given your system a new lease of life.' },
      resolved_app_restart: { id: 'resolved_app_restart', type: 'resolved', title: 'App is running well now!', description: 'Apps can accumulate issues over time. Restarting or updating them regularly keeps them running smoothly.' },
      resolved_cache: { id: 'resolved_cache', type: 'resolved', title: 'Cache cleared — problem solved!', description: 'Old cached data was slowing things down. Clearing the cache periodically is good practice.' },
      resolved_reinstall: { id: 'resolved_reinstall', type: 'resolved', title: 'Fresh install worked!', description: 'The reinstall cleared any corrupted files. You\'re all set.' },
      resolved_heat: { id: 'resolved_heat', type: 'resolved', title: 'Overheating was the issue!', description: 'Good ventilation is critical for performance. Consider getting the fans cleaned professionally if it overheats frequently.' },
      resolved_startup: { id: 'resolved_startup', type: 'resolved', title: 'Startup apps reduced!', description: 'Fewer startup programs means faster boot times. Review your startup apps regularly.' },
      escalate_it: { id: 'escalate_it', type: 'escalate', title: 'Contact IT Support', description: 'You\'ve done a thorough job troubleshooting. IT support can run deeper diagnostics to identify the root cause of the slowness.' },
    },
  },
  {
    id: 'software_errors',
    title: 'App Crashes / Errors',
    icon: 'AlertTriangle',
    description: 'Apps freezing, crashing, or showing errors',
    color: 'orange',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'What kind of issue are you experiencing?',
        options: [
          { label: 'An app freezes and won\'t respond', nextId: 'app_frozen' },
          { label: 'An app crashes and closes unexpectedly', nextId: 'app_crash' },
          { label: 'I\'m getting a specific error message', nextId: 'error_message' },
          { label: 'A program won\'t install', nextId: 'install_fail' },
        ],
      },
      app_frozen: {
        id: 'app_frozen',
        type: 'action',
        title: 'Force close the frozen app',
        description: 'On Windows: Right-click the taskbar > Task Manager, select the app, click "End Task". On Mac: Press Command+Option+Escape, select the app, click "Force Quit".',
        options: [
          { label: 'Closed and reopened — working now', nextId: 'resolved_force_quit' },
          { label: 'App is still frozen / can\'t force close', nextId: 'restart_computer' },
        ],
      },
      restart_computer: {
        id: 'restart_computer',
        type: 'action',
        title: 'Restart your computer',
        description: 'A full restart will close all processes and clear system memory. Save any other open work first.',
        options: [
          { label: 'App works after restart', nextId: 'resolved_restart' },
          { label: 'Still crashing or freezing after restart', nextId: 'update_app' },
        ],
      },
      app_crash: {
        id: 'app_crash',
        type: 'action',
        title: 'Check for app updates',
        description: 'Open the app store or the app\'s built-in update checker. Installing the latest version often fixes crashes that were caused by known bugs.',
        options: [
          { label: 'Update available — installed and working!', nextId: 'resolved_update' },
          { label: 'Already up to date or still crashing', nextId: 'reinstall_app' },
        ],
      },
      update_app: {
        id: 'update_app',
        type: 'action',
        title: 'Update the app',
        description: 'Open the app store or the app\'s help menu to check for updates. Also check if your operating system has pending updates (Settings > Update & Security on Windows, or System Settings > General > Software Update on Mac).',
        options: [
          { label: 'Updates installed — issue resolved!', nextId: 'resolved_update' },
          { label: 'No updates, or still having issues', nextId: 'reinstall_app' },
        ],
      },
      reinstall_app: {
        id: 'reinstall_app',
        type: 'action',
        title: 'Uninstall and reinstall the app',
        description: 'Uninstall the app through Settings > Apps (Windows) or drag to Trash (Mac). Then download and install the latest version from the official source.',
        options: [
          { label: 'Reinstall fixed the issue!', nextId: 'resolved_reinstall' },
          { label: 'Still crashing after reinstall', nextId: 'escalate_it' },
        ],
      },
      error_message: {
        id: 'error_message',
        type: 'action',
        title: 'Search for the exact error message',
        description: 'Copy the exact error text (or take a screenshot). Search for it online — include the app name and error code. Microsoft, Apple, and tech forums often have specific solutions.',
        tips: ['Error codes like "0x80004005" have specific fixes', 'Look for solutions on the official app\'s support page', 'Stack Overflow and Reddit\'s tech support communities are helpful'],
        options: [
          { label: 'Found and applied a fix!', nextId: 'resolved_error_search' },
          { label: 'Can\'t find a solution', nextId: 'escalate_it' },
        ],
      },
      install_fail: {
        id: 'install_fail',
        type: 'action',
        title: 'Check system requirements and permissions',
        description: 'Verify the software supports your operating system version. On Windows, try right-clicking the installer and selecting "Run as administrator". On Mac, check Security & Privacy settings to allow apps from the developer.',
        options: [
          { label: 'Installed successfully!', nextId: 'resolved_install' },
          { label: 'Still failing to install', nextId: 'disk_space_check' },
        ],
      },
      disk_space_check: {
        id: 'disk_space_check',
        type: 'action',
        title: 'Check disk space',
        description: 'Make sure you have enough free space. Most modern apps require at least 2–10 GB. Open File Explorer (Windows) or About This Mac > Storage (Mac) to check.',
        options: [
          { label: 'Freed space and installed successfully!', nextId: 'resolved_install' },
          { label: 'Plenty of space but still failing', nextId: 'escalate_it' },
        ],
      },
      resolved_force_quit: { id: 'resolved_force_quit', type: 'resolved', title: 'App is running normally!', description: 'If freezing happens frequently, check for app updates — it may be a known bug that\'s been fixed.' },
      resolved_restart: { id: 'resolved_restart', type: 'resolved', title: 'Restart cleared the issue!', description: 'Regular restarts keep the system healthy. If this app freezes frequently, consider updating or reinstalling it.' },
      resolved_update: { id: 'resolved_update', type: 'resolved', title: 'Update fixed the crash!', description: 'Keeping apps up to date prevents many crashes. Enable automatic updates where possible.' },
      resolved_reinstall: { id: 'resolved_reinstall', type: 'resolved', title: 'Fresh install worked!', description: 'Reinstalling cleared corrupted files. Your app should now run stably.' },
      resolved_error_search: { id: 'resolved_error_search', type: 'resolved', title: 'Error resolved!', description: 'Great work finding the solution. Bookmarking the source may help if the error recurs.' },
      resolved_install: { id: 'resolved_install', type: 'resolved', title: 'Installation successful!', description: 'The app is installed and ready to use.' },
      escalate_it: { id: 'escalate_it', type: 'escalate', title: 'Contact IT Support', description: 'This issue requires deeper investigation. Contact IT support with the app name, version, and the exact error message or behavior you\'re seeing.' },
    },
  },
  {
    id: 'printer',
    title: 'Printer Issues',
    icon: 'Printer',
    description: 'Won\'t print, offline, or poor quality',
    color: 'green',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'What\'s happening with your printer?',
        options: [
          { label: 'Printer shows as offline', nextId: 'offline' },
          { label: 'Print jobs are stuck in the queue', nextId: 'stuck_queue' },
          { label: 'Printing but quality is poor (streaks, faded, wrong colors)', nextId: 'print_quality' },
          { label: 'Printer won\'t connect or isn\'t detected', nextId: 'not_detected' },
        ],
      },
      offline: {
        id: 'offline',
        type: 'action',
        title: 'Set the printer back online',
        description: 'On Windows: Go to Settings > Bluetooth & devices > Printers & scanners, click your printer, and click "Open print queue". Make sure "Use Printer Offline" is NOT checked in the Printer menu.',
        options: [
          { label: 'Printer is online now!', nextId: 'resolved_online' },
          { label: 'Still showing offline', nextId: 'restart_printer' },
        ],
      },
      restart_printer: {
        id: 'restart_printer',
        type: 'action',
        title: 'Restart the printer and your computer',
        description: 'Turn the printer completely off using its power button. Wait 30 seconds, then turn it back on. Also restart your computer. Make sure all cables are securely connected.',
        options: [
          { label: 'Printer is online after restart!', nextId: 'resolved_restart' },
          { label: 'Still offline', nextId: 'reinstall_printer' },
        ],
      },
      reinstall_printer: {
        id: 'reinstall_printer',
        type: 'action',
        title: 'Remove and re-add the printer',
        description: 'Go to Settings > Printers & scanners, click your printer, and click Remove. Then click "Add a printer or scanner" and follow the setup wizard. You may need to install the driver from the printer manufacturer\'s website.',
        options: [
          { label: 'Reinstalled and working!', nextId: 'resolved_reinstall' },
          { label: 'Can\'t find or add the printer', nextId: 'escalate_it' },
        ],
      },
      stuck_queue: {
        id: 'stuck_queue',
        type: 'action',
        title: 'Clear the print queue',
        description: 'On Windows: Search for "Services", find "Print Spooler", right-click and select "Stop". Then navigate to C:\\Windows\\System32\\spool\\PRINTERS and delete all files inside. Go back to Services, right-click Print Spooler and click "Start".',
        tips: ['On Mac: System Settings > Printers & Scanners, click the printer, then the queue, and delete all jobs'],
        options: [
          { label: 'Queue cleared and printing works!', nextId: 'resolved_queue' },
          { label: 'Queue still stuck', nextId: 'restart_printer' },
        ],
      },
      print_quality: {
        id: 'print_quality',
        type: 'question',
        title: 'What kind of printer is it?',
        options: [
          { label: 'Inkjet printer', nextId: 'inkjet_quality' },
          { label: 'Laser printer', nextId: 'laser_quality' },
        ],
      },
      inkjet_quality: {
        id: 'inkjet_quality',
        type: 'action',
        title: 'Run the inkjet head cleaning utility',
        description: 'In your printer software or Windows printer settings, find the "Maintenance" or "Tools" tab. Run the "Head Cleaning" or "Nozzle Check" utility. This may use some ink but clears clogged nozzles.',
        tips: ['Running a test print pattern shows which nozzles are clogged', 'Low ink levels cause faded prints — check ink levels'],
        options: [
          { label: 'Quality improved after cleaning!', nextId: 'resolved_quality' },
          { label: 'Still poor quality', nextId: 'replace_cartridge' },
        ],
      },
      replace_cartridge: {
        id: 'replace_cartridge',
        type: 'action',
        title: 'Replace low or empty ink cartridges',
        description: 'Check the ink levels in your printer software. Replace any cartridges that are low or empty. Make sure to use compatible cartridges for your printer model.',
        options: [
          { label: 'New cartridges — quality is great!', nextId: 'resolved_cartridge' },
          { label: 'Cartridges are fine but quality is still poor', nextId: 'escalate_it' },
        ],
      },
      laser_quality: {
        id: 'laser_quality',
        type: 'action',
        title: 'Check the toner cartridge',
        description: 'Remove the toner cartridge and gently rock it side-to-side to redistribute the toner. Reinstall it. Check the toner level in the printer software. Also check for any paper jams or debris inside.',
        options: [
          { label: 'Quality improved!', nextId: 'resolved_quality' },
          { label: 'Still printing poorly', nextId: 'replace_toner' },
        ],
      },
      replace_toner: {
        id: 'replace_toner',
        type: 'action',
        title: 'Replace the toner cartridge',
        description: 'The toner cartridge may be at the end of its life. Replace it with a new compatible cartridge for your specific printer model.',
        options: [
          { label: 'New toner fixed the quality!', nextId: 'resolved_cartridge' },
          { label: 'Still having issues', nextId: 'escalate_it' },
        ],
      },
      not_detected: {
        id: 'not_detected',
        type: 'question',
        title: 'How is the printer connected?',
        options: [
          { label: 'USB cable directly to my computer', nextId: 'usb_printer' },
          { label: 'Over Wi-Fi / network', nextId: 'wifi_printer' },
        ],
      },
      usb_printer: {
        id: 'usb_printer',
        type: 'action',
        title: 'Check the USB connection',
        description: 'Try unplugging the USB cable from both the printer and computer, then reconnecting. Try a different USB port on your computer. If you have another USB cable, try that too.',
        options: [
          { label: 'Printer detected after switching ports!', nextId: 'resolved_usb' },
          { label: 'Still not detected', nextId: 'reinstall_printer' },
        ],
      },
      wifi_printer: {
        id: 'wifi_printer',
        type: 'action',
        title: 'Reconnect the printer to Wi-Fi',
        description: 'On the printer\'s control panel, go to Network Settings or Wireless Setup. Select your Wi-Fi network and enter the password. Make sure the printer and computer are on the same network.',
        options: [
          { label: 'Printer reconnected and detected!', nextId: 'resolved_wifi' },
          { label: 'Can\'t connect to Wi-Fi', nextId: 'escalate_it' },
        ],
      },
      resolved_online: { id: 'resolved_online', type: 'resolved', title: 'Printer is online!', description: 'The "Use Printer Offline" setting was accidentally enabled. You\'re ready to print.' },
      resolved_restart: { id: 'resolved_restart', type: 'resolved', title: 'Restart fixed it!', description: 'A fresh start cleared the communication issue between your computer and printer.' },
      resolved_reinstall: { id: 'resolved_reinstall', type: 'resolved', title: 'Printer reinstalled successfully!', description: 'Fresh drivers and setup cleared the problem. Your printer is ready to use.' },
      resolved_queue: { id: 'resolved_queue', type: 'resolved', title: 'Print queue cleared!', description: 'Stuck jobs were blocking new prints. Your printer is working again.' },
      resolved_quality: { id: 'resolved_quality', type: 'resolved', title: 'Print quality restored!', description: 'Running the maintenance cycle cleared the problem. Run it periodically if quality degrades again.' },
      resolved_cartridge: { id: 'resolved_cartridge', type: 'resolved', title: 'New cartridge worked!', description: 'Fresh ink/toner makes a huge difference. Keep a spare on hand so you\'re never caught off guard.' },
      resolved_usb: { id: 'resolved_usb', type: 'resolved', title: 'Printer detected!', description: 'The USB port or cable was the issue. Your printer is now connected and ready.' },
      resolved_wifi: { id: 'resolved_wifi', type: 'resolved', title: 'Printer connected to Wi-Fi!', description: 'Your printer is back on the network and ready to use from any device.' },
      escalate_it: { id: 'escalate_it', type: 'escalate', title: 'Contact IT Support', description: 'The printer issue needs hands-on attention. Contact IT support with your printer model number and a description of the problem.' },
    },
  },
  {
    id: 'password',
    title: 'Password / Login Issues',
    icon: 'KeyRound',
    description: 'Can\'t log in, forgot password, or account locked',
    color: 'purple',
    startId: 'start',
    steps: {
      start: {
        id: 'start',
        type: 'question',
        title: 'What\'s the login issue?',
        options: [
          { label: 'I forgot my password', nextId: 'forgot_password' },
          { label: 'My account is locked after too many attempts', nextId: 'account_locked' },
          { label: 'Password reset email isn\'t arriving', nextId: 'reset_email' },
          { label: 'My password isn\'t working but I know it\'s correct', nextId: 'caps_lock' },
        ],
      },
      forgot_password: {
        id: 'forgot_password',
        type: 'action',
        title: 'Use the "Forgot Password" option',
        description: 'On the login screen, click "Forgot Password" or "Reset Password". Enter your registered email address. Check your inbox (and spam folder) for a reset link.',
        options: [
          { label: 'Reset email arrived and I\'m in!', nextId: 'resolved_reset' },
          { label: 'No reset email arrived', nextId: 'reset_email' },
        ],
      },
      reset_email: {
        id: 'reset_email',
        type: 'action',
        title: 'Check all your email folders',
        description: 'Check your Spam, Junk, and Promotions folders. Add the sender\'s domain to your safe-senders list. Wait 10 minutes — some systems are slow. Try requesting another reset email.',
        tips: ['Check if you\'re looking in the right email account', 'Some corporate systems require IT to reset accounts'],
        options: [
          { label: 'Found the email and reset successfully!', nextId: 'resolved_reset' },
          { label: 'Still no email after 15 minutes', nextId: 'escalate_account' },
        ],
      },
      account_locked: {
        id: 'account_locked',
        type: 'action',
        title: 'Wait for the lockout to expire',
        description: 'Most systems automatically unlock after 15–30 minutes. Do not attempt to log in again during this time as it resets the timer. If this is a work account, contact IT — they can unlock it immediately.',
        options: [
          { label: 'Waited and account unlocked itself', nextId: 'resolved_unlocked' },
          { label: 'Still locked or it\'s a work account', nextId: 'escalate_account' },
        ],
      },
      caps_lock: {
        id: 'caps_lock',
        type: 'action',
        title: 'Check Caps Lock and keyboard',
        description: 'Make sure Caps Lock is OFF (there\'s usually an indicator light on the keyboard or in the login screen). Also check that Num Lock hasn\'t affected your number keys. Try typing the password in a text field to verify it.',
        options: [
          { label: 'Caps Lock was on — logged in now!', nextId: 'resolved_caps' },
          { label: 'Caps Lock is off, still not working', nextId: 'wrong_account' },
        ],
      },
      wrong_account: {
        id: 'wrong_account',
        type: 'action',
        title: 'Verify the username or email',
        description: 'Make sure you\'re using the correct username/email. For work accounts, try your full email address instead of just a username. Check if you have multiple accounts (personal vs work).',
        options: [
          { label: 'Was using the wrong account — fixed!', nextId: 'resolved_wrong_account' },
          { label: 'Username is correct but password fails', nextId: 'forgot_password' },
        ],
      },
      resolved_reset: { id: 'resolved_reset', type: 'resolved', title: 'Password reset successfully!', description: 'You\'re back in. Consider using a password manager to avoid forgetting passwords in the future.' },
      resolved_unlocked: { id: 'resolved_unlocked', type: 'resolved', title: 'Account unlocked!', description: 'You\'re back in. Make sure you\'re using the correct password going forward to avoid future lockouts.' },
      resolved_caps: { id: 'resolved_caps', type: 'resolved', title: 'Caps Lock was the culprit!', description: 'A classic issue! You\'re now logged in. The Caps Lock LED on your keyboard is a handy quick check.' },
      resolved_wrong_account: { id: 'resolved_wrong_account', type: 'resolved', title: 'Correct account found!', description: 'You\'re in. If you manage multiple accounts, a password manager can help keep track of which credentials belong where.' },
      escalate_account: { id: 'escalate_account', type: 'escalate', title: 'Contact IT or Account Support', description: 'Account recovery requires identity verification that only your IT team or the service\'s support team can perform. Contact them with your username and the email address associated with the account.' },
    },
  },
];
