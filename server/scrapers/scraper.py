from audioop import add
import sys
from warnings import filters
from webbrowser import get
import requests
from bs4 import BeautifulSoup as bs
import ast
#import cv2
import numpy as np
import copy 


# def histogram_equalization(img_in):
#     # Write histogram equalization here
#     # Fill in your code here
#     HSV = cv2.cvtColor(img_in, cv2.COLOR_RGB2HSV) 
#     img_in_hsv = HSV[:,:,2]
#     total_pix = len(img_in_hsv)*len(img_in_hsv[0])
#     hist = [0 for x in range(256)]
    
#     for r in range(len(img_in_hsv)):
#       for c in range(len(img_in_hsv[r])):
#         hist[img_in_hsv[r][c]] += 1 #Get freq vals for hist
#     pdf = np.true_divide(np.asarray(hist), total_pix) #pdf for hist
#     cdf = [0 for x in range(256)]
#     run_sum = 0
#     for i in range(len(pdf)):
#       run_sum+=pdf[i]
#       cdf[i] = run_sum 
#     #cdf found
#     intensity_output = np.asarray(cdf)*255
#     intensity = img_in_hsv
#     for r in range(len(img_in_hsv)):
#       for c in range(len(img_in_hsv[r])):
#         intensity[r][c] = intensity_output[intensity[r][c]]
#     #print("img out intensity: ", intensity)
#     img_out = copy.deepcopy(HSV)
#     img_out[:,:,2] = intensity
#     img_out = cv2.cvtColor(img_out, cv2.COLOR_HSV2RGB) 
#     return True, img_out

# def sharpen_img(img):
# 	kernel = np.asarray([[0,-1,0],
# 						[-1,4,0],
# 						[0,-1,0]])
# 	return cv2.filter2D(src = img, ddepth = -1, kernel=kernel)
'''
def sharpen_img_colored(img_path):
	imgB = cv2.imread(img_path, cv2.IMREAD_COLOR)
	img_hsv = cv2.cvtColor(imgB, cv2.COLOR_RGB2HSV) 
	hsv_value_sharpened = sharpen_img(img_hsv[:,:,2])
	output_img_sharpened = img_hsv
	output_img_sharpened[:,:,2] = hsv_value_sharpened
	output_img_sharpened = cv2.cvtColor(output_img_sharpened, cv2.COLOR_HSV2RGB) 
	succeed, output_image_sharpened_hist = histogram_equalization(output_img_sharpened)
	return output_image_sharpened_hist[..., ::-1]
	return output_img_sharpened[..., ::-1]
'''
# def sharpen_img_colored(img):
#   img_hsv = cv2.cvtColor(img, cv2.COLOR_RGB2HSV) 
#   hsv_value_sharpened = sharpen_img(img_hsv[:,:,2])
#   output_img_sharpened = img_hsv
#   output_img_sharpened[:,:,2] = hsv_value_sharpened
#   output_img_sharpened = cv2.cvtColor(output_img_sharpened, cv2.COLOR_HSV2RGB) 
#   return output_img_sharpened[..., ::-1]
# import smtplib

