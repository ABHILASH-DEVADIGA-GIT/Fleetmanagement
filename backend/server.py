from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import resend
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Resend setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

# JWT setup
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

security = HTTPBearer()

app = FastAPI()
api_router = APIRouter(prefix="/api")

logger = logging.getLogger(__name__)

# ============= Models =============

class UserRole:
    SUPER_ADMIN = 'super_admin'
    ADMIN = 'admin'

class ThemeType:
    LIGHT = 'light'
    DARK = 'dark'

class Language:
    ENGLISH = 'en'
    KANNADA = 'kn'
    HINDI = 'hi'

# User Models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    client_id: Optional[str] = None
    full_name: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    user_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    role: str
    client_id: Optional[str] = None
    full_name: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    token: str
    user: Dict[str, Any]

# Client Models
class ClientCreate(BaseModel):
    business_name: str
    email: EmailStr
    phone: str
    domain: Optional[str] = None
    subscription_plan: str = 'basic'
    enabled_languages: List[str] = ['en']
    theme: str = ThemeType.LIGHT

class Client(BaseModel):
    model_config = ConfigDict(extra="ignore")
    client_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    business_name: str
    email: EmailStr
    phone: str
    domain: Optional[str] = None
    subscription_plan: str
    enabled_languages: List[str]
    theme: str
    status: str = 'active'
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Content Models
class MultiLangContent(BaseModel):
    en: Optional[str] = None
    kn: Optional[str] = None
    hi: Optional[str] = None

class BannerSection(BaseModel):
    image_url: Optional[str] = None
    headline: MultiLangContent = Field(default_factory=MultiLangContent)
    sub_headline: MultiLangContent = Field(default_factory=MultiLangContent)
    cta_text: MultiLangContent = Field(default_factory=MultiLangContent)
    cta_link: Optional[str] = None

