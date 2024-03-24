from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from datetime import datetime
import csv

chromedriver_path ='C:/Users/82107/Desktop/NEXT/Session/NEXT_Session_6/chromedriver-win64/chromedriver.exe'

user_data_dir = "C:/Users/82107/Desktop/NEXT/Session/NEXT_Session_6/cache"

chrome_options = Options()
chrome_options.add_argument(f"--headless")#f"user-data-dir={user_data_dir}")
service = Service(executable_path=chromedriver_path)

driver = webdriver.Chrome(service=service, options=chrome_options)

driver.get('https://www.daangn.com/')
second_handbtn = driver.find_element(By.XPATH,'/html/body/div[1]/div/div/div/nav/ul/li[1]/a')
second_handbtn.click()
time.sleep(1)

morebtn = driver.find_element(By.XPATH, '/html/body/main/section[2]/div[2]/a')
morebtn.click()
time.sleep(1)

today = datetime.now().strftime('%Y%m%d')
file = open(f'{today}당근 중고거래 인기매물 with selenium.csv', 'w', newline='', encoding='utf-8-sig')
writer = csv.writer(file)
writer.writerow(['상품명','가격','지역'])

for i in range(1,99):
    item = driver.find_element(By.CSS_SELECTOR, f'#content > section > article:nth-child({i}) > a > div.card-desc > h2').text#f"/html/body/section/section/article[{i}]/a/div[2]/h2").text
    price = driver.find_element(By.CSS_SELECTOR,f'#content > section > article:nth-child({i}) > a > div.card-desc > div.card-price').text#"/html/body/section/section/article[{i}]/a/div[2]/div[1]").text
    region = driver.find_element(By.CSS_SELECTOR, f'#content > section > article:nth-child({i}) > a > div.card-desc > div.card-region-name').text #"/html/body/section/section/articlep{i}]/a/div[2]/div[2]").text
    #print(item,price,region)
    writer.writerow([item,price,region])

file.close()
driver.quit()