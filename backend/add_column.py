import psycopg2

conn = psycopg2.connect('postgresql://postgres:admin123@localhost/edupilot_db')
cur = conn.cursor()
cur.execute("ALTER TABLE subjects ADD COLUMN subject_data JSON DEFAULT '{}'::json")
conn.commit()
cur.close()
conn.close()
print('Column subject_data added successfully!')
