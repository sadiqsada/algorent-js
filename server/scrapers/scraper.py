from audioop import add
import re
import sys
from warnings import filters
from webbrowser import get
import requests
from geopy.geocoders import Nominatim
from bs4 import BeautifulSoup as bs
import time
import ast

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

def scrape_remax_fast_filter(url, limit, filter):
	#padded url = "?page=1&filters={}"
	base_url = "https://www.remax.com"
	#filters={"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}
	url+="?filters="+str(filter) #Please make sure filter is in the form of: {"minBeds":2, "minBaths":2, "minPrice":"1000000","maxPrice":"10000000"}
	page = requests.get(url)
	soup = bs(page.content, "lxml")
	href_stats = []
	all_links = soup.find_all('a', href=True)
	for a in all_links:
		if("home-details" in a['href']):
			href_stats.append([base_url+a['href']])
			limit-=1
		if(limit < 0):
			break
	return href_stats #Give a portion first -> gives independed sites


def scrape_remax_full(url, limit): 
	base_url = url #should be something like this: https://www.remax.com/homes-for-sale/ny/jamaica/zip/11432 
	page = requests.get(base_url)
	soup = bs(page.content, "lxml")
	house_info = []
	curr_url = base_url + "?page=" + str(1) + "&filters={}" #apply filters if there are any
	page = requests.get(curr_url)
	soup = bs(page.content, "lxml")
	scripts = soup.find_all('script', {"type":"application/ld+json"})[1:]	
	for script in scripts:
		content = str(script.contents)[1:-1]
		try: 	
			house_info.append(ast.literal_eval(content))
		except Exception as err: 
			pass
	return house_info


def process_remax_page_fast(url):
	page = requests.get(url)
	soup = bs(page.content, "lxml")
	info_list = {}
	image = [] #kept like this in case we want more images in the future
	title = str(soup.find("title"))
	address = title[7:title.find(" |")]
	all_img = soup.find_all("img")
	divs = soup.find_all("div", class_="data-value")
	#print(str(divs))
	amens = [0,0,0]
	counter = 0
	for div in divs:
		#print(str(div), "\n\n\n")
		content = div.contents[0].replace('\n', ' ').replace(' ','')
		#price = max(price, d)
		if(str.isdigit(content) and int(content) < 10):
			amens[counter] = int(content)
			counter+=1
			if(counter>=len(amens)):
				break
	amens = amens[1:] #first 2 are the same
	#print("amens: ", amens)
	price = max([t.contents[0].replace('\n', ' ').replace(' ','') for t in divs if "$" in t.contents[0]])
	#print("Prices?: ", price)
	for img in all_img:
		img_url = None
		try:
			img_url = img['data-src']
		except Exception as ex:
			pass
		if(img_url is not None and len(img_url) > 10):
			image.append(img_url)#We only need the first
			break
	print(image[0], "|", address, "|", price, "|", amens[0], "|", amens[1], "**") # amens[0] -> numBathrooms
																			  # amens[1] -> numBedrooms
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

def house_info_from_address_filter(address, filters):
	comp_address = get_complete_addr_link(address) if "state" not in address or "city" not in address or "zip" not in address else address
	state = comp_address["state"].replace(" ", "+")
	city = comp_address["city"].replace(" ", "+")
	zip = comp_address["postcode"].replace(" ", "+") if "postcode" in comp_address else comp_address["zip"]
	BASE_URL = "https://www.remax.com"
	EXTENDED_URL = "/homes-for-sale/"+state+"/"+city+"/zip/"+zip
	SEARCH_URL = BASE_URL+EXTENDED_URL
	#print("Search Link: ", SEARCH_URL)
	display_page_links = scrape_remax_fast_filter(SEARCH_URL, 15, filter)
	#print(display_page_links)
	#print("Links Obtained: ", display_page_links)
	house_info = []
	for link in display_page_links:
		house_info.append(process_remax_page_fast(link[0]))
	return house_info

#print("Arguments Given: ", sys.argv)
my_args = sys.argv[1:]
if(len(my_args) > 0):
	addr_filter = my_args[0].split("**")
	addr = addr_filter[0]
	filter = addr_filter[1] if len(addr_filter) > 1 else None
	split_address = addr_filter[0].split("|")
	state = split_address[0] if len(split_address) >= 1 else ""
	city = split_address[1] if len(split_address) >= 2 else ""
	zip = split_address[2] if len(split_address) >= 3 else ""
	address = {"state":state, "city":city, "zip": zip}
	#print("Address is: ", address, "\n")
	#house_info = house_info_from_address(address)
	if(filter != None and len(filter) > 0):
		house_info = house_info_from_address_filter(address, filter)
	else:
		house_info = house_info_from_address(address)










#Notes
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
process_remax_page_fast("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")
#scrape_remax_full("https://www.remax.com/homes-for-sale/ny/Ozone+Park/zip/11417", 15)
#test = json.loads('{"@context":"http://schema.org","@type":"Event","startDate":"2022-03-27T13:00:00","endDate":"2022-03-27T14:30:00","name":"Open House: 1:00PM - 2:30PM","description":"Come check out 8429 153RD AVE APT 2E, Howard Beach, NY 11414 on 2022-03-27","url":"https://www.remax.com/ny/howard-beach/home-details/8429-153rd-ave-apt-2e-howard-beach-ny-11414/103119237366100466","offers":{"@type":"Offer","priceCurrency":"USD","price":458000,"availability":"http://schema.org/InStock","url":"https://www.remax.com/ny/howard-beach/home-details/8429-153rd-ave-apt-2e-howard-beach-ny-11414/103119237366100466","validFrom":"2022-03-27T13:00:00"},"image":"https://s3.amazonaws.com/rets-images-matrix-hgar/639e6f09cbbbd29fb31d6800d864ae96563847d5-1-medium.jpeg","performer":{"@type":"Thing","name":"Chuan Wang Chen"},"location":{"@type":"Place","name":"8429 153RD AVE APT 2E","address":{"@type":"PostalAddress","streetAddress":"8429 153RD AVE APT 2E","addressLocality":"Howard Beach","addressRegion":"NY","postalCode":"11414","addressCountry":"USA"}}}')
#print("Test is: \n", test)

