from pymongo import MongoClient
conn = MongoClient("mongodb://localhost:27017")
from motor.motor_asyncio import AsyncIOMotorClient
import logging
filter = AsyncIOMotorClient("mongodb://localhost:27017")

class MongoDBConnector:
    def __init__(self, url, **kwargs):
        if "loop" in kwargs:
            kwargs['io_loop'] = kwargs.pop("loop")
        self.db = AsyncIOMotorClient(url, **kwargs)
        logging.info("Asyc client connection")

    def return_db(self):
        return self.db

    async def create(self, db_name, collection_name, document, multiple=False):

        collection = self.db[db_name].get_collection(collection_name)
        if multiple:
            docs = await collection.insert_many(document)
            return str(docs.inserted_id)
        doc = await collection.insert_one(document)
        return str(doc.inserted_id)

    async def find(self, db_name, collection_name, query):
        collection = self.db[db_name].get_collection(collection_name)
        cor = collection.find(query)
        docs = list()
        async for doc in cor:
            if doc:
                docs.append(doc)
        if len(docs) == 1:
            return docs[0]
        return docs

    async def insert(self, db_name, collection_name, data):
        collection = self.db[db_name].get_collection(collection_name)
        collection.insert_many(data)