def guessLoc(address):
	g_api = "https://maps.googleapis.com/maps/api/"
	place_api = g_api + "place/"
	auto_c = "autocomplete/json?input="
	details_url = "details/json?place_id="
	details_api = place_api + details_url
	req = address 
	api_key = "&key=AIzaSyD96V2GIJeJPJqp7wFky7Z6u53dBI_KCR4"

	auto_crequest = requests.get(place_api + auto_c + req + api_key)
	auto_cresponse = auto_crequest.json()
	#print(auto_cresponse)
	pred = auto_cresponse['predictions'][0]
	address = pred['description']
	place_id = pred['place_id']
	#print("Address: ", address)
	#print("Place ID: ", place_id, "\n")
	details_req = requests.get(details_api + place_id + api_key)
	details = details_req.json()['result']
	address_formatted = details['formatted_address']

	address_component = details['address_components']
	city = None
	state = None
	zip = None 
	for address_c in address_component:
		if('postal_code' in address_c['types']):
			zip = address_c['short_name']
		if('neighborhood' in address_c['types']):
			city = address_c['short_name']
		if('administrative_area_level_1' in address_c['types']):
			state = address_c['short_name']
	output_addr = {"state":state, "city":city, "zip": zip}
	#print(output_addr)
	return output_addr

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
	info_list = ""
	image = [] #kept like this in case we want more images in the future
	title = str(soup.find("title"))
	address = title[7:title.find(" |")]
	all_img = soup.find_all("img")
	divs = soup.find_all("div", class_="data-value")
	#print(str(divs))
	ref_string = "home-details/"
	title = soup.find_all("title")[0]
	address = title.contents[0]#
	address = address[0:address.index('|')]
	address_google = url[url.rfind(ref_string) + len(ref_string):]
	address_google = address_google[0:address_google.index("/")]
	api_key = "AIzaSyD96V2GIJeJPJqp7wFky7Z6u53dBI_KCR4"
	embed_link = "https://www.google.com/maps/embed/v1/place?key=" + api_key + "&q=" + address_google
	link = "https://maps.googleapis.com/maps/api/staticmap?center=" + address_google + "&zoom=13&scale=2&size=600x1000&maptype=roadmap&format=png&key=AIzaSyD96V2GIJeJPJqp7wFky7Z6u53dBI_KCR4"
	link = embed_link

	dark_hex = "0F1210"
	night_style = "&style=element%3Ageometry%7Ccolor%3A0x"+dark_hex+"&style=element%3Alabels.text.stroke%7Ccolor%3A0x242f3e&style=element%3Alabels.text.fill%7Ccolor%3A0x746855&style=feature%3Aadministrative.locality%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Apoi%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Apoi.park%7Celement%3Ageometry%7Ccolor%3A0x263c3f&style=feature%3Apoi.park%7Celement%3Alabels.text.fill%7Ccolor%3A0x6b9a76&style=feature%3Aroad%7Celement%3Ageometry%7Ccolor%3A0x38414e&style=feature%3Aroad%7Celement%3Ageometry.stroke%7Ccolor%3A0x212a37&style=feature%3Aroad%7Celement%3Alabels.text.fill%7Ccolor%3A0x9ca5b3&style=feature%3Aroad.highway%7Celement%3Ageometry%7Ccolor%3A0x746855&style=feature%3Aroad.highway%7Celement%3Ageometry.stroke%7Ccolor%3A0x1f2835&style=feature%3Aroad.highway%7Celement%3Alabels.text.fill%7Ccolor%3A0xf3d19c&style=feature%3Atransit%7Celement%3Ageometry%7Ccolor%3A0x2f3948&style=feature%3Atransit.station%7Celement%3Alabels.text.fill%7Ccolor%3A0xd59563&style=feature%3Awater%7Celement%3Ageometry%7Ccolor%3A0x17263c&style=feature%3Awater%7Celement%3Alabels.text.fill%7Ccolor%3A0x515c6d&style=feature%3Awater%7Celement%3Alabels.text.stroke%7Ccolor%3A0x17263" #google maps api link
	night_link = link

	#print("address is: ", address) 
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
	prices = [t.contents[0].replace('\n', ' ').replace(' ','') for t in divs if "$" in t.contents[0]]
	price = max(prices if len(prices) > 0 else [300000, 0])
	#print("Prices?: ", price)
	num_imgs = 5
	counter = 0
	for img in all_img:
		img_url = None
		try:
			img_url = img['data-src']
		except Exception as ex:
			pass
		if(img_url is not None and len(img_url) > 10):
			image.append(img_url)#We only need the first
		if(counter >= num_imgs):
			break 
		counter+=1
	info_list = str(image) + "|" + address + "|" + str(price) + "|" + str(amens[0]) + "|" + str(amens[1]) + "|" + link + "|" + night_link + "**" # amens[0] -> numBathrooms
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

