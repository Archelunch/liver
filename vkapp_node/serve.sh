git pull origin vkapp
npm run build
webpack-dev-server --https --cert=/etc/letsencrypt/live/handsapp.fun/fullchain.pem --key=/etc/letsencrypt/live/handsapp.fun/privkey.pem --host handsapp.fun --port 3000 --content-base build b
