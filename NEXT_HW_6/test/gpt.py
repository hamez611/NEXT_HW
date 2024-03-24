from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import csv
import time
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Selenium 드라이버 설정
chromedriver_path ='C:/Users/82107/Desktop/NEXT/Session/NEXT_Session_6/chromedriver-win64/chromedriver.exe'

user_data_dir = "C:/Users/82107/Desktop/NEXT/Session/NEXT_Session_6/cache"

chrome_options = Options()
chrome_options.add_argument("--headless")#f"user-data-dir={user_data_dir}")
service = Service(executable_path=chromedriver_path)

driver = webdriver.Chrome(service=service, options=chrome_options)

driver.get('https://biz.korea.ac.kr/undergraduate/exchange.html')

# 결과를 저장할 CSV 파일을 생성
csv_file = open('경영대 교환학생 협정교.csv', 'w', newline='', encoding='utf-8')
writer = csv.writer(csv_file)
# CSV 파일에 헤더 작성
writer.writerow(['No', '국가명', '대학명', '단과대학명'])

# 페이지 로딩 대기
infos = driver.find_elements(By.XPATH, '//*[@id="wrap"]/main/div[2]/section/div/div[2]/div/table/tbody')
# 페이지를 하나씩 넘기면서 정보를 수집
while True:

    for i, info in enumerate(infos,start=1):  # 첫번째 행은 헤더라고 가정하고 건너뜁니다.
        no = info.find_element(By.XPATH,f'/html/body/div[2]/main/div[2]/section/div/div[2]/div/table/tbody/tr{i}/th').text
        country = info.find_element(By.XPATH, f'/html/body/div[2]/main/div[2]/section/div/div[2]/div/table/tbody/tr{i}/td[1]/a/span[1]').text
        university = info.find_element(By.XPATH, f'/html/body/div[2]/main/div[2]/section/div/div[2]/div/table/tbody/tr{i}/td[1]/a/span[2]').text
        college = info.find_element(By.XPATH, f'/html/body/div[2]/main/div[2]/section/div/div[2]/div/table/tbody/tr{i}/td[1]/a/span[3]').text
        
        # CSV 파일에 쓰기
        writer.writerow([no, country, university, college])
    
    # 다음 페이지로 넘어가는 버튼이 있는지 확인하고 클릭
    try:
        next_button = driver.find_element(By.XPATH, '//*[contains(@class,"next_page")]')
        next_button.click()
    except Exception as e:
        print("Last page reached or next button not found.")
        break
    
    # 페이지 로딩 대기
    time.sleep(2)

# 파일 닫기
csv_file.close()

# 드라이버 종료
driver.quit()
