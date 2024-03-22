#숫자 맞추기 게임
#이진탐색 사용
#깃허브 푸시

cnt = 1
max = int(input("숫자 게임 최대 값을 입력해주세요: "))
min = 0
print("1부터 200까지의 숫자를 하나 생각하세요.")
input("준비가 되었으면 Enter를 누르세요\n")

while True:
    mid = (max + min) // 2
    print("당신이 생각한 숫자는 %d 입니까?" %mid)
    updown = input("제가 맞췄다면 '맞음', 제가 제시한 숫자보다 크다면 '큼', 작다면 '작음'을 입력해주세요: ")
    
    if updown == "큼":
        min = mid
        cnt += 1

    if updown == "작음":
        max = mid
        cnt += 1
        
    if updown == "맞음":
        print("%d번 만에 맞췄다" %cnt)
        break

    else:
        raise TypeError('똑바로 하자')
