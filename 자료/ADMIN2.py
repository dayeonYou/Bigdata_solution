import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# 폰트 설정 (Windows)
plt.rc('font', family='Malgun Gothic')  # For Windows

# 파일 경로 설정
file_path_investigate = 'C:\\Users\\Y\\Desktop\\busan_flask\\investigate.csv'

# 데이터 불러오기
investigate_data = pd.read_csv(file_path_investigate, encoding='euc-kr')

# 날짜 포맷을 변환하여 일, 월, 년 정보를 추출
investigate_data['조사시기'] = pd.to_datetime(investigate_data['조사시기'])
investigate_data['일'] = investigate_data['조사시기'].dt.date
investigate_data['월'] = investigate_data['조사시기'].dt.to_period('M')
investigate_data['년'] = investigate_data['조사시기'].dt.year

# 사용자로부터 날짜 범위 입력받기
start_date = input("시작 날짜를 입력하세요 (YYYY-MM-DD): ")
end_date = input("종료 날짜를 입력하세요 (YYYY-MM-DD): ")

# 입력한 날짜를 datetime 형식으로 변환
start_date = pd.to_datetime(start_date).date()
end_date = pd.to_datetime(end_date).date()

# 날짜 범위 필터링 함수
def filter_by_date(data, start_date, end_date):
    filtered_data = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
    return filtered_data

# 데이터 필터링 적용
filtered_data = filter_by_date(investigate_data, start_date, end_date)

# 히스토그램 1: 해안길이(m) 분포
bin_edges_coast = range(0, int(filtered_data['해안길이(m)'].max()) + 10, 10)
plt.figure(figsize=(10, 6))
ax1 = sns.histplot(filtered_data['해안길이(m)'], color='skyblue', bins=bin_edges_coast, kde=False)
plt.title('조사 데이터 - 해안길이(m) 분포')
plt.xlabel('해안길이(m)')
plt.ylabel('빈도')

# 히스토그램 1을 이미지로 저장
plt.savefig('coastline_histogram.png')
plt.close()  # plt.show() 대신 그래프를 닫음

# 히스토그램 2: 예측량(L) 분포
bin_edges_prediction = range(0, int(filtered_data['예측량(L)'].max()) + 1000, 1000)
plt.figure(figsize=(10, 6))
ax2 = sns.histplot(filtered_data['예측량(L)'], color='skyblue', bins=bin_edges_prediction, kde=False)
plt.title('조사 데이터 - 예측량(L) 분포')
plt.xlabel('예측량(L)')
plt.ylabel('빈도')

# 히스토그램 2를 이미지로 저장
plt.savefig('prediction_volume_histogram.png')
plt.close()

# HTML 파일 생성
html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Histogram Visualization</title>
</head>
<body>
    <h1>조사 데이터 시각화</h1>
    <h2>해안길이(m) 분포</h2>
    <img src="coastline_histogram.png" alt="Coastline Histogram">

    <h2>예측량(L) 분포</h2>
    <img src="prediction_volume_histogram.png" alt="Prediction Volume Histogram">
</body>
</html>
"""

# HTML 파일 저장
with open("histogram_visualization.html", "w", encoding="utf-8") as file:
    file.write(html_content)

print("HTML 파일이 생성되었습니다: histogram_visualization.html")
