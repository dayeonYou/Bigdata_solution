# csv 파일 데이터베이스에 입력

import pymysql
import pandas as pd

# CSV 파일 읽기
df = pd.read_csv('C:\\Users\\Y\\Desktop\\busan_flask\\자료\\random_investigate.csv', encoding='utf-8')

# MariaDB 연결
connection = pymysql.connect(host='localhost',
                             port=3308, 
                             user='root',
                             password='sqlMdbARIA1',
                             db='BUSAN')
cursor = connection.cursor()

# 각 행을 삽입하는 SQL 생성 및 실행
# 각 행을 삽입하는 SQL 생성 및 실행
for index, row in df.iterrows():
    sql = """
    INSERT INTO investigation (user_id, timestamp, coast_name, latitude, longitude, length, prediction, waste_type)
    SELECT u.user_id, %s, %s, %s, %s, %s, %s, %s
    FROM user u
    WHERE TRIM(LOWER(u.username)) = TRIM(LOWER(%s));
    """
    cursor.execute(sql, (row['조사시기'], row['해안명'], row['위도'], row['경도'], row['해안길이(m)'], row['예측량(L)'], row['주요쓰레기종류'], row['조사자 성명']))

# 커밋 후 연결 종료
connection.commit()
connection.close()

##UPDATE investigation i
##JOIN user u ON i.user_id = u.user_id
##SET i.username = u.username;
