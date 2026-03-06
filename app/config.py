from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "URL Shortener"
    base_url: str = "http://localhost:8000"
    database_url: str = "sqlite+aiosqlite:///./urlshortener.db"
    short_code_length: int = 7
    max_custom_alias_length: int = 30

    class Config:
        env_file = ".env"


settings = Settings()
