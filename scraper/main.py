import requests
import json
import logging
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.dialects.mysql import FLOAT, BOOLEAN

# create a SQLAlchemy engine to connect to the database
engine = create_engine("postgresql://wbfwifnt:1r5RtOE5glmrWGm16dZKYGhY_Ta-vxgS@balarama.db.elephantsql.com/wbfwifnt")

# Sets up the logging, instead of using print()
logging.basicConfig(level=logging.DEBUG)

# create a Session class to interact with the database
Session = sessionmaker(bind=engine)

# create a base class for declarative models
Base = declarative_base()

# define a model to represent your table
class Food(Base):
    __tablename__ = "foods"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(FLOAT)
    image = Column(String)
    description = Column(String)
    visible = Column(BOOLEAN)

# create a session object to interact with the database
session = Session()

params = {
    'selfservice_token': 'nextsukkertoppen.nemtakeaway.dk',
    'cmd': 'get_categories_list',
    'get_products': 'true',
    # 'datetime': '2023-02-22 12:11',
}

logging.info("Scrapping data from Grab'n Go")

response = requests.get(
    'https://api.nemtakeaway.dk/api/v1/products.php', params=params, json=True)

categories = response.json()["categories"]

for category in categories:
    extracted_categorie = category["products"]
    for food in extracted_categorie:
        name = json.loads(food["name"])["da-dk"]

        item_name = food["item_name"]
        price = food["price"]
        image_url = food["api_array"]["image"]
        image = f"https://cdn.nemtakeaway.dk/site/upload/images/l/{image_url}"

        description = json.loads(food["description"])["da-dk"]

        logging.debug(f"Navn: {name}")
        logging.debug(f"Beskrivelse: {description}")
        logging.debug(f"Kategori: {item_name}")
        logging.debug(f"Pris: {price}")
        logging.debug(f"Billede: {image}")

        food_obj = Food(name=name, price=price, image=image, description=description, visible=True)
        session.add(food_obj)

logging.info("Successfully inserted the data into the PostgreSQL database")

# commit the changes to the database
session.commit()

# close the session
session.close()