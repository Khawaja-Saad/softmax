"""Add username field to users table"""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from config import settings

# Create engine
engine = create_engine(settings.DATABASE_URL)

def add_username_column():
    """Add username column to users table"""
    with engine.connect() as conn:
        try:
            # Add username column (nullable initially)
            conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR"))
            conn.commit()
            print("✅ username column added successfully!")
            
            # Update existing users with username from email (before @ symbol)
            conn.execute(text("""
                UPDATE users 
                SET username = SPLIT_PART(email, '@', 1) 
                WHERE username IS NULL
            """))
            conn.commit()
            print("✅ Existing users updated with username from email!")
            
        except Exception as e:
            print(f"❌ Error: {e}")
            conn.rollback()

if __name__ == "__main__":
    print("🔄 Adding username column to users table...")
    add_username_column()
