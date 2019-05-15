git pull
python3.6 manage.py collectstatic --no-input
daphne -e ssl:443:privateKey=/etc/letsencrypt/live/handsapp.fun/privkey.pem:certKey=/etc/letsencrypt/live/handsapp.fun/fullchain.pem online_test.asgi:application