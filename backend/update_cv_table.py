"""
Script to update the CVs table with new columns for comprehensive CV data
"""
import psycopg2
from psycopg2 import sql

# Database connection details
DB_CONFIG = {
    'dbname': 'edupilot_db',
    'user': 'postgres',
    'password': 'admin123',
    'host': 'localhost',
    'port': '5432'
}

def update_cv_table():
    """Add new columns to the cvs table"""
    try:
        # Connect to database
        conn = psycopg2.connect(**DB_CONFIG)
        cur = conn.cursor()
        
        print("Connected to database successfully!")
        
        # Add new columns (using IF NOT EXISTS to avoid errors if already added)
        columns_to_add = [
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS full_name VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS phone VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS email VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS github_url VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS location VARCHAR",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS experience JSON DEFAULT '[]'::json",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS technical_skills TEXT",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS soft_skills TEXT",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS languages TEXT",
            "ALTER TABLE cvs ADD COLUMN IF NOT EXISTS certifications JSON DEFAULT '[]'::json",
        ]
        
        for sql_statement in columns_to_add:
            print(f"Executing: {sql_statement}")
            cur.execute(sql_statement)
        
        # Commit changes
        conn.commit()
        print("\n✅ All columns added successfully!")
        
        # Close connection
        cur.close()
        conn.close()
        print("Database connection closed.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        if conn:
            conn.rollback()

if __name__ == "__main__":
    print("Starting CV table update...")
    update_cv_table()
    print("Update complete!")
