build:
	cd front && npm run build

send-chat-files-to-remote-server:
	rsync ./ ubuntu@$(ORACLE_REMOTE_SERVER_IP):~/projects/cafofo-chat

send-service-to-remote-server:
	rsync cafofo-chat.service ubuntu@$(ORACLE_REMOTE_SERVER_IP):~/projects/cafofo-chat

deploy:
	build send-chat-files-to-remote-server send-service-to-remote-server

	ssh -t root@$(ORACLE_REMOTE_SERVER_IP) '\
    		sudo mv ~/projects/cafofo-chat/cafofo-chat.service /etc/systemd/system/ \
		&& sudo systemctl enable cafofo-chat \
    		&& sudo systemctl restart cafofo-chat
	'
