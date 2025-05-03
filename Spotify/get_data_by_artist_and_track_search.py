import csv
import time
import requests

#####################
# GET THE ACCESS TOKEN
#####################
CLIENT_SECRET = 'CLIENT_SECRET'
CLIENT_ID  = 'CLIENT_ID'
BASE_URL = 'https://api.spotify.com/v1/'
AUTH_URL = 'https://accounts.spotify.com/api/token'

auth_response = requests.post(AUTH_URL, {'grant_type': 'client_credentials', 'client_id': CLIENT_ID, 'client_secret': CLIENT_SECRET})
auth_response_data = auth_response.json()
access_token = auth_response_data['access_token']
headers = {'Authorization': 'Bearer {token}'.format(token=access_token)}


#####################
# GET TRACK DATA FROM SPOTIFY API
#####################

tracks = open(r'\tracks.csv','r',encoding='utf8') #input file with artist names and track names
csvreader = csv.reader(tracks)
output_file1 = open(r'\output_file1.csv','w',encoding='utf8') #output file with appended data

i = 0
for row in csvreader:
  #print("i" + str(i))

  artist=row[0]
  track=row[1]

  if i == 0: #WRITE THE HEADER
    line = '"' + str(artist) + '"'
    line = str(line) + ',"' + str(track) + '"'
    line = str(line) + ',"' + str("RELEASE_DATE") + '"'
    line = str(line) + ',"' + str("ID") + '"'
    line = str(line) + ',"' + str("POPULARITY") + '"'
    line = str(line) + '\n'
    output_file1.write(str(line))
  elif i >= 1: #WRITE THE ROWS
   try:
    request_url = "https://api.spotify.com/v1/search?q=track:" + str(track) + "%20artist:" + str(artist) + "&type=track"
    #print(request_url)
    r = requests.get(request_url, headers=headers)
    #time.sleep(0.5)
    current_track = r.json()["tracks"]["items"][0]

    release_date = current_track["album"]["release_date"]
    track_id = current_track["id"]
    popularity = current_track["popularity"]

    line = '"' + str(artist) + '"'
    line = str(line) + ',"' + str(track) + '"'
    line = str(line) + ',"' + str(release_date) + '"'
    line = str(line) + ',"' + str(track_id) + '"'
    line = str(line) + ',"' + str(popularity) + '"'
    line = str(line) + '\n'
    output_file1.write(str(line))
   except Exception as e:
    print(e)
  i = i + 1

output_file1.flush()
output_file1.close()
input(str(i) + " tracks appended in output_file1")
