deploy:
	ssh -t ubuntu@$(ORACLE_REMOTE_SERVER_IP) '\
		cd ~/projects/cafofo-chat \
		&& docker compose down --rmi all \
		&& docker compose up -d \
	'
