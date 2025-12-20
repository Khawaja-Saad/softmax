from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.auth import get_password_hash, verify_password


class AuthService:
    
    @staticmethod
    def create_user(db: Session, user_data: UserCreate) -> User:
        """Create a new user."""
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            hashed_password=hashed_password,
            full_name=user_data.full_name,
            degree_program=user_data.degree_program,
            current_year=user_data.current_year,
            current_semester=user_data.current_semester,
            career_goal=user_data.career_goal
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> User:
        """Authenticate a user by email and password."""
        user = db.query(User).filter(User.email == email).first()
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not verify_password(password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is deactivated"
            )
        
        return user
    
    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> User:
        """Get user by ID."""
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    @staticmethod
    def update_user(db: Session, user_id: int, update_data: dict) -> User:
        """Update user information."""
        user = AuthService.get_user_by_id(db, user_id)
        
        for key, value in update_data.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def change_password(db: Session, user_id: int, current_password: str, new_password: str) -> User:
        """Change user password."""
        user = AuthService.get_user_by_id(db, user_id)
        
        # Verify current password
        if not verify_password(current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Current password is incorrect"
            )
        
        # Update password
        user.hashed_password = get_password_hash(new_password)
        db.commit()
        db.refresh(user)
        return user
    
    @staticmethod
    def generate_activity_report(db: Session, user_id: int) -> bytes:
        """Generate PDF activity report for user."""
        from reportlab.lib.pagesizes import letter
        from reportlab.lib import colors
        from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
        from reportlab.lib.enums import TA_CENTER, TA_LEFT
        from io import BytesIO
        from datetime import datetime
        
        # Get user data
        user = AuthService.get_user_by_id(db, user_id)
        
        # Get user's subjects
        from app.models.academic import Subject
        subjects = db.query(Subject).filter(Subject.user_id == user_id).all()
        
        # Get user's projects
        from app.models.project import Project
        projects = db.query(Project).filter(Project.user_id == user_id).all()
        
        # Create PDF buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=18)
        
        # Container for PDF elements
        elements = []
        
        # Styles
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#2563eb'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=16,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            spaceBefore=12
        )
        
        # Title
        elements.append(Paragraph("EduPilot Activity Report", title_style))
        elements.append(Spacer(1, 12))
        
        # User Info Section
        user_info_data = [
            ['User Information', ''],
            ['Name:', user.full_name or 'N/A'],
            ['Email:', user.email],
            ['Degree Program:', user.degree_program or 'N/A'],
            ['Current Year:', str(user.current_year) if user.current_year else 'N/A'],
            ['Career Goal:', user.career_goal or 'N/A'],
            ['Report Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
        ]
        
        user_table = Table(user_info_data, colWidths=[2*inch, 4*inch])
        user_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#2563eb')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ]))
        elements.append(user_table)
        elements.append(Spacer(1, 20))
        
        # Subjects Section
        elements.append(Paragraph("Enrolled Subjects", heading_style))
        if subjects:
            subject_data = [['Subject Name', 'Code', 'Credits', 'Status', 'Created']]
            for subject in subjects:
                subject_data.append([
                    subject.name,
                    subject.code or 'N/A',
                    str(subject.credits) if subject.credits else 'N/A',
                    'Active',
                    subject.created_at.strftime('%Y-%m-%d')
                ])
            
            subject_table = Table(subject_data, colWidths=[2*inch, 1*inch, 0.8*inch, 0.8*inch, 1.2*inch])
            subject_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#10b981')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            elements.append(subject_table)
            elements.append(Spacer(1, 12))
            elements.append(Paragraph(f"<b>Total Subjects: {len(subjects)}</b>", styles['Normal']))
        else:
            elements.append(Paragraph("No subjects enrolled yet.", styles['Normal']))
        
        elements.append(Spacer(1, 20))
        
        # Projects Section
        elements.append(Paragraph("Projects", heading_style))
        if projects:
            project_data = [['Project Title', 'Status', 'Progress', 'Created']]
            for project in projects:
                # Use Paragraph for title to enable text wrapping
                title_para = Paragraph(
                    project.title if len(project.title) <= 45 else project.title[:45] + '...',
                    styles['Normal']
                )
                # Extract clean status (handle enum values)
                status_value = str(project.status) if project.status else 'Not Started'
                # Remove enum prefix if present (e.g., "ProjectStatus.COMPLETED" -> "COMPLETED")
                if '.' in status_value:
                    status_value = status_value.split('.')[-1]
                # Capitalize first letter only for better display
                status_value = status_value.replace('_', ' ').title()
                
                # Set progress based on status
                progress = project.completion_percentage or 0
                status_upper = status_value.upper()
                if 'COMPLETED' in status_upper or 'COMPLETE' in status_upper:
                    progress = 100
                elif 'PROGRESS' in status_upper:
                    progress = 50
                
                project_data.append([
                    title_para,
                    status_value,
                    f"{progress}%",
                    project.created_at.strftime('%Y-%m-%d')
                ])
            
            project_table = Table(project_data, colWidths=[3*inch, 1.1*inch, 0.8*inch, 1.1*inch])
            project_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#8b5cf6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (0, -1), 'LEFT'),
                ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('TOPPADDING', (0, 1), (-1, -1), 6),
                ('BOTTOMPADDING', (0, 1), (-1, -1), 6),
                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
                ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ]))
            elements.append(project_table)
            elements.append(Spacer(1, 12))
            
            # Project status summary
            status_counts = {}
            for project in projects:
                status = project.status or 'Not Started'
                status_counts[status] = status_counts.get(status, 0) + 1
            
            status_text = " | ".join([f"{status}: {count}" for status, count in status_counts.items()])
            elements.append(Paragraph(f"<b>Total Projects: {len(projects)}</b> ({status_text})", styles['Normal']))
        else:
            elements.append(Paragraph("No projects created yet.", styles['Normal']))
        
        elements.append(Spacer(1, 30))
        
        # Summary Statistics
        elements.append(Paragraph("Activity Summary", heading_style))
        
        # Calculate days active (handle timezone-aware datetime)
        now = datetime.now(user.created_at.tzinfo) if user.created_at.tzinfo else datetime.now()
        days_active = (now - user.created_at).days
        
        summary_data = [
            ['Metric', 'Count'],
            ['Total Subjects', str(len(subjects))],
            ['Total Projects', str(len(projects))],
            ['Account Created', user.created_at.strftime('%B %d, %Y')],
            ['Days Active', str(days_active)],
        ]
        
        summary_table = Table(summary_data, colWidths=[3*inch, 2*inch])
        summary_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f59e0b')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.lightgoldenrodyellow),
            ('GRID', (0, 0), (-1, -1), 1, colors.black),
            ('FONTNAME', (0, 1), (0, -1), 'Helvetica-Bold'),
        ]))
        elements.append(summary_table)
        
        # Build PDF
        doc.build(elements)
        
        # Get PDF content
        pdf_content = buffer.getvalue()
        buffer.close()
        
        return pdf_content
