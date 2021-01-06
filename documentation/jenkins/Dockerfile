FROM jenkins/jenkins:lts
LABEL maintainer="suyash@suyashkumar.com"
USER jenkins
WORKDIR /usr/src/work
COPY get-docker.sh .
COPY gen_certs.sh .
USER root

# Install Docker CE inside the container
RUN sh get-docker.sh
RUN usermod -aG docker jenkins

# Generate self-signed certs
RUN bash gen_certs.sh
RUN openssl rsa -in server.key -out privkey-rsa.pem
RUN mkdir -p /var/lib/jenkins
RUN cp privkey-rsa.pem /var/lib/jenkins/pk
RUN cp server.pem /var/lib/jenkins/cert
RUN chown jenkins:jenkins /var/lib/jenkins/pk
RUN chown jenkins:jenkins /var/lib/jenkins/cert

# Install docker compose
RUN curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

##### Other misc config
# Install python3
RUN apt-get update \
  && apt-get install -y python3-pip python3-dev \
  && cd /usr/local/bin \
  && ln -s /usr/bin/python3 python \
  && pip3 install --upgrade pip

# Install wine for making .exe
RUN apt-get install -y wine
RUN wget https://www.python.org/ftp/python/2.7.9/python-2.7.9.amd64.msi
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y wine32
RUN wine msiexec /i python-2.7.9.amd64.msi /qb

# Install plugins
ENV JENKINS_UC_DOWNLOAD="http://mirrors.jenkins-ci.org"
#COPY plugins.txt /usr/share/jenkins/plugins.txt
#RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/plugins.txt


COPY ./plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN ls /usr/local/bin/
RUN /usr/local/bin/install-plugins.sh < /usr/share/jenkins/ref/plugins.txt

USER jenkins
ENV JENKINS_OPTS --httpPort=-1 --httpsPort=4430 --httpsCertificate=/var/lib/jenkins/cert --httpsPrivateKey=/var/lib/jenkins/pk
EXPOSE 443
