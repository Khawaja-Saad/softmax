import psycopg2
from psycopg2 import sql

passwords = ['admin123', 'postgres', 'admin', 'password', '1234', 'root']
found = False

print("Testing PostgreSQL connection...")
for pwd in passwords:
    try:
        conn = psycopg2.connect(
            host='localhost',
            port=5432,
            user='postgres',
            password=pwd,
            database='postgres'  # Try default database first
        )
        print(f'✅ Connected successfully with password: {pwd}')
        
        # Now check if edupilot_db exists
        cur = conn.cursor()
        cur.execute("SELECT 1 FROM pg_database WHERE datname='edupilot_db'")
        exists = cur.fetchone()
        
        if exists:
            print('✅ Database "edupilot_db" exists!')
        else:
            print('⚠️  Database "edupilot_db" does NOT exist. Creating it...')
            conn.autocommit = True
            cur.execute('CREATE DATABASE edupilot_db')
            print('✅ Database "edupilot_db" created successfully!')
        
        cur.close()
        conn.close()
        found = True
        print(f'\n📝 Update your .env file with:')
        print(f'DATABASE_URL=postgresql://postgres:{pwd}@localhost:5432/edupilot_db')
        break
    except psycopg2.OperationalError as e:
        continue
    except Exception as e:
        print(f'❌ Error with password {pwd}: {e}')
        continue

if not found:
    print('\n❌ Could not connect with any common password.')
    print('Please check:')
    print('1. PostgreSQL service is running')
    print('2. Your PostgreSQL password')
    print('3. PostgreSQL is installed and listening on port 5432')
