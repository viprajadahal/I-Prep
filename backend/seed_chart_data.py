"""Add visual chart data to Writing Task 1 questions."""
import asyncio
import json
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.models.mock_test import MockQuestion, MockSection
from app.config import settings

CHART_DATA = {
    71: {
        "type": "bar_chart",
        "title": "Home Ownership Rates by Country (1970, 1990, 2010)",
        "y_axis": "Percentage (%)",
        "categories": ["USA", "UK", "Australia", "Japan", "Germany"],
        "series": [
            {"name": "1970", "values": [65, 55, 70, 60, 45]},
            {"name": "1990", "values": [68, 64, 73, 62, 50]},
            {"name": "2010", "values": [67, 69, 70, 61, 53]}
        ],
        "colors": ["#6366f1", "#22c55e", "#f59e0b"]
    },
    146: {
        "type": "table",
        "title": "International Tourist Arrivals (millions)",
        "headers": ["Country", "2005", "2010", "2015"],
        "rows": [
            ["France", "76.0", "78.6", "84.5"],
            ["USA", "49.4", "60.0", "77.5"],
            ["Spain", "53.5", "52.7", "68.5"],
            ["China", "46.8", "55.7", "133.8"],
            ["Turkey", "20.3", "27.0", "36.2"]
        ]
    },
    221: {
        "type": "flow_diagram",
        "title": "Municipal Water Treatment Process",
        "stages": [
            {"label": "Raw Water Collection", "detail": "River/reservoir intake"},
            {"label": "Coagulation & Flocculation", "detail": "Chemical treatment to bind particles"},
            {"label": "Sedimentation", "detail": "Heavy particles settle to bottom"},
            {"label": "Filtration", "detail": "Water passes through sand/carbon filters"},
            {"label": "Disinfection", "detail": "Chlorine/UV kills bacteria"},
            {"label": "Storage", "detail": "Clean water held in reservoirs"},
            {"label": "Distribution", "detail": "Pumped to homes & businesses"}
        ]
    }
}

async def seed():
    engine = create_async_engine(settings.DATABASE_URL)
    Session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        for qid, chart in CHART_DATA.items():
            result = await db.execute(
                select(MockQuestion).where(MockQuestion.id == qid)
            )
            q = result.scalar_one_or_none()
            if q:
                q.options = chart
                db.add(q)
                print(f"Updated question {qid} with {chart['type']}")
            else:
                print(f"Question {qid} not found!")

        await db.commit()
        print("Done!")

asyncio.run(seed())
