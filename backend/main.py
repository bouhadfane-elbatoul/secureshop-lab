import os
import shutil
import uuid
from pathlib import Path
from typing import Optional, List

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import text
from sqlalchemy import or_
from pydantic import BaseModel

from database import Base, engine, get_db
import models
import auth

Base.metadata.create_all(bind=engine)

app = FastAPI(title="SecureShop API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ---------- Schemas ----------

class RegisterIn(BaseModel):
    username: str
    email: str
    password: str
    full_name: Optional[str] = ""


class LoginIn(BaseModel):
    username: str
    password: str


class ReviewIn(BaseModel):
    product_id: int
    rating: int
    comment: str


class ContactIn(BaseModel):
    name: str
    email: str
    message: str


class CartItemIn(BaseModel):
    product_id: int
    quantity: int
    unit_price: float


class CheckoutIn(BaseModel):
    items: List[CartItemIn]
    total: float
    shipping_address: str


class ProfileUpdateIn(BaseModel):
    full_name: Optional[str] = None
    address: Optional[str] = None


# ---------- Auth routes ----------

@app.post("/api/auth/register")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(
        (models.User.username == payload.username) | (models.User.email == payload.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    user = models.User(
        username=payload.username,
        email=payload.email,
        password_hash=auth.hash_password(payload.password),
        full_name=payload.full_name,
        role="customer",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = auth.create_access_token({"user_id": user.id, "username": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}


@app.post("/api/auth/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == payload.username).first()
    if not user or not auth.verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    token = auth.create_access_token({"user_id": user.id, "username": user.username, "role": user.role})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id, "role": user.role}


# ---------- User / profile routes ----------

@app.get("/api/users/me")
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "full_name": current_user.full_name,
        "address": current_user.address,
        "role": current_user.role,
        "avatar_path": current_user.avatar_path,
    }


@app.put("/api/users/me")
def update_me(
    payload: ProfileUpdateIn,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.address is not None:
        current_user.address = payload.address
    db.commit()
    return {"status": "updated"}


@app.get("/api/users/{user_id}")
def get_user_public(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "username": user.username,
        "full_name": user.full_name,
    }

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
ALLOWED_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 2 * 1024 * 1024  # 2 Mo

@app.post("/api/users/me/avatar")
def upload_avatar(
    file: UploadFile = File(...),
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS or file.content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG or WEBP images are allowed")

    contents = file.file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 2MB)")

    safe_filename = f"{uuid.uuid4().hex}{ext}"
    dest_path = os.path.join("uploads", safe_filename)
    with open(dest_path, "wb") as buffer:
        buffer.write(contents)

    current_user.avatar_path = f"/uploads/{safe_filename}"
    db.commit()
    return {"avatar_path": current_user.avatar_path}

# ---------- Product routes ----------

@app.get("/api/products")
def list_products(category: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if category:
        query = query.filter(models.Product.category == category)
    return query.all()


@app.get("/api/products/search")
def search_products(q: str = "", db: Session = Depends(get_db)):
    products = db.query(models.Product).filter(
        or_(
            models.Product.name.ilike(f"%{q}%"),
            models.Product.description.ilike(f"%{q}%"),
        )
    ).all()
    return products


@app.get("/api/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# ---------- Review routes ----------

@app.get("/api/products/{product_id}/reviews")
def get_reviews(product_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.product_id == product_id).all()
    result = []
    for r in reviews:
        user = db.query(models.User).filter(models.User.id == r.user_id).first()
        result.append({
            "id": r.id,
            "rating": r.rating,
            "comment": r.comment,
            "username": user.username if user else "unknown",
            "created_at": r.created_at,
        })
    return result


@app.post("/api/reviews")
def create_review(
    payload: ReviewIn,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    review = models.Review(
        product_id=payload.product_id,
        user_id=current_user.id,
        rating=payload.rating,
        comment=payload.comment,
    )
    db.add(review)
    db.commit()
    return {"status": "created"}


# ---------- Cart / checkout / orders ----------
@app.post("/api/checkout")
def checkout(
    payload: CheckoutIn,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    computed_total = 0.0
    validated_items = []

    for item in payload.items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not found")
        if item.quantity < 1:
            raise HTTPException(status_code=400, detail="Quantity must be at least 1")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {product.name}")

        real_price = product.price
        computed_total += real_price * item.quantity
        validated_items.append((product.id, item.quantity, real_price))

    order = models.Order(
        user_id=current_user.id,
        total=round(computed_total, 2),
        shipping_address=payload.shipping_address,
        status="completed",
    )
    db.add(order)
    db.commit()
    db.refresh(order)

    for product_id, quantity, unit_price in validated_items:
        db.add(models.OrderItem(
            order_id=order.id,
            product_id=product_id,
            quantity=quantity,
            unit_price=unit_price,
        ))
    db.commit()
    return {"order_id": order.id, "total": order.total}


@app.get("/api/orders")
def list_my_orders(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    orders = db.query(models.Order).filter(models.Order.user_id == current_user.id).all()
    return orders


@app.get("/api/orders/{order_id}")
def get_order(
    order_id: int,
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order.user_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    items = db.query(models.OrderItem).filter(models.OrderItem.order_id == order.id).all()
    return {
        "id": order.id,
        "user_id": order.user_id,
        "total": order.total,
        "status": order.status,
        "shipping_address": order.shipping_address,
        "created_at": order.created_at,
        "items": [{"product_id": i.product_id, "quantity": i.quantity, "unit_price": i.unit_price} for i in items],
    }


# ---------- Contact ----------

@app.post("/api/contact")
def contact(payload: ContactIn, db: Session = Depends(get_db)):
    msg = models.ContactMessage(name=payload.name, email=payload.email, message=payload.message)
    db.add(msg)
    db.commit()
    return {"status": "sent"}


# ---------- Admin ----------

@app.get("/api/admin/users")
def admin_list_users(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    users = db.query(models.User).all()
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "full_name": u.full_name,
        }
        for u in users
    ]

@app.get("/api/admin/stats")
def admin_stats(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")

    return {
        "total_users": db.query(models.User).count(),
        "total_orders": db.query(models.Order).count(),
        "total_products": db.query(models.Product).count(),
        "total_revenue": sum(o.total for o in db.query(models.Order).all()),
    }


@app.get("/api/admin/contact-messages")
def admin_contact_messages(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return db.query(models.ContactMessage).all()


@app.get("/api/health")
def health():
    return {"status": "ok", "service": "SecureShop API"}
