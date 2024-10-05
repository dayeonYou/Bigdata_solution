import matplotlib
matplotlib.use('Agg')  # GUI 백엔드가 아닌 'Agg'로 설정

from flask import Flask, request, jsonify, send_file
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import plotly.graph_objects as go
import firebase_admin
from firebase_admin import credentials, storage

import numpy as np
import heapq
import random
from itertools import permutations

app = Flask(__name__)

UPLOAD_FOLDER = 'C:/user/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the directory exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Firebase Admin SDK setup
cred = credentials.Certificate('busandata-81165-963c6b2551f1.json')
firebase_admin.initialize_app(cred, {
    'storageBucket': 'busandata-81165.appspot.com'
})

def upload_to_firebase(file_path, file_name):
    """Uploads a file to Firebase Storage and returns the download link."""
    bucket = storage.bucket()
    blob = bucket.blob(file_name)
    blob.upload_from_filename(file_path)
    blob.make_public()  # Make the file publically accessible
    return blob.public_url

@app.route('/api/upload-csv', methods=['POST'])
def upload_csv():
    if 'file' not in request.files or 'start_date' not in request.form or 'end_date' not in request.form:
        return jsonify({'error': 'File and date range are required'}), 400

    file = request.files['file']
    start_date_str = request.form['start_date']
    end_date_str = request.form['end_date']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    start_date = pd.to_datetime(start_date_str).date()
    end_date = pd.to_datetime(end_date_str).date()

    investigate_data = pd.read_csv(file_path, encoding='utf-8')
    investigate_data['timestamp'] = pd.to_datetime(investigate_data['timestamp'])
    investigate_data['일'] = investigate_data['timestamp'].dt.date
    investigate_data['월'] = investigate_data['timestamp'].dt.to_period('M')
    investigate_data['년'] = investigate_data['timestamp'].dt.year

    def filter_by_date(data, start_date, end_date):
        filtered_data = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
        return filtered_data

    # 결측치(NaN) 제거 또는 처리
    filtered_data = filter_by_date(investigate_data, start_date, end_date)

    # NaN을 0으로 대체하거나 필요에 따라 다른 값으로 대체
    filtered_data['length'] = filtered_data['length'].fillna(0)
    filtered_data['prediction'] = filtered_data['prediction'].fillna(0)

    # 추가로 결측치 확인 후 삭제하는 방법도 가능
    filtered_data = filtered_data.dropna(subset=['length', 'prediction'])

    # Create coastline histogram
    bin_edges_coast = range(0, int(filtered_data['length'].max()) + 10, 10)
    plt.figure(figsize=(10, 6))
    sns.histplot(filtered_data['length'], color='skyblue', bins=bin_edges_coast, kde=False)
    plt.title('조사 데이터 - 해안길이(m) 분포')
    plt.xlabel('해안길이(m)')
    plt.ylabel('빈도')
    coastline_histogram_path = os.path.join(UPLOAD_FOLDER, 'coastline_histogram.png')
    plt.savefig(coastline_histogram_path)
    plt.close()

    # Create prediction volume histogram
    bin_edges_prediction = range(0, int(filtered_data['prediction'].max()) + 1000, 1000)
    plt.figure(figsize=(10, 6))
    sns.histplot(filtered_data['prediction'], color='skyblue', bins=bin_edges_prediction, kde=False)
    plt.title('조사 데이터 - 예측량(L) 분포')
    plt.xlabel('예측량(L)')
    plt.ylabel('빈도')
    prediction_histogram_path = os.path.join(UPLOAD_FOLDER, 'prediction_volume_histogram.png')
    plt.savefig(prediction_histogram_path)
    plt.close()

    # Generate map visualizations
    waste_prediction_map_html = create_filtered_plotly_map(investigate_data, start_date, end_date)
    waste_map_html = create_waste_type_map(investigate_data, start_date, end_date)

    # Upload files to Firebase Storage
    coastline_histogram_link = upload_to_firebase(coastline_histogram_path, 'coastline_histogram.png')
    prediction_histogram_link = upload_to_firebase(prediction_histogram_path, 'prediction_volume_histogram.png')
    waste_prediction_map_link = upload_to_firebase(waste_prediction_map_html, 'waste_prediction_map.html')
    waste_map_link = upload_to_firebase(waste_map_html, 'waste_map.html')

    # Return the Firebase Storage public URLs
    return jsonify({
        'coastline_histogram': coastline_histogram_link,
        'prediction_histogram': prediction_histogram_link,
        'waste_prediction_map': waste_prediction_map_link,
        'waste_map': waste_map_link
    }), 200

