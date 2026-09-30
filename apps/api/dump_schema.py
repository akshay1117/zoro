import sys
import asyncio
from sqlalchemy.schema import CreateTable
from sqlalchemy.ext.asyncio import create_async_engine
from app.models.base import Base
import app.models

def dump_schema():
    from sqlalchemy import create_mock_engine

    def dump(sql, *multiparams, **params):
        print(sql.compile(dialect=engine.dialect))

    engine = create_mock_engine('postgresql://', dump)
    Base.metadata.create_all(engine, checkfirst=False)

if __name__ == "__main__":
    dump_schema()
