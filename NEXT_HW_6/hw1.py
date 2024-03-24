from bs4 import BeautifulSoup as bs
import requests
from datetime import datetime
from openpyxl import Workbook

url = 'https://www.daangn.com/hot_articles'



try: 
    headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        soup = bs(response.text, 'html.parser')
        
        #상품명
        items = soup.select('#content > section > article > a > div.card-desc > h2.card-title')
        items = list(map(lambda x: x.text.strip(), items))
        #print(items)
        
        #가격
        prices = soup.select('#content > section > article > a > div.card-desc > div.card-price')
        prices = list(map(lambda x: x.text.strip(), prices))
        #print(prices)
        
        #주소지
        addresses = soup.select('#content > section > article > a > div.card-desc > div.card-region-name')
        addresses = list(map(lambda x: x.text.strip(), addresses))
        #print(address)
        
        wb = Workbook()
        ws = wb.active
        ws.append(["상품명","가격","지역"])
        
        for item, price, address in zip(items, prices, addresses):
            ws.append([item, price, address])
        
        today = datetime.now().strftime('%Y%m%d')
        filename= f'{today}당근 중고거래 인기매물 with requests.xlsx'
        wb.save(filename)
        print(f"엑셀 파일 저장 완료: {filename}")
        
    else:
        print(f'Error {response.status_code}')

except requests.exceptions.RequestException as e:
    print(f"Error: 요청 중 오류 발생. 오류 메시지: {e}")