@app.route('/static/<filename>', methods=['GET'])
def serve_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename))

# Define the create_filtered_plotly_map function
def create_filtered_plotly_map(data, start_date, end_date):
    filtered_data = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
    center_lat = filtered_data['latitude'].mean()
    center_lon = filtered_data['longitude'].mean()

    fig = go.Figure()
    for year in filtered_data['년'].unique():
        yearly_data = filtered_data[filtered_data['년'] == year]
        fig.add_trace(go.Scattermapbox(
            lat=yearly_data['latitude'],
            lon=yearly_data['longitude'],
            mode='markers',
            marker=dict(
                size=yearly_data['prediction'] / yearly_data['prediction'].max() * 100,
                color=yearly_data['prediction'],
                colorscale=[[0, 'lightpink'], [1, 'purple']],
                cmin=yearly_data['prediction'].min(),
                cmax=yearly_data['prediction'].max(),
                sizemode='area',
                showscale=True,
                opacity=0.8
            ),
            hovertemplate="<b>%{hovertext}</b><br>수거 예측량: %{customdata} L<extra></extra>",
            hovertext=yearly_data['coast_name'],
            customdata=yearly_data['prediction'],
            name=f'Year {year}',
            visible=(year == filtered_data['년'].min())
        ))

    fig.update_layout(
        mapbox_style="open-street-map",
        mapbox=dict(center={"lat": center_lat, "lon": center_lon}, zoom=10),
        margin={"r": 0, "t": 50, "l": 0, "b": 0},
        title=f"Marine Waste Collection Prediction ({start_date} - {end_date})"
    )

    html_file_path = os.path.join(UPLOAD_FOLDER, 'waste_prediction_map.html')
    fig.write_html(html_file_path)
    return html_file_path

# Define the create_waste_type_map function
def create_waste_type_map(data, start_date, end_date):
    filtered_df = data[(data['일'] >= start_date) & (data['일'] <= end_date)]
    fig = go.Figure()

    for waste_type, group in filtered_df.groupby('waste_type'):
        fig.add_trace(go.Scattermapbox(
            lat=group['latitude'],
            lon=group['longitude'],
            mode='markers',
            marker=go.scattermapbox.Marker(size=6),
            hovertext=[f"해안명: {coast} / 주요 쓰레기 종류: {waste_type}" for coast in group['coast_name']],
            hoverinfo="text",
            name=waste_type
        ))

    fig.update_layout(
        mapbox_style="open-street-map",
        mapbox_zoom=10,
        mapbox_center={"lat": filtered_df['latitude'].mean(), "lon": filtered_df['longitude'].mean()},
        height=600,
        title=f"날짜별 주요 쓰레기 종류 분포 ({start_date} - {end_date})"
    )

    html_file_path = os.path.join(UPLOAD_FOLDER, 'waste_map.html')
    fig.write_html(html_file_path)
    return html_file_path

@app.route('/api/get-image-url', methods=['GET'])
def get_image_url():
    # 요청으로부터 파일 이름을 받습니다.
    file_name = request.args.get('file_name')
    
    if not file_name:
        return jsonify({'error': 'File name is required'}), 400

    # Firebase에서 파일을 참조하고 다운로드 URL 생성
    bucket = storage.bucket()
    blob = bucket.blob(file_name)
    
    # 파일이 존재하는지 확인
    if not blob.exists():
        return jsonify({'error': 'File does not exist'}), 404

    # 파일의 public URL 반환
    file_url = blob.public_url
    return jsonify({'file_url': file_url}), 200

