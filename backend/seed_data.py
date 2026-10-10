from database import Base, engine, SessionLocal
import models
import auth

Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

users = [
    models.User(
        username="alice",
        email="alice@example.com",
        password_hash=auth.hash_password("alice123"),
        full_name="Alice Martin",
        address="12 Rue des Fleurs, Béjaïa",
        role="customer",
    ),
    models.User(
        username="bob",
        email="bob@example.com",
        password_hash=auth.hash_password("bobpassword"),
        full_name="Bob Nassim",
        address="45 Avenue de l'Independence, Annaba",
        role="customer",
    ),
    models.User(
        username="admin",
        email="admin@secureshop.local",
        password_hash=auth.hash_password("admin2024"),
        full_name="Store Administrator",
        address="SecureShop HQ",
        role="admin",
    ),
]
db.add_all(users)
db.commit()

products = [
    models.Product(name="Wireless Mechanical Keyboard", description="RGB backlit mechanical keyboard with hot-swappable switches.", price=89.99, category="electronics", stock=42, image_url="/static/keyboard.jpg"),
    models.Product(name="Noise Cancelling Headphones", description="Over-ear headphones with active noise cancellation and 30h battery.", price=149.99, category="electronics", stock=15, image_url="/static/headphones.jpg"),
    models.Product(name="Stainless Steel Water Bottle", description="Insulated 750ml bottle, keeps drinks cold for 24 hours.", price=19.99, category="home", stock=120, image_url="/static/bottle.jpg"),
    models.Product(name="Ergonomic Office Chair", description="Adjustable lumbar support and breathable mesh back.", price=219.00, category="furniture", stock=8, image_url="/static/chair.jpg"),
    models.Product(name="Portable SSD 1TB", description="USB-C portable solid state drive, read speeds up to 1050MB/s.", price=109.50, category="electronics", stock=30, image_url="/static/ssd.jpg"),
    models.Product(name="Ceramic Coffee Mug Set", description="Set of 4 minimalist ceramic mugs, dishwasher safe.", price=24.99, category="home", stock=60, image_url="/static/mugs.jpg"),
    models.Product(name="Running Shoes", description="Lightweight breathable running shoes with cushioned sole.", price=74.99, category="sportswear", stock=25, image_url="/static/shoes.jpg"),
    models.Product(name="Smart LED Desk Lamp", description="Touch-controlled dimmable desk lamp with USB charging port.", price=34.99, category="home", stock=50, image_url="/static/lamp.jpg"),
]
db.add_all(products)
db.commit()

order1 = models.Order(user_id=1, total=109.98, shipping_address=users[0].address, status="completed")
db.add(order1)
db.commit()
db.add_all([
    models.OrderItem(order_id=order1.id, product_id=1, quantity=1, unit_price=89.99),
    models.OrderItem(order_id=order1.id, product_id=6, quantity=1, unit_price=19.99),
])

order2 = models.Order(user_id=2, total=149.99, shipping_address=users[1].address, status="completed")
db.add(order2)
db.commit()
db.add_all([
    models.OrderItem(order_id=order2.id, product_id=2, quantity=1, unit_price=149.99),
])
db.commit()

reviews = [
    models.Review(product_id=1, user_id=1, rating=5, comment="Fantastic keyboard, very responsive switches!"),
    models.Review(product_id=1, user_id=2, rating=4, comment="Great value, a bit loud for open offices."),
    models.Review(product_id=2, user_id=2, rating=5, comment="Best noise cancelling I've tried under $200."),
    models.Review(product_id=3, user_id=1, rating=4, comment="Does the job, keeps my coffee hot all morning."),
]
db.add_all(reviews)
db.commit()

print("Seed data created:")
print("  alice / alice123  (customer)")
print("  bob   / bobpassword (customer)")
print("  admin / admin2024 (admin)")
print(f"  {len(products)} products, {len(reviews)} reviews, 2 orders")

db.close()
