"""
backend/app/database.py
=======================
SQLAlchemy database configuration for Azure SQL Database.

Reads the connection string from the ``AZURE_SQL_CONNECTION_STRING``
environment variable and accepts either:
- A standard Azure Portal ODBC connection string, e.g.:
  ``Driver={ODBC Driver 18 for SQL Server};Server=tcp:myserver.database.windows.net,1433;Database=vastra;Uid=adminuser;Pwd=secret;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;``
- A SQLAlchemy database URL, e.g.:
  ``mssql+pyodbc://user:pass@myserver.database.windows.net:1433/vastra?driver=ODBC+Driver+18+for+SQL+Server``

If ``AZURE_SQL_CONNECTION_STRING`` is missing, a placeholder, or ``pyodbc``
is not yet installed, ``engine`` and ``SessionLocal`` fall back to ``None``
so the FastAPI application can still boot cleanly until the real database
is connected.
"""

import os
from typing import Generator
from urllib.parse import quote_plus

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, declarative_base, sessionmaker

load_dotenv()

AZURE_SQL_CONNECTION_STRING = os.getenv("AZURE_SQL_CONNECTION_STRING", "").strip()

_PLACEHOLDER_MARKERS = (
    "placeholder",
    "your-sql",
    "your_sql",
    "your-azure-sql",
    "your_azure_sql",
    "your-server.database.windows.net",
    "<server>",
    "<database>",
    "<username>",
    "<password>",
)


def _is_placeholder_connection_string(conn_str: str) -> bool:
    """Return True if the connection string is empty or an obvious template."""
    lowered = conn_str.strip().lower()
    if not lowered:
        return True
    return any(marker in lowered for marker in _PLACEHOLDER_MARKERS)


def _build_sqlalchemy_url(conn_str: str) -> str | None:
    """Convert an Azure SQL ODBC string or SQLAlchemy URL into a valid URL."""
    if _is_placeholder_connection_string(conn_str):
        return None

    # Already a SQLAlchemy URL (e.g., mssql+pyodbc://... or sqlite:///...)
    if "://" in conn_str:
        return conn_str

    # Raw ODBC key-value connection string from the Azure Portal
    if "=" in conn_str:
        return f"mssql+pyodbc:///?odbc_connect={quote_plus(conn_str)}"

    return None


def _create_azure_sql_engine() -> Engine | None:
    """Create the SQLAlchemy engine if a usable connection string is present."""
    sqlalchemy_url = _build_sqlalchemy_url(AZURE_SQL_CONNECTION_STRING)
    if not sqlalchemy_url:
        return None

    engine_kwargs: dict = {
        "pool_pre_ping": True,
        "pool_recycle": 1800,
    }

    if sqlalchemy_url.startswith("mssql+pyodbc"):
        engine_kwargs["fast_executemany"] = True

    try:
        return create_engine(sqlalchemy_url, **engine_kwargs)
    except ModuleNotFoundError as exc:
        print(
            f"⚠️ SQLAlchemy database driver missing ({exc}). "
            "Install 'pyodbc' to connect to Azure SQL."
        )
        return None
    except Exception as exc:
        print(f"⚠️ Failed to initialize SQLAlchemy engine: {exc}")
        return None


engine: Engine | None = _create_azure_sql_engine()

SessionLocal = (
    sessionmaker(autocommit=False, autoflush=False, bind=engine)
    if engine is not None
    else None
)

Base = declarative_base()


def get_db() -> Generator[Session, None, None]:
    """FastAPI dependency that yields a scoped SQLAlchemy session."""
    if SessionLocal is None:
        raise RuntimeError(
            "Azure SQL database is not configured. "
            "Set AZURE_SQL_CONNECTION_STRING and ensure pyodbc is installed."
        )

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