def get_complete_addr_link(address): #format of address : {"country": ,"state": , "city": , "zip": }
	try:
		geolocator = None#Nominatim(user_agent="html")
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
	house_info = ""
	for link in display_page_links:
		house_info += process_remax_page_fast(link)
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
	house_info = ""
	for link in display_page_links:
		house_info += process_remax_page_fast(link[0])
	return house_info

my_args = sys.argv[1:]
if(len(my_args) > 0):
	addr_filter = my_args[0].split("**")
	addr = addr_filter[0]
	filter = addr_filter[1] if len(addr_filter) > 1 else None
	#print("Addr: ", addr, "Filter: ", filter)
	#print("My Args: ", my_args)
	#sys.exit()
	if(filter == 'G'):
		addr = guessLoc(addr)
		print(addr["state"], ",",addr["city"], ",", addr["zip"])
		#sys.exit()
	else:
		address = None
		if("|" in addr):
			#print("Given |")
			split_address = addr.split("|")
			state = split_address[0] if len(split_address) >= 1 else ""
			city = split_address[1] if len(split_address) >= 2 else ""
			zip = split_address[2] if len(split_address) >= 3 else ""
			address = {"state":state, "city":city, "zip": zip}
		else:
			#print("Given Random Address")
			address = guessLoc(addr)
			
			#print("Complete Address is: ", address)
		#print("Address is: ", address, "\n")
		#house_info = house_info_from_address(address)
		if(filter != None and len(filter) > 0):
			house_info = house_info_from_address_filter(address, filter)
			print(house_info)
		else:
			house_info = house_info_from_address(address)
			print(house_info)







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
#process_remax_page_fast("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")
#scrape_remax_full("https://www.remax.com/homes-for-sale/ny/Ozone+Park/zip/11417", 15)
#test = json.loads('{"@context":"http://schema.org","@type":"Event","startDate":"2022-03-27T13:00:00","endDate":"2022-03-27T14:30:00","name":"Open House: 1:00PM - 2:30PM","description":"Come check out 8429 153RD AVE APT 2E, Howard Beach, NY 11414 on 2022-03-27","url":"https://www.remax.com/ny/howard-beach/home-details/8429-153rd-ave-apt-2e-howard-beach-ny-11414/103119237366100466","offers":{"@type":"Offer","priceCurrency":"USD","price":458000,"availability":"http://schema.org/InStock","url":"https://www.remax.com/ny/howard-beach/home-details/8429-153rd-ave-apt-2e-howard-beach-ny-11414/103119237366100466","validFrom":"2022-03-27T13:00:00"},"image":"https://s3.amazonaws.com/rets-images-matrix-hgar/639e6f09cbbbd29fb31d6800d864ae96563847d5-1-medium.jpeg","performer":{"@type":"Thing","name":"Chuan Wang Chen"},"location":{"@type":"Place","name":"8429 153RD AVE APT 2E","address":{"@type":"PostalAddress","streetAddress":"8429 153RD AVE APT 2E","addressLocality":"Howard Beach","addressRegion":"NY","postalCode":"11414","addressCountry":"USA"}}}')
#print("Test is: \n", test)
#process_remax_page_fast("https://www.remax.com/ny/jamaica/home-details/84-50-169th-st-102-jamaica-ny-11432/9637000322339336887/M00000489/3378032")

'''
imgOrig = cv2.imread("./test_blurry_3.jpeg", cv2.IMREAD_COLOR)[..., ::-1]
imgSharpened = sharpen_img_colored("./test_blurry_3.jpeg")
fig = plt.figure(figsize=(20, 15))
plt.subplot(1, 2, 1)
plt.imshow(imgOrig)
plt.title('original image')
plt.axis("off")
'''

'''
plt.subplot(1, 2, 2)
plt.imshow(imgSharpened)
plt.title('SHARPENED image')
plt.axis("off")
plt.show()
#addr = guessLoc("Jamaica US 11417")
#print(addr)
'''