# Haversine 거리 계산 함수
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # 지구 반지름 (km)
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    return R * c

# 다익스트라 알고리즘
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    previous_nodes = {node: None for node in graph}
    priority_queue = [(0, start)]

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous_nodes[neighbor] = current_node
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances, previous_nodes

@app.route('/analyze', methods=['POST'])
def analyze():
    if 'file' not in request.files:
        return jsonify({'error': 'No file found'}), 400
    
    # CSV 파일 처리
    file = request.files['file']
    try:
        data = pd.read_csv(file, encoding='utf-8')
    except Exception as e:
        return jsonify({'error': f'Failed to read CSV: {str(e)}'}), 400

    # 필수 데이터 검증
    required_columns = ['latitude', 'longitude', 'collected_amount']
    if not all(col in data.columns for col in required_columns):
        return jsonify({'error': 'Missing required columns in CSV'}), 400

    # 위도와 경도 데이터를 실수형으로 변환 및 유효성 검사
    data['latitude'] = pd.to_numeric(data['latitude'], errors='coerce')
    data['longitude'] = pd.to_numeric(data['longitude'], errors='coerce')
    data = data.dropna(subset=['latitude', 'longitude', 'collected_amount'])

    # 경도와 위도의 범위 검사
    valid_coords = (data['latitude'].between(-90, 90)) & (data['longitude'].between(-180, 180))
    data = data[valid_coords]

    if data.empty:
        return jsonify({'error': 'No valid data points found'}), 400

    # 좌표 추출
    coords = data[['latitude', 'longitude']].values
    num_locations = len(coords)

    # 장소 선택
    start_node = random.choice(range(num_locations))
    waypoint_count = min(5, num_locations - 2)
    waypoints = random.sample([i for i in range(num_locations) if i != start_node], waypoint_count)
    end_node = random.choice([i for i in range(num_locations) if i != start_node and i not in waypoints])

    # 인접 리스트 구성
    adj_list = {i: {} for i in range(num_locations)}
    threshold_distance = 100  # km

    for i in range(num_locations):
        for j in range(i + 1, num_locations):
            dist = haversine(coords[i][0], coords[i][1], coords[j][0], coords[j][1])
            if dist <= threshold_distance:
                adj_list[i][j] = dist
                adj_list[j][i] = dist

    # 최단 경로 계산
    nodes_to_visit = [start_node] + waypoints + [end_node]
    all_distances = {}

    for i in range(len(nodes_to_visit)):
        for j in range(i + 1, len(nodes_to_visit)):
            dist, _ = dijkstra(adj_list, nodes_to_visit[i])
            all_distances[(nodes_to_visit[i], nodes_to_visit[j])] = dist[nodes_to_visit[j]]
            all_distances[(nodes_to_visit[j], nodes_to_visit[i])] = dist[nodes_to_visit[j]]

    # 경유지 순서의 모든 가능한 경로 계산
    possible_paths = permutations(waypoints)
    min_path_distance = float('inf')
    best_path = None

    for path in possible_paths:
        total_distance = all_distances[(start_node, path[0])]
        for i in range(len(path) - 1):
            total_distance += all_distances[(path[i], path[i + 1])]
        total_distance += all_distances[(path[-1], end_node)]

        if total_distance < min_path_distance:
            min_path_distance = total_distance
            best_path = (start_node,) + path + (end_node,)

    # 최단 경로 상의 누적 수거량 계산
    total_collected_volume = data.iloc[list(best_path)]['collected_amount'].astype(int).sum()

    # 결과 반환
    result = {
        "shortest_path": list(map(int, best_path)),  # int64 -> int 변환
        "total_distance": float(min_path_distance),  # float로 변환
        "total_collected_volume": int(total_collected_volume)  # int64 -> int 변환
    }

    return jsonify(result)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
