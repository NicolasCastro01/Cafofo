deploy:
	ssh -t ubuntu@$(ORACLE_REMOTE_SERVER_IP) '\
		cd ~/projects/cafofo-chat \
		&& docker compose down --rmi all \
		&& git pull origin main \
		&& docker compose up -d \
	'