class FeaturedSection(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    description: MultiLangContent = Field(default_factory=MultiLangContent)
    images: List[str] = []

class AboutSection(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    description: MultiLangContent = Field(default_factory=MultiLangContent)
    image_url: Optional[str] = None

class PageContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    content_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    banner: BannerSection = Field(default_factory=BannerSection)
    featured: FeaturedSection = Field(default_factory=FeaturedSection)
    about: AboutSection = Field(default_factory=AboutSection)
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Service Models
class ServiceCreate(BaseModel):
    name: MultiLangContent
    description: MultiLangContent
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_active: bool = True

class Service(BaseModel):
    model_config = ConfigDict(extra="ignore")
    service_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: MultiLangContent
    description: MultiLangContent
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_active: bool = True
    display_order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Offer Models
class OfferCreate(BaseModel):
    title: MultiLangContent
    description: MultiLangContent
    discount_percentage: Optional[float] = None
    flat_discount: Optional[float] = None
    start_date: str
    end_date: str
    banner_image: Optional[str] = None
    status: str = 'active'

class Offer(BaseModel):
    model_config = ConfigDict(extra="ignore")
    offer_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    title: MultiLangContent
    description: MultiLangContent
    discount_percentage: Optional[float] = None
    flat_discount: Optional[float] = None
    start_date: str
    end_date: str
    banner_image: Optional[str] = None
    status: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Booking Models
class BookingCreate(BaseModel):
    client_id: str
    name: str
    phone: str
    email: Optional[EmailStr] = None
    event_type: str
    event_date: str
    event_time: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    booking_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: str
    phone: str
    email: Optional[EmailStr] = None
    event_type: str
    event_date: str
    event_time: Optional[str] = None
    location: Optional[str] = None
    message: Optional[str] = None
    status: str = 'pending'
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Blocked Date Models
class BlockedDateCreate(BaseModel):
    date: str

class BlockedDate(BaseModel):
    model_config = ConfigDict(extra="ignore")
    blocked_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    date: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Notification Models
class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    notification_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    client_id: Optional[str] = None
    title: str
    message: str
    type: str = 'info'
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class NotificationUpdate(BaseModel):
    is_read: bool

# ============= Helper Functions =============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_token(user_data: dict) -> str:
    payload = {
        'user_id': user_data['user_id'],
        'email': user_data['email'],
        'role': user_data['role'],
        'client_id': user_data.get('client_id'),
        'exp': datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

async def verify_super_admin(payload: dict = Depends(verify_token)) -> dict:
    if payload['role'] != UserRole.SUPER_ADMIN:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Super admin access required")
    return payload

async def verify_admin(payload: dict = Depends(verify_token)) -> dict:
    if payload['role'] not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return payload

async def send_email_notification(recipient: str, subject: str, html_content: str):
    if not resend.api_key:
        logger.warning("Resend API key not configured")
        return
    
    params = {
        "from": SENDER_EMAIL,
        "to": [recipient],
        "subject": subject,
        "html": html_content
    }
    
    try:
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email sent to {recipient}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

async def create_notification(user_id: str, client_id: Optional[str], title: str, message: str, notif_type: str = 'info'):
    notif = Notification(
        user_id=user_id,
        client_id=client_id,
        title=title,
        message=message,
        type=notif_type
    )
    await db.notifications.insert_one(notif.model_dump())

# ============= Auth Routes =============

@api_router.post("/auth/register", response_model=User)
async def register_user(user_data: UserCreate):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        role=user_data.role,
        client_id=user_data.client_id,
        full_name=user_data.full_name
    )
    
    user_dict = user.model_dump()
    user_dict['password'] = hashed_pw
    await db.users.insert_one(user_dict)
    
    return user

@api_router.post("/auth/login", response_model=TokenResponse)
async def login_user(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user or not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_token(user)
    user.pop('password', None)
    
    return TokenResponse(token=token, user=user)

@api_router.get("/auth/me")
async def get_current_user(payload: dict = Depends(verify_token)):
    user = await db.users.find_one({"user_id": payload['user_id']}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ============= Super Admin Routes =============

@api_router.post("/super-admin/clients", response_model=Client)
async def create_client(client_data: ClientCreate, _: dict = Depends(verify_super_admin)):
    client = Client(**client_data.model_dump())
    await db.clients.insert_one(client.model_dump())
    
    default_content = PageContent(
        client_id=client.client_id,
        banner=BannerSection(
            headline=MultiLangContent(en="Capture Your Moments", kn="ನಿಮ್ಮ ಕ್ಷಣಗಳನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ", hi="अपने पलों को कैद करें"),
            sub_headline=MultiLangContent(en="Professional Photography Services", kn="ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಹಣ ಸೇವೆಗಳು", hi="पेशेवर फोटोग्राफी सेवाएं"),
            cta_text=MultiLangContent(en="Book Now", kn="ಈಗ ಬುಕ್ ಮಾಡಿ", hi="अभी बुक करें")
        ),
        featured=FeaturedSection(
            title=MultiLangContent(en="Our Work", kn="ನಮ್ಮ ಕೆಲಸ", hi="हमारा काम"),
            description=MultiLangContent(en="Explore our portfolio", kn="ನಮ್ಮ ಪೋರ್ಟ್ಫೋಲಿಯೊವನ್ನು ಅನ್ವೇಷಿಸಿ", hi="हमारे पोर्टफोलियो का अन्वेषण करें")
        ),
        about=AboutSection(
            title=MultiLangContent(en="About Us", kn="ನಮ್ಮ ಬಗ್ಗೆ", hi="हमारे बारे में"),
            description=MultiLangContent(en="We are professional photographers", kn="ನಾವು ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಾಹಕರು", hi="हम पेशेवर फोटोग्राफर हैं")
        )
    )
    await db.page_content.insert_one(default_content.model_dump())
    
    return client

@api_router.get("/super-admin/clients", response_model=List[Client])
async def get_all_clients(_: dict = Depends(verify_super_admin)):
    clients = await db.clients.find({}, {"_id": 0}).to_list(1000)
    return clients

@api_router.get("/super-admin/clients/{client_id}", response_model=Client)
async def get_client(client_id: str, _: dict = Depends(verify_super_admin)):
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@api_router.put("/super-admin/clients/{client_id}", response_model=Client)
async def update_client(client_id: str, updates: dict, _: dict = Depends(verify_super_admin)):
    result = await db.clients.find_one_and_update(
        {"client_id": client_id},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Client not found")
    result.pop('_id', None)
    return result

@api_router.delete("/super-admin/clients/{client_id}")
async def delete_client(client_id: str, _: dict = Depends(verify_super_admin)):
    result = await db.clients.delete_one({"client_id": client_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Client not found")
    
    await db.users.delete_many({"client_id": client_id})
    await db.page_content.delete_many({"client_id": client_id})
    await db.services.delete_many({"client_id": client_id})
    await db.offers.delete_many({"client_id": client_id})
    await db.bookings.delete_many({"client_id": client_id})
    
    return {"message": "Client deleted successfully"}

@api_router.put("/super-admin/content/{client_id}")
async def override_client_content(client_id: str, content: dict, _: dict = Depends(verify_super_admin)):
    result = await db.page_content.find_one_and_update(
        {"client_id": client_id},
        {"$set": {**content, "updated_at": datetime.now(timezone.utc).isoformat()}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    result.pop('_id', None)
    return result

# ============= Admin Routes =============

@api_router.get("/admin/content", response_model=PageContent)
async def get_admin_content(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    if payload['role'] == UserRole.ADMIN and not client_id:
        raise HTTPException(status_code=400, detail="Admin must have client_id")
    
    content = await db.page_content.find_one({"client_id": client_id}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@api_router.put("/admin/content")
async def update_admin_content(updates: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    if payload['role'] == UserRole.ADMIN and not client_id:
        raise HTTPException(status_code=400, detail="Admin must have client_id")
    
    result = await db.page_content.find_one_and_update(
        {"client_id": client_id},
        {"$set": {**updates, "updated_at": datetime.now(timezone.utc).isoformat()}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Content not found")
    result.pop('_id', None)
    return result

@api_router.post("/admin/services", response_model=Service)
async def create_service(service_data: ServiceCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    if payload['role'] == UserRole.ADMIN and not client_id:
        raise HTTPException(status_code=400, detail="Admin must have client_id")
    
    service = Service(client_id=client_id, **service_data.model_dump())
    await db.services.insert_one(service.model_dump())
    return service

@api_router.get("/admin/services", response_model=List[Service])
async def get_admin_services(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    services = await db.services.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return services

@api_router.put("/admin/services/{service_id}", response_model=Service)
async def update_service(service_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.services.find_one_and_update(
        {"service_id": service_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Service not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/services/{service_id}")
async def delete_service(service_id: str, payload: dict = Depends(verify_admin)):
    result = await db.services.delete_one({"service_id": service_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Service not found")
    return {"message": "Service deleted successfully"}

@api_router.post("/admin/offers", response_model=Offer)
async def create_offer(offer_data: OfferCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    if payload['role'] == UserRole.ADMIN and not client_id:
        raise HTTPException(status_code=400, detail="Admin must have client_id")
    
    offer = Offer(client_id=client_id, **offer_data.model_dump())
    await db.offers.insert_one(offer.model_dump())
    
    admins = await db.users.find({"client_id": client_id, "role": UserRole.ADMIN}, {"_id": 0}).to_list(100)
    for admin in admins:
        await create_notification(
            admin['user_id'],
            client_id,
            "New Offer Created",
            f"Offer '{offer_data.title.en}' has been created",
            "info"
        )
    
    return offer

@api_router.get("/admin/offers", response_model=List[Offer])
async def get_admin_offers(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    offers = await db.offers.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return offers

@api_router.put("/admin/offers/{offer_id}", response_model=Offer)
async def update_offer(offer_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.offers.find_one_and_update(
        {"offer_id": offer_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Offer not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/offers/{offer_id}")
async def delete_offer(offer_id: str, payload: dict = Depends(verify_admin)):
    result = await db.offers.delete_one({"offer_id": offer_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Offer not found")
    return {"message": "Offer deleted successfully"}

@api_router.get("/admin/bookings", response_model=List[Booking])
async def get_admin_bookings(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    bookings = await db.bookings.find({"client_id": client_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return bookings

@api_router.put("/admin/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.bookings.find_one_and_update(
        {"booking_id": booking_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    result.pop('_id', None)
    return result

@api_router.post("/admin/blocked-dates", response_model=BlockedDate)
async def create_blocked_date(date_data: BlockedDateCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    blocked = BlockedDate(client_id=client_id, date=date_data.date)
    await db.blocked_dates.insert_one(blocked.model_dump())
    return blocked

@api_router.get("/admin/blocked-dates", response_model=List[BlockedDate])
async def get_blocked_dates(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    dates = await db.blocked_dates.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return dates

@api_router.delete("/admin/blocked-dates/{blocked_id}")
async def delete_blocked_date(blocked_id: str, payload: dict = Depends(verify_admin)):
    result = await db.blocked_dates.delete_one({"blocked_id": blocked_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blocked date not found")
    return {"message": "Blocked date deleted successfully"}

@api_router.get("/admin/users", response_model=List[User])
async def get_admin_users(payload: dict = Depends(verify_admin)):
    if payload['role'] == UserRole.SUPER_ADMIN:
        users = await db.users.find({}, {"_id": 0, "password": 0}).to_list(1000)
    else:
        users = await db.users.find({"client_id": payload.get('client_id')}, {"_id": 0, "password": 0}).to_list(1000)
    return users

@api_router.delete("/admin/users/{user_id}")
async def delete_user(user_id: str, payload: dict = Depends(verify_admin)):
    if payload['role'] == UserRole.SUPER_ADMIN:
        result = await db.users.delete_one({"user_id": user_id})
    else:
        result = await db.users.delete_one({"user_id": user_id, "client_id": payload.get('client_id')})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

# ============= Public Routes =============

@api_router.get("/public/clients/{client_id}")
async def get_public_client(client_id: str):
    client = await db.clients.find_one({"client_id": client_id, "status": "active"}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client

@api_router.get("/public/content/{client_id}", response_model=PageContent)
async def get_public_content(client_id: str):
    content = await db.page_content.find_one({"client_id": client_id}, {"_id": 0})
    if not content:
        raise HTTPException(status_code=404, detail="Content not found")
    return content

@api_router.get("/public/services/{client_id}", response_model=List[Service])
async def get_public_services(client_id: str):
    services = await db.services.find({"client_id": client_id, "is_active": True}, {"_id": 0}).sort("display_order", 1).to_list(1000)
    return services

@api_router.get("/public/offers/{client_id}", response_model=List[Offer])
async def get_public_offers(client_id: str):
    now = datetime.now(timezone.utc).isoformat()
    offers = await db.offers.find({
        "client_id": client_id,
        "status": "active",
        "start_date": {"$lte": now},
        "end_date": {"$gte": now}
    }, {"_id": 0}).to_list(1000)
    return offers

@api_router.post("/public/bookings", response_model=Booking)
async def create_public_booking(booking_data: BookingCreate):
    is_blocked = await db.blocked_dates.find_one({
        "client_id": booking_data.client_id,
        "date": booking_data.event_date
    })
    if is_blocked:
        raise HTTPException(status_code=400, detail="Selected date is not available")
    
    booking = Booking(**booking_data.model_dump())
    await db.bookings.insert_one(booking.model_dump())
    
    client = await db.clients.find_one({"client_id": booking_data.client_id}, {"_id": 0})
    if client:
        html_content = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>New Booking Received</h2>
                <p><strong>Name:</strong> {booking.name}</p>
                <p><strong>Phone:</strong> {booking.phone}</p>
                <p><strong>Email:</strong> {booking.email or 'N/A'}</p>
                <p><strong>Event Type:</strong> {booking.event_type}</p>
                <p><strong>Event Date:</strong> {booking.event_date}</p>
                <p><strong>Event Time:</strong> {booking.event_time or 'N/A'}</p>
                <p><strong>Location:</strong> {booking.location or 'N/A'}</p>
                <p><strong>Message:</strong> {booking.message or 'N/A'}</p>
            </body>
        </html>
        """
        await send_email_notification(client['email'], f"New Booking - {booking.name}", html_content)
        
        admins = await db.users.find({"client_id": booking_data.client_id, "role": UserRole.ADMIN}, {"_id": 0}).to_list(100)
        for admin in admins:
            await create_notification(
                admin['user_id'],
                booking_data.client_id,
                "New Booking Received",
                f"{booking.name} booked for {booking.event_date}",
                "booking"
            )
    
    return booking

@api_router.get("/public/blocked-dates/{client_id}")
async def get_public_blocked_dates(client_id: str):
    dates = await db.blocked_dates.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return [d['date'] for d in dates]

# ============= Notification Routes =============

@api_router.get("/notifications", response_model=List[Notification])
async def get_user_notifications(payload: dict = Depends(verify_token)):
    notifications = await db.notifications.find(
        {"user_id": payload['user_id']},
        {"_id": 0}
    ).sort("created_at", -1).to_list(1000)
    return notifications

@api_router.put("/notifications/{notification_id}")
async def update_notification(notification_id: str, update: NotificationUpdate, payload: dict = Depends(verify_token)):
    result = await db.notifications.find_one_and_update(
        {"notification_id": notification_id, "user_id": payload['user_id']},
        {"$set": {"is_read": update.is_read}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Notification not found")
    result.pop('_id', None)
    return result

@api_router.delete("/notifications/{notification_id}")
async def delete_notification(notification_id: str, payload: dict = Depends(verify_token)):
    result = await db.notifications.delete_one({"notification_id": notification_id, "user_id": payload['user_id']})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    return {"message": "Notification deleted successfully"}

# Include router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
