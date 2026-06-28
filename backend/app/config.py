from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REDIS_URL: str
#this was previous code
    #class Config:
     #   env_file = ".env"

#settings = Settings() 
#from here, for my newV2 way ti link my .env file
model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8",
        extra="ignore" # This prevents errors if you have extra things in your .env
    )

settings = Settings()