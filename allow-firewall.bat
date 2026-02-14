@echo off
echo Adding Windows Firewall rule for Vite dev server...
netsh advfirewall firewall add rule name="Vite Dev Server" dir=in action=allow protocol=TCP localport=5173
echo Done! Try accessing http://192.168.2.22:5173/ from your phone now.
pause
