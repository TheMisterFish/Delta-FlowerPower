FROM python:3
USER root

WORKDIR /


##### Other misc config
# Install python3
RUN apt-get update \
  && pip3 install --upgrade pip

# Install wine for making .exe
RUN apt-get install -y wine
RUN wget https://www.python.org/ftp/python/2.7.9/python-2.7.9.amd64.msi
RUN dpkg --add-architecture i386 && apt-get update && apt-get install -y wine32
RUN wine msiexec /i python-2.7.9.amd64.msi /qb

#COPY ./backend ~/.wine/drive_c/backend

#RUN wine "C:\Python27\python.exe" Scripts/pip.exe install pyinstaller
#RUN wine "C:\Python27\python.exe" pip --version
#RUN wine "C:\Python27\python.exe" ~/.wine/drive_c/
RUN wine "C:\Python27\python.exe" -m pip --version
RUN wine "C:\Python27\python.exe" -m pip install -r ~/.wine/drive_c/backend/requirements.txt
RUN wine "C:\Python27\python.exe" -m pyinstaller backend/api.py --noconfirm --distpath backenddist







