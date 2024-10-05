import pandas as pd
import scipy.stats as stats
import matplotlib.pyplot as plt
import seaborn as sns
import matplotlib.font_manager as fm
import mpld3

# 나눔고딕 폰트 경로 설정 (Windows의 경우)
#font_path = 'C:/Windows/Fonts/NanumGothic.ttf'
#font_prop = fm.FontProperties(fname=font_path)
plt.rc('font', family='Malgun Gothic') # For Windows
#plt.rc('font', family=font_prop.get_name())

# 파일 경로 설정
file_path_investigate = 'C:\\Users\\Y\\Desktop\\busan_flask\\investigate.csv'

# 데이터 불러오기
investigate_data = pd.read_csv(file_path_investigate, encoding='euc-kr')

import numpy as np
import matplotlib.colors as mcolors

# 조사결과 데이터를 불러온 후, 날짜 포맷을 변환하여 일, 월, 년 정보를 추출
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
    # 입력된 날짜 범위에 해당하는 데이터 필터링
    filtered_data = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
    return filtered_data

# 데이터 필터링 적용
filtered_data = filter_by_date(investigate_data, start_date, end_date)

# 해안길이(m) 분포 히스토그램
#plt.figure(figsize=(10, 6))
bin_edges_coast = np.arange(0, filtered_data['해안길이(m)'].max() + 10, 10)
ax1 = sns.histplot(filtered_data['해안길이(m)'], color='skyblue', bins=bin_edges_coast, kde=False)


offset = 2

# 빈도수가 0인 구간을 숨기기
for p in ax1.patches:
    height = p.get_height()
    if height > 0:  # 빈도수가 0이 아닐 때만 레이블 추가
        ax1.annotate(f'{int(height)}', (p.get_x() + p.get_width() / 2., height),
                    ha='center', va='baseline', fontsize=10, color='black', xytext=(0, 5),
                    textcoords='offset points')
    else:
        p.set_visible(False)  # 빈도수가 0인 구간 숨기기


plt.title('조사 데이터 - 해안길이(m) 분포')
plt.xlabel('해안길이(m)')
plt.ylabel('빈도')
plt.show()

# 첫 번째 히스토그램을 HTML로 저장
html_str1 = mpld3.fig_to_html(plt.gcf())
with open("coastline_histogram.html", "w") as f:
    f.write(html_str1)

# 예측량(L) 분포 히스토그램
#plt.figure(figsize=(10, 6))
bin_edges_prediction = np.arange(0, filtered_data['예측량(L)'].max() + 1000, 1000)
ax2 = sns.histplot(filtered_data['예측량(L)'], color='skyblue',bins=bin_edges_prediction, kde=False)

# 빈도수가 0인 구간을 숨기기
for p in ax2.patches:
    height = p.get_height()
    if height > 0:  # 빈도수가 0이 아닐 때만 레이블 추가
        ax2.annotate(f'{int(height)}', (p.get_x() + p.get_width() / 2., height),
                    ha='center', va='baseline', fontsize=10, color='black', xytext=(0, 5),
                    textcoords='offset points')
    else:
        p.set_visible(False)  # 빈도수가 0인 구간 숨기기

plt.title('조사 데이터 - 예측량(L) 분포')
plt.xlabel('예측량(L)')
plt.ylabel('빈도')
plt.show()

# 두 번째 히스토그램을 HTML로 저장
html_str2 = mpld3.fig_to_html(plt.gcf())
with open("prediction_volume_histogram.html", "w") as f:
    f.write(html_str2)

import matplotlib.pyplot as plt
from IPython.display import display
import matplotlib.colors as colors
import plotly.graph_objects as go

# '경도' 변수를 float 타입으로 변환 (변환 불가능한 값은 NaN으로 처리)
investigate_data['경도'] = pd.to_numeric(investigate_data['경도'], errors='coerce')

# NaN 값이 포함된 행 제거 (경도 변환 시 발생한 NaN)
investigate_data = investigate_data.dropna(subset=['위도', '경도'])

#일,월,년별 수거예측량 가시화

import plotly.graph_objects as go
import pandas as pd

# 사용자로부터 날짜 범위 입력받기
start_date = input("시작 날짜를 입력하세요 (YYYY-MM-DD): ")
end_date = input("종료 날짜를 입력하세요 (YYYY-MM-DD): ")

# 입력한 날짜를 datetime 형식으로 변환
start_date = pd.to_datetime(start_date).date()
end_date = pd.to_datetime(end_date).date()

# 날짜 범위 필터링 함수
def filter_by_date(data, start_date, end_date):
    # 입력된 날짜 범위에 해당하는 데이터 필터링
    filtered_data = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
    return filtered_data

