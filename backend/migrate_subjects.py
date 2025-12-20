"""
Migration script to add status and progress columns to subjects table.
Run this script to update the existing database schema.
"""
import sys
sys.path.insert(0, '.')

from sqlalchemy import create_engine, text
from config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL)

# SQL commands to add columns if they don't exist
migration_commands = [
    """
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='subjects' AND column_name='status') THEN
            ALTER TABLE subjects ADD COLUMN status VARCHAR DEFAULT 'in_progress';
        END IF;
    END $$;
    """,
    """
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                       WHERE table_name='subjects' AND column_name='progress') THEN
            ALTER TABLE subjects ADD COLUMN progress INTEGER DEFAULT 0;
        END IF;
    END $$;
    """
]

def run_migration():
    with engine.connect() as conn:
        for cmd in migration_commands:
            try:
                conn.execute(text(cmd))
                conn.commit()
                print("Migration command executed successfully")
            except Exception as e:
                print(f"Migration error: {e}")
    
    print("Migration completed!")

if __name__ == "__main__":
    run_migration()
