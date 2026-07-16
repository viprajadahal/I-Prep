# Reading models are defined in app.models.user to avoid duplicate table
# definitions. This file is kept for backward compatibility.
from app.models.user import ReadingPassage, ReadingQuestion, ReadingAttempt  # noqa: F401
