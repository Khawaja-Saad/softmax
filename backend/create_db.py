"""
Create database tables for EduPilot application
This script will create all tables defined in the models
"""
from database import engine, Base
from app.models.user import User
from app.models.academic import Subject, Skill
from app.models.project import Project, Milestone
from app.models.cv import CV, Opportunity

def create_tables():
    """Create all database tables"""
    print("Creating database tables...")
    try:
        # This will create all tables defined in the models
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        
        # Show created tables
        from sqlalchemy import inspect
        inspector = inspect(engine)
        tables = inspector.get_table_names()
        
        print(f"\n📊 Created {len(tables)} tables:")
        for table in tables:
            print(f"  - {table}")
            
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        raise

if __name__ == "__main__":
    create_tables()
