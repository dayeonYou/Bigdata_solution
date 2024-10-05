# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
import heapq
import random
from itertools import permutations

# Haversine 공식을 이용해 두 지점 간의 거리를 계산하는 함수 (위도, 경도 입력)
def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # 지구 반지름 (km)
    lat1, lon1, lat2, lon2 = map(np.radians, [lat1, lon1, lat2, lon2])
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = np.sin(dlat / 2)**2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlon / 2)**2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    distance = R * c
    return distance

# CSV 파일 읽기
file_path = 'C:\\Users\\Y\\Desktop\\busan_flask\\clean.csv'
data = pd.read_csv(file_path, encoding='euc-kr')  # 또는 'cp949'

# 위도와 경도 데이터를 실수형으로 변환
data['위도'] = pd.to_numeric(data['위도'], errors='coerce')
data['경도'] = pd.to_numeric(data['경도'], errors='coerce')

# 위도, 경도 열 추출
coords = data[['위도', '경도']].dropna().values

# 장소의 개수를 자동으로 데이터에 맞춰 설정
num_locations = len(coords)

# 장소 중 num_locations개의 장소를 선택
selected_coords = coords  # 모든 좌표 선택

# 선택된 장소들을 인덱스와 함께 출력
print("Available locations (index, latitude, longitude):")
for idx, coord in enumerate(selected_coords):
    print(f"{idx}: {coord}")

# 사용자 입력을 통해 시작점, 경유지 및 목적지 선택
start_node = int(input(f"Choose a start node (0-{num_locations-1}): "))
waypoint_count = int(input(f"How many waypoints would you like to choose (1-{num_locations-2}): "))

waypoints = []
for i in range(waypoint_count):
    waypoint = int(input(f"Choose waypoint {i + 1} (not {start_node}): "))
    waypoints.append(waypoint)

end_node = int(input(f"Choose an end node (not {start_node} or any of the waypoints): "))

# 인접 리스트를 저장할 딕셔너리 초기화 (선택된 장소들만)
adj_list = {i: {} for i in range(len(selected_coords))}

# 특정 거리 기준 (threshold_distance) 설정
threshold_distance = 100  # km로 설정하여 더 많은 노드 연결

# 인접 리스트 구성
for i in range(len(selected_coords)):
    for j in range(i + 1, len(selected_coords)):
        dist = haversine(selected_coords[i][0], selected_coords[i][1], selected_coords[j][0], selected_coords[j][1])
        if dist <= threshold_distance:
            adj_list[i][j] = dist
            adj_list[j][i] = dist

# 다익스트라 알고리즘
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    previous_nodes = {node: None for node in graph}  # 경로 추적을 위한 딕셔너리
    priority_queue = [(0, start)]

    while priority_queue:
        current_distance, current_node = heapq.heappop(priority_queue)

        if current_distance > distances[current_node]:
            continue

        for neighbor, weight in graph[current_node].items():
            distance = current_distance + weight

            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous_nodes[neighbor] = current_node  # 경로 추적 기록
                heapq.heappush(priority_queue, (distance, neighbor))

    return distances, previous_nodes

# 모든 지점 간 최단 거리 계산
nodes_to_visit = [start_node] + waypoints + [end_node]
all_distances = {}

# 모든 노드들 간의 최단 거리를 계산해 저장
for i in range(len(nodes_to_visit)):
    for j in range(i + 1, len(nodes_to_visit)):
        dist, _ = dijkstra(adj_list, nodes_to_visit[i])
        all_distances[(nodes_to_visit[i], nodes_to_visit[j])] = dist[nodes_to_visit[j]]
        all_distances[(nodes_to_visit[j], nodes_to_visit[i])] = dist[nodes_to_visit[j]]  # 양방향

# 경유지 방문 순서의 모든 가능한 조합을 계산
possible_paths = permutations(waypoints)

# 최단 경로를 찾기 위한 변수 초기화
min_path_distance = float('inf')
best_path = None

# 모든 경로에 대해 거리를 계산하여 최단 경로를 찾음
for path in possible_paths:
    total_distance = 0

    # 시작점 -> 첫 번째 경유지
    total_distance += all_distances[(start_node, path[0])]

    # 경유지들 간의 거리
    for i in range(len(path) - 1):
        total_distance += all_distances[(path[i], path[i + 1])]

    # 마지막 경유지 -> 목적지
    total_distance += all_distances[(path[-1], end_node)]

    # 최단 경로 업데이트
    if total_distance < min_path_distance:
        min_path_distance = total_distance
        best_path = (start_node,) + path + (end_node,)

# 최종 결과 출력
print(f"Shortest path: {best_path}")
print(f"Shortest path distance: {min_path_distance} km")

# 최단 경로 상의 누적 수거량 계산
total_collected_volume = 0

# 최단 경로를 따라 각 위치에서의 수거량을 합산
for location in best_path:
    collected_volume = data.loc[location, '수거량 환산(L, 마대 개수 * 50L)']
    total_collected_volume += collected_volume

# 최종 결과 출력
print(f"Shortest path: {best_path}")
print(f"Shortest path distance: {min_path_distance} km")
print(f"Total collected volume along the shortest path: {total_collected_volume} L")