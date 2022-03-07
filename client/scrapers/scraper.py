from audioop import add
import re
import sys
from webbrowser import get
import requests
from geopy.geocoders import Nominatim
from bs4 import BeautifulSoup as bs
import time

def scrape_remax(url):
	base_url = "https://www.remax.com"
	page = requests.get(url)
	soup = bs(page.content, "html.parser")
	href_stats = []
	for a in soup.find_all('a', href=True):
		if("home-details" in a['href']):
			href_stats.append(base_url+a['href'])
	return href_stats[0:10] #Give a portion first -> gives independed sites

def scrape_remax_fast(url, limit):
	base_url = "https://www.remax.com"
	page = requests.get(url)
	soup = bs(page.content, "lxml")
	href_stats = []
	all_links = soup.find_all('a', href=True)
	for a in all_links:
		if("home-details" in a['href']):
			href_stats.append(base_url+a['href'])
			limit-=1
		if(limit < 0):
			break
	return href_stats #Give a portion first -> gives independed sites

def process_remax_page_fast(url):
	page = requests.get(url)
	soup = bs(page.content, "lxml")
	info_list = {}
	image = [] #kept like this in case we want more images in the future
	title = str(soup.find("title"))
	address = title[7:title.find(" |")]
	all_img = soup.find_all("img")
	for img in all_img:
		img_url = None
		try:
			img_url = img['data-src']
		except Exception as ex:
			pass
		if(img_url is not None and len(img_url) > 10):
			image.append(img_url)#We only need the first
			break
	print(image[0], "|", address, "**")
	return info_list

def process_remax_page(url):
	page = requests.get(url)
	soup = bs(page.content, "html.parser")
	soup_string = str(soup)
	info_list = {}
	image = []
	title = str(soup.find("title"))
	address = title[7:title.find(" |")]
	for img in soup.find_all("img"):
		str_img = str(img)
		if("aws." in str(img)):
			img_split = str_img.split(" ") #Need this?
			img_stripped = str(list(filter(lambda k: 'data-src' in k, img_split)))#Needs this?
			img_url = img_stripped[img_stripped.find("http"):len(img_stripped)-3]
			image.append(img_url)#We only need the first
			break
	info_list["image"] = image
	info_list["address"] =  address
	return info_list

def get_coords(address):
	#address = "32-22 204TH ST BAYSIDE, NY 11361"
	address.replace(" ", "+")
	geolocator = Nominatim(user_agent="html")
	location = geolocator.geocode("175 5th Avenue NYC")
	resp_json_payload = (location.latitude, location.longitude)
	return resp_json_payload

def get_complete_addr_link(address): #format of address : {"country": ,"state": , "city": , "zip": }
	try:
		geolocator = Nominatim(user_agent="html")
		country = address["country"] if "country" in address else "US"
		state = address["state"]
		city = address["city"]
		zip = address["zip"]
		possible_addr = country + " " + state + " " + city + " " + zip
		location = geolocator.geocode(possible_addr, addressdetails=True, language="en")
		#print("The Complete Address is: ", location.raw['address'])
		return location.raw['address']
	except Exception as err:
		#print("Error Encountered: ", err)
		return None #Means Address is invalid

def house_info_from_address(address): #format of address : {"country": ,"state": , "city": , "zip": }
	comp_address = get_complete_addr_link(address) if "state" not in address or "city" not in address or "zip" not in address else address
	state = comp_address["state"].replace(" ", "+")
	city = comp_address["city"].replace(" ", "+")
	zip = comp_address["postcode"].replace(" ", "+") if "postcode" in comp_address else comp_address["zip"]
	BASE_URL = "https://www.remax.com"
	EXTENDED_URL = "/homes-for-sale/"+state+"/"+city+"/zip/"+zip
	SEARCH_URL = BASE_URL+EXTENDED_URL
	#print("Search Link: ", SEARCH_URL)
	display_page_links = scrape_remax_fast(SEARCH_URL, 15)
	#print("Links Obtained: ", display_page_links)
	house_info = []
	for link in display_page_links:
		house_info.append(process_remax_page_fast(link))
	return house_info

#print("Arguments Given: ", sys.argv)
my_args = sys.argv[1:]
if(len(my_args) > 0):
	split_address = my_args[0].split("|")
	state = split_address[0] if len(split_address) >= 1 else ""
	city = split_address[1] if len(split_address) >= 2 else ""
	zip = split_address[2] if len(split_address) >= 3 else ""
	address = {"state":state, "city":city, "zip": zip}
	#print("Address is: ", address, "\n")
	house_info = house_info_from_address(address)

'''
address = {"country": "US", "state": "", "city" : "", "zip":"11432"}
img_urls_from_address(address)
args = sys.argv[1:]
if(len(args) > 0):
	#get_complete_addr_link(address)
	#pages = scrape_remax("https://www.remax.com/homes-for-sale/ny/queens/zip/11432")
	#print(pages)
	#process_remax_page("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")
				 #"BASE URL = https://www.remax.com"
				 #"BASE_URL + /homes-for-sale/<state>/<city>/zip/<zipcode>"
				 #data-src filter
'''
'''
start = time.time()
list = process_remax_page("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")
end = time.time()
print("python time taken: ", 1000*(end - start), "ms")
print("list: \n", list)
'''
#scrape_remax("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")
#Value: KEY WORD: value:"$
#Address: <title> tag -> |