# Plotly Scattermapbox를 사용하여 위치 기반 시각화 (필터링된 데이터로)
def create_filtered_plotly_map(data, start_date, end_date):
    # 날짜 필터링을 적용
    filtered_data = filter_by_date(data, start_date, end_date)

    # 기존 시각화 코드를 적용 (필터링된 데이터로)
    center_lat = filtered_data['위도'].mean()
    center_lon = filtered_data['경도'].mean()

    # 지도 생성 (생략된 기존 코드 포함)
    fig = go.Figure()

    # 년도별, 월별, 일별 데이터 필터링 및 시각화 (기존 코드 재사용)
    for year in filtered_data['년'].unique():
        yearly_data = filtered_data[filtered_data['년'] == year]
        fig.add_trace(go.Scattermapbox(
            lat=yearly_data['위도'],
            lon=yearly_data['경도'],
            mode='markers',
            marker=dict(
                size=yearly_data['예측량(L)'] / yearly_data['예측량(L)'].max() * 100,
                color=yearly_data['예측량(L)'],
                colorscale=[[0, 'lightpink'], [1, 'purple']],
                cmin=yearly_data['예측량(L)'].min(),
                cmax=yearly_data['예측량(L)'].max(),
                sizemode='area',
                showscale=True,
                opacity=0.8
            ),
            hovertemplate="<b>%{hovertext}</b><br>수거 예측량: %{customdata} L<extra></extra>",
            hovertext=yearly_data['해안명'],
            customdata=yearly_data['예측량(L)'],
            name=f'Year {year}',
            visible=(year == filtered_data['년'].min())
        ))

    # 나머지 월별, 일별 데이터 추가 부분 생략 (기존 코드와 동일)

    # 지도 및 레이아웃 설정
    # Plotly 지도 및 레이아웃 설정에서 나눔고딕 폰트 적용
    fig.update_layout(
        mapbox_style="open-street-map",
        mapbox=dict(center={"lat": center_lat, "lon": center_lon}, zoom=10),
        margin={"r": 0, "t": 50, "l": 0, "b": 0},
        title=f"Marine Waste Collection Prediction ({start_date} - {end_date})",
        font=dict(family="NanumGothic", size=18)  # 여기서 나눔고딕 폰트를 설정
    )


    # HTML 파일로 저장
    html_file_path = 'waste_prediction_map.html'
    fig.write_html(html_file_path)
    print(f"HTML 파일로 저장되었습니다: {html_file_path}")

# 함수 실행 예시
create_filtered_plotly_map(investigate_data, start_date, end_date)

#일,월,년별 쓰레기분포 가시화

import plotly.graph_objects as go
import pandas as pd

# 주요 쓰레기 종류 번호를 이름으로 매핑
waste_type_mapping = {
    1: '폐어구류',
    2: '부표류',
    3: '생활쓰레기류',
    4: '대형 투기쓰레기류',
    5: '초목류'
}

# '주요쓰레기종류' 열을 이름으로 변환
investigate_data['주요쓰레기종류_이름'] = investigate_data['주요쓰레기종류'].map(waste_type_mapping)

# 쓰레기 종류별 색상 설정 (이름 기준으로 매핑)
color_dict = {
    '폐어구류': 'red',
    '부표류': 'blue',
    '생활쓰레기류': 'green',
    '대형 투기쓰레기류': 'purple',
    '초목류': 'orange'
}

# 주요 쓰레기 종류별 색상을 이름에 매핑
investigate_data['color'] = investigate_data['주요쓰레기종류_이름'].map(color_dict)

# 사용자로부터 날짜 범위 입력받기
start_date = input("시작 날짜를 입력하세요 (YYYY-MM-DD): ")
end_date = input("종료 날짜를 입력하세요 (YYYY-MM-DD): ")

# 입력한 날짜를 datetime 형식으로 변환
start_date = pd.to_datetime(start_date).date()
end_date = pd.to_datetime(end_date).date()

# 입력된 날짜 범위에 맞는 데이터 필터링
filtered_df = investigate_data[(investigate_data['일'] >= start_date) & (investigate_data['일'] <= end_date)]

# 시각화할 데이터가 없는 경우 처리
if filtered_df.empty:
    print(f"해당 기간({start_date} - {end_date})에 해당하는 데이터가 없습니다.")
else:
    # Plotly 지도 설정
    fig = go.Figure()

    # 주요 쓰레기 종류별로 데이터를 그룹화하고 범례에 추가
    for waste_type, group in filtered_df.groupby('주요쓰레기종류_이름'):
        fig.add_trace(go.Scattermapbox(
            lat=group['위도'],
            lon=group['경도'],
            mode='markers',
            marker=go.scattermapbox.Marker(size=6, color=group['color']),
            hovertext=[f"해안명: {coast} / 주요 쓰레기 종류: {waste_type}"
                       for coast in group['해안명']],  # hover에 표시될 내용
            hoverinfo="text",  # hover 시 hovertext만 표시
            name=waste_type  # 주요 쓰레기 종류를 범례에 표시
        ))

    # 지도 스타일 설정 및 중심 설정
    fig.update_layout(
        mapbox_style="open-street-map",
        mapbox_zoom=10,
        mapbox_center={"lat": filtered_df['위도'].mean(), "lon": filtered_df['경도'].mean()},
        height=600,
        title=f"날짜별 주요 쓰레기 종류 분포 ({start_date} - {end_date})"
    )

    # HTML 파일로 저장
    html_file_path = 'waste_map.html'
    fig.write_html(html_file_path)
    print(f"HTML 파일로 저장되었습니다: {html_file_path}")

# 함수 실행 예시
create_filtered_plotly_map(investigate_data, start_date, end_date)