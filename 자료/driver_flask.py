from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import heapq
import random
from itertools import permutations

app = Flask(__name__)

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
    app.run(port=5000)
