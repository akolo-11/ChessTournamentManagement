from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    cors_origins: str = "http://localhost:5173"
    secret_key: str = "dev-secret-change-me"
    access_token_ttl_minutes: int = 30
    refresh_token_ttl_days: int = 14

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()