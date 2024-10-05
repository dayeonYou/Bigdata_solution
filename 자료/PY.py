# csv 파일 데이터베이스에 입력
import pymysql
import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('C:\\Users\\Y\\Downloads\\clean.csv', encoding='euc-kr')

# MariaDB 연결
connection = pymysql.connect(host='localhost',
                             port=3308, 
                             user='root',
                             password='sqlMdbARIA1',
                             db='BUSAN')
cursor = connection.cursor()

# 각 행을 삽입하는 SQL 생성 및 실행
for index, row in df.iterrows():
    sql = """
    INSERT INTO cleaning (user_id, timestamp, coast_name, latitude, longitude, length, collected_amount, total_amount, waste_type)
    SELECT u.user_id, %s, %s, %s, %s, %s, %s, %s, %s
    FROM user u
    WHERE u.username = %s;
    """
    cursor.execute(sql, (row['청소시기'], row['해안명'], row['위도'], row['경도'], row['해안길이(m)'], row['수거 마대 개수(개)'], row['수거량 환산(L, 마대 개수 * 50L)'], row['주요쓰레기종류'], row['청소자 성명']))

# 커밋 후 연결 종료
connection.commit()
connection.close()
