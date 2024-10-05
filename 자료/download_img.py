import requests

def download_image(image_url, save_path):
    # 이미지 URL에서 파일 다운로드
    response = requests.get(image_url)

    # 요청이 성공했는지 확인
    if response.status_code == 200:
        # 받은 파일을 바이너리 모드로 로컬에 저장
        with open(save_path, 'wb') as f:
            f.write(response.content)
        print(f"이미지가 {save_path}에 저장되었습니다.")
    else:
        print(f"이미지 다운로드 실패: {response.status_code}")

# Firebase Storage URL
image_url = 'https://storage.googleapis.com/busandata-81165.appspot.com/coastline_histogram.png'
# 저장할 로컬 경로
save_path = 'C:/user/coastline_histogram.png'

# 이미지 다운로드 및 저장
download_image(image_url, save_path)
