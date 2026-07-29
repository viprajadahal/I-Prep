from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv 

load_dotenv()

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REDIS_URL: str

    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def model_post_init(self, __context):
        if self.DATABASE_URL.startswith("postgresql://"):
            self.DATABASE_URL = self.DATABASE_URL.replace(
                "postgresql://", "postgresql+asyncpg://", 1
            )
        elif self.DATABASE_URL.startswith("postgresql+psycopg2://"):
            self.DATABASE_URL = self.DATABASE_URL.replace(
                "postgresql+psycopg2://", "postgresql+asyncpg://", 1
            )

settings = Settings()
