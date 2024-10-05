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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
