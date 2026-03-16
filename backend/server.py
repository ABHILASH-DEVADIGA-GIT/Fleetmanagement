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

# Available Modules for clients
class AvailableModules:
    ABOUT = 'about'
    SERVICES = 'services'
    GALLERY = 'gallery'
    BOOKING = 'booking'
    PRODUCTS = 'products'
    OFFERS = 'offers'
    CONTACT = 'contact'

DEFAULT_MODULES = ['about', 'services', 'gallery', 'booking', 'offers', 'contact']

# Client Models
class ClientCreate(BaseModel):
    business_name: str
    email: EmailStr
    phone: str
    domain: Optional[str] = None
    subscription_plan: str = 'basic'
    enabled_languages: List[str] = ['en']
    theme: str = ThemeType.LIGHT
    enabled_modules: List[str] = Field(default_factory=lambda: DEFAULT_MODULES.copy())
    primary_color: str = '#1e40af'
    logo_url: Optional[str] = None
    admin_password: Optional[str] = None  # For auto-creating admin account

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
    enabled_modules: List[str] = Field(default_factory=lambda: DEFAULT_MODULES.copy())
    primary_color: str = '#1e40af'
    logo_url: Optional[str] = None
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

# ============= Business Management Models =============

# Lead Models
class LeadSource:
    WEBSITE = 'website'
    MANUAL = 'manual'
    INSTAGRAM = 'instagram'
    REFERRAL = 'referral'
    OTHER = 'other'

class LeadStatus:
    NEW = 'new'
    CONTACTED = 'contacted'
    FOLLOW_UP = 'follow_up'
    QUOTATION_SENT = 'quotation_sent'
    CONFIRMED = 'confirmed'
    LOST = 'lost'

class LeadCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    event_date: Optional[str] = None
    event_type: Optional[str] = None
    source: str = LeadSource.WEBSITE
    notes: Optional[str] = None

class Lead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    lead_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: str
    phone: str
    email: Optional[EmailStr] = None
    event_date: Optional[str] = None
    event_type: Optional[str] = None
    source: str
    status: str = LeadStatus.NEW
    assigned_package_id: Optional[str] = None
    follow_up_date: Optional[str] = None
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class LeadNote(BaseModel):
    note_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    lead_id: str
    note: str
    created_by: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Package Models
class PackageCreate(BaseModel):
    name: str
    base_price: float
    description: Optional[str] = None
    included_services: List[str] = []
    default_discount: float = 0

class Package(BaseModel):
    model_config = ConfigDict(extra="ignore")
    package_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: str
    base_price: float
    description: Optional[str] = None
    included_services: List[str] = []
    default_discount: float = 0
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Add-on Models
class AddOnCreate(BaseModel):
    name: str
    price: float
    description: Optional[str] = None

class AddOn(BaseModel):
    model_config = ConfigDict(extra="ignore")
    addon_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: str
    price: float
    description: Optional[str] = None
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Quotation Models
class QuotationItem(BaseModel):
    item_type: str  # 'package' | 'addon' | 'custom'
    item_id: Optional[str] = None
    name: str
    price: float
    quantity: int = 1

class QuotationCreate(BaseModel):
    lead_id: str
    items: List[QuotationItem]
    discount_percentage: float = 0
    discount_amount: float = 0
    tax_percentage: float = 0
    notes: Optional[str] = None

class Quotation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    quotation_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    quotation_number: str
    client_id: str
    lead_id: str
    items: List[QuotationItem]
    subtotal: float
    discount_percentage: float
    discount_amount: float
    tax_percentage: float
    tax_amount: float
    total_amount: float
    notes: Optional[str] = None
    status: str = 'draft'  # draft, sent, accepted, rejected
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    sent_at: Optional[str] = None
    accepted_at: Optional[str] = None

# Invoice Models
class PaymentRecord(BaseModel):
    payment_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    amount: float
    payment_date: str
    payment_method: Optional[str] = None
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class Invoice(BaseModel):
    model_config = ConfigDict(extra="ignore")
    invoice_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    invoice_number: str
    client_id: str
    quotation_id: str
    lead_id: str
    issue_date: str
    event_date: Optional[str] = None
    items: List[QuotationItem]
    subtotal: float
    discount_amount: float
    tax_amount: float
    total_amount: float
    paid_amount: float = 0
    balance_due: float
    status: str = 'unpaid'  # unpaid, partially_paid, paid
    payments: List[PaymentRecord] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Expense Models
class ExpenseCreate(BaseModel):
    event_id: str
    category: str  # travel, equipment, assistant, other
    amount: float
    description: Optional[str] = None
    expense_date: str

class Expense(BaseModel):
    model_config = ConfigDict(extra="ignore")
    expense_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    event_id: str
    category: str
    amount: float
    description: Optional[str] = None
    expense_date: str
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Event Models (extends Booking)
class Event(BaseModel):
    model_config = ConfigDict(extra="ignore")
    event_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    lead_id: Optional[str] = None
    booking_id: Optional[str] = None
    invoice_id: Optional[str] = None
    name: str
    event_type: str
    event_date: str
    event_time: Optional[str] = None
    location: Optional[str] = None
    status: str = 'inquiry'  # inquiry, confirmed, completed, cancelled
    revenue: float = 0
    total_expenses: float = 0
    profit: float = 0
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Gallery Models
class GalleryImage(BaseModel):
    model_config = ConfigDict(extra="ignore")
    image_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    image_url: str
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    display_order: int = 0
    is_featured: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Product Catalog Models
class ProductCreate(BaseModel):
    name: MultiLangContent
    description: MultiLangContent
    images: List[str] = []
    base_price: float
    discount_percentage: float = 0
    category: Optional[str] = None
    is_active: bool = True

class Product(BaseModel):
    model_config = ConfigDict(extra="ignore")
    product_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: MultiLangContent
    description: MultiLangContent
    images: List[str] = []
    base_price: float
    discount_percentage: float = 0
    final_price: float = 0  # Calculated field
    category: Optional[str] = None
    is_active: bool = True
    display_order: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Product Category Model
class ProductCategory(BaseModel):
    model_config = ConfigDict(extra="ignore")
    category_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    name: MultiLangContent
    display_order: int = 0
    is_active: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Enhanced Page Content Model for fully editable sections
class HeroSection(BaseModel):
    background_image: Optional[str] = None
    logo_url: Optional[str] = None
    headline: MultiLangContent = Field(default_factory=MultiLangContent)
    sub_headline: MultiLangContent = Field(default_factory=MultiLangContent)
    cta_text: MultiLangContent = Field(default_factory=MultiLangContent)
    cta_link: Optional[str] = None

class AboutSectionEnhanced(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    description: MultiLangContent = Field(default_factory=MultiLangContent)
    image_url: Optional[str] = None
    stats: List[Dict[str, Any]] = []  # [{label: "Years", value: "10+"}]

class ServicesSectionContent(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    subtitle: MultiLangContent = Field(default_factory=MultiLangContent)

class GallerySectionContent(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    subtitle: MultiLangContent = Field(default_factory=MultiLangContent)

class ProductsSectionContent(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    subtitle: MultiLangContent = Field(default_factory=MultiLangContent)

class BookingSectionContent(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    subtitle: MultiLangContent = Field(default_factory=MultiLangContent)

class ContactSectionContent(BaseModel):
    title: MultiLangContent = Field(default_factory=MultiLangContent)
    subtitle: MultiLangContent = Field(default_factory=MultiLangContent)
    address: MultiLangContent = Field(default_factory=MultiLangContent)
    map_embed_url: Optional[str] = None

class FooterContent(BaseModel):
    copyright_text: MultiLangContent = Field(default_factory=MultiLangContent)
    social_links: Dict[str, str] = {}  # {facebook: url, instagram: url}

class SiteContent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    content_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    hero: HeroSection = Field(default_factory=HeroSection)
    about: AboutSectionEnhanced = Field(default_factory=AboutSectionEnhanced)
    services_section: ServicesSectionContent = Field(default_factory=ServicesSectionContent)
    gallery_section: GallerySectionContent = Field(default_factory=GallerySectionContent)
    products_section: ProductsSectionContent = Field(default_factory=ProductsSectionContent)
    booking_section: BookingSectionContent = Field(default_factory=BookingSectionContent)
    contact: ContactSectionContent = Field(default_factory=ContactSectionContent)
    footer: FooterContent = Field(default_factory=FooterContent)
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

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
    # Check for duplicate domain
    if client_data.domain:
        existing = await db.clients.find_one({"domain": client_data.domain}, {"_id": 0})
        if existing:
            raise HTTPException(status_code=400, detail="Domain already in use")
    
    # Create client without admin_password field
    client_dict = client_data.model_dump()
    admin_password = client_dict.pop('admin_password', None) or 'admin123'
    
    client = Client(**client_dict)
    await db.clients.insert_one(client.model_dump())
    
    # Auto-create admin user for this client
    hashed_pw = hash_password(admin_password)
    admin_user = User(
        email=client_data.email,
        role=UserRole.ADMIN,
        client_id=client.client_id,
        full_name=f"{client_data.business_name} Admin"
    )
    admin_dict = admin_user.model_dump()
    admin_dict['password'] = hashed_pw
    await db.users.insert_one(admin_dict)
    
    # Create default site content
    site_content = SiteContent(
        client_id=client.client_id,
        hero=HeroSection(
            headline=MultiLangContent(en="Welcome to " + client_data.business_name, kn="ಸ್ವಾಗತ", hi="स्वागत है"),
            sub_headline=MultiLangContent(en="Your trusted service partner", kn="ನಿಮ್ಮ ನಂಬಿಕೆಯ ಸೇವಾ ಪಾಲುದಾರ", hi="आपका विश्वसनीय सेवा भागीदार"),
            cta_text=MultiLangContent(en="Get Started", kn="ಪ್ರಾರಂಭಿಸಿ", hi="शुरू करें")
        ),
        about=AboutSectionEnhanced(
            title=MultiLangContent(en="About Us", kn="ನಮ್ಮ ಬಗ್ಗೆ", hi="हमारे बारे में"),
            description=MultiLangContent(en="We provide professional services with dedication and excellence.", kn="ನಾವು ಸಮರ್ಪಣೆ ಮತ್ತು ಶ್ರೇಷ್ಠತೆಯೊಂದಿಗೆ ವೃತ್ತಿಪರ ಸೇವೆಗಳನ್ನು ಒದಗಿಸುತ್ತೇವೆ.", hi="हम समर्पण और उत्कृष्टता के साथ पेशेवर सेवाएं प्रदान करते हैं।"),
            stats=[{"label": "Years", "value": "10+"}, {"label": "Clients", "value": "500+"}]
        ),
        services_section=ServicesSectionContent(
            title=MultiLangContent(en="Our Services", kn="ನಮ್ಮ ಸೇವೆಗಳು", hi="हमारी सेवाएं"),
            subtitle=MultiLangContent(en="What we offer", kn="ನಾವು ಏನು ನೀಡುತ್ತೇವೆ", hi="हम क्या प्रदान करते हैं")
        ),
        gallery_section=GallerySectionContent(
            title=MultiLangContent(en="Our Gallery", kn="ನಮ್ಮ ಗ್ಯಾಲರಿ", hi="हमारी गैलरी"),
            subtitle=MultiLangContent(en="See our work", kn="ನಮ್ಮ ಕೆಲಸ ನೋಡಿ", hi="हमारा काम देखें")
        ),
        products_section=ProductsSectionContent(
            title=MultiLangContent(en="Our Products", kn="ನಮ್ಮ ಉತ್ಪನ್ನಗಳು", hi="हमारे उत्पाद"),
            subtitle=MultiLangContent(en="Explore our catalog", kn="ನಮ್ಮ ಕ್ಯಾಟಲಾಗ್ ಅನ್ವೇಷಿಸಿ", hi="हमारी सूची का अन्वेषण करें")
        ),
        booking_section=BookingSectionContent(
            title=MultiLangContent(en="Book Appointment", kn="ಅಪಾಯಿಂಟ್ಮೆಂಟ್ ಬುಕ್ ಮಾಡಿ", hi="अपॉइंटमेंट बुक करें"),
            subtitle=MultiLangContent(en="Schedule your session", kn="ನಿಮ್ಮ ಸೆಷನ್ ಶೆಡ್ಯೂಲ್ ಮಾಡಿ", hi="अपना सत्र शेड्यूल करें")
        ),
        contact=ContactSectionContent(
            title=MultiLangContent(en="Contact Us", kn="ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ", hi="संपर्क करें"),
            subtitle=MultiLangContent(en="Get in touch", kn="ಸಂಪರ್ಕದಲ್ಲಿರಿ", hi="संपर्क में रहें"),
            address=MultiLangContent(en="Your Address Here", kn="ನಿಮ್ಮ ವಿಳಾಸ", hi="आपका पता")
        ),
        footer=FooterContent(
            copyright_text=MultiLangContent(en=f"© 2025 {client_data.business_name}. All rights reserved.", kn=f"© 2025 {client_data.business_name}. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.", hi=f"© 2025 {client_data.business_name}. सर्वाधिकार सुरक्षित।"),
            social_links={}
        )
    )
    await db.site_content.insert_one(site_content.model_dump())
    
    # Also create legacy page_content for backward compatibility
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
    
    # Create welcome notifications for the new admin
    await create_notification(
        client_id=client.client_id,
        title="Welcome to FrameBook Pro!",
        message=f"Your business '{client_data.business_name}' is now set up. Start by customizing your website.",
        notification_type="success",
        link="/admin/site-content"
    )
    await create_notification(
        client_id=client.client_id,
        title="Add Your Services",
        message="Add your services to showcase them on your public website.",
        notification_type="info",
        link="/admin/services"
    )
    await create_notification(
        client_id=client.client_id,
        title="Upload Gallery Images",
        message="Upload photos to your gallery to attract more customers.",
        notification_type="info",
        link="/admin/gallery"
    )
    
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


# ============= Business Management Routes =============

# Dashboard Stats
@api_router.get("/admin/dashboard/stats")
async def get_dashboard_stats(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    now = datetime.now(timezone.utc)
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get all invoices for the month
    invoices = await db.invoices.find({
        "client_id": client_id,
        "issue_date": {"$gte": month_start.isoformat()}
    }, {"_id": 0}).to_list(1000)
    
    total_revenue = sum(inv['total_amount'] for inv in invoices)
    pending_payments = sum(inv['balance_due'] for inv in invoices if inv['balance_due'] > 0)
    
    # Get events
    events_this_month = await db.events.count_documents({
        "client_id": client_id,
        "event_date": {"$gte": month_start.isoformat()[:10]}
    })
    
    # Get upcoming events (next 7 days)
    next_week = (now + timedelta(days=7)).isoformat()[:10]
    upcoming_events = await db.events.find({
        "client_id": client_id,
        "event_date": {"$gte": now.isoformat()[:10], "$lte": next_week},
        "status": {"$in": ["confirmed", "inquiry"]}
    }, {"_id": 0}).to_list(100)
    
    # Get new leads (unread)
    new_leads_count = await db.leads.count_documents({
        "client_id": client_id,
        "status": "new"
    })
    
    return {
        "total_revenue_month": total_revenue,
        "events_this_month": events_this_month,
        "pending_payments": pending_payments,
        "upcoming_events": upcoming_events,
        "new_leads_count": new_leads_count
    }

# Calendar Data
@api_router.get("/admin/calendar")
async def get_calendar_data(payload: dict = Depends(verify_admin), month: Optional[str] = None):
    client_id = payload.get('client_id')
    
    if month:
        # Parse YYYY-MM format
        year, month_num = map(int, month.split('-'))
        start_date = datetime(year, month_num, 1, tzinfo=timezone.utc)
        if month_num == 12:
            end_date = datetime(year + 1, 1, 1, tzinfo=timezone.utc)
        else:
            end_date = datetime(year, month_num + 1, 1, tzinfo=timezone.utc)
    else:
        now = datetime.now(timezone.utc)
        start_date = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        if now.month == 12:
            end_date = now.replace(year=now.year + 1, month=1, day=1)
        else:
            end_date = now.replace(month=now.month + 1, day=1)
    
    events = await db.events.find({
        "client_id": client_id,
        "event_date": {
            "$gte": start_date.isoformat()[:10],
            "$lt": end_date.isoformat()[:10]
        }
    }, {"_id": 0}).to_list(1000)
    
    # Group by date
    calendar_data = {}
    for event in events:
        date = event['event_date']
        if date not in calendar_data:
            calendar_data[date] = []
        calendar_data[date].append(event)
    
    return calendar_data

# Lead Management
@api_router.post("/admin/leads", response_model=Lead)
async def create_lead(lead_data: LeadCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    lead = Lead(client_id=client_id, **lead_data.model_dump())
    await db.leads.insert_one(lead.model_dump())
    
    # Create notification
    await create_notification(
        payload['user_id'],
        client_id,
        "New Lead Added",
        f"Lead {lead.name} has been added",
        "info"
    )
    
    return lead

@api_router.get("/admin/leads", response_model=List[Lead])
async def get_leads(payload: dict = Depends(verify_admin), status: Optional[str] = None):
    client_id = payload.get('client_id')
    query = {"client_id": client_id}
    if status:
        query["status"] = status
    leads = await db.leads.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return leads

@api_router.put("/admin/leads/{lead_id}", response_model=Lead)
async def update_lead(lead_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.leads.find_one_and_update(
        {"lead_id": lead_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Lead not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/leads/{lead_id}")
async def delete_lead(lead_id: str, payload: dict = Depends(verify_admin)):
    result = await db.leads.delete_one({"lead_id": lead_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Lead not found")
    return {"message": "Lead deleted successfully"}

@api_router.post("/admin/leads/{lead_id}/notes")
async def add_lead_note(lead_id: str, note_text: dict, payload: dict = Depends(verify_admin)):
    note = LeadNote(
        lead_id=lead_id,
        note=note_text.get('note', ''),
        created_by=payload['user_id']
    )
    await db.lead_notes.insert_one(note.model_dump())
    return note

@api_router.get("/admin/leads/{lead_id}/notes")
async def get_lead_notes(lead_id: str, payload: dict = Depends(verify_admin)):
    notes = await db.lead_notes.find({"lead_id": lead_id}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return notes

# Package Management
@api_router.post("/admin/packages", response_model=Package)
async def create_package(package_data: PackageCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    package = Package(client_id=client_id, **package_data.model_dump())
    await db.packages.insert_one(package.model_dump())
    return package

@api_router.get("/admin/packages", response_model=List[Package])
async def get_packages(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    packages = await db.packages.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return packages

@api_router.put("/admin/packages/{package_id}", response_model=Package)
async def update_package(package_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.packages.find_one_and_update(
        {"package_id": package_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Package not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/packages/{package_id}")
async def delete_package(package_id: str, payload: dict = Depends(verify_admin)):
    result = await db.packages.delete_one({"package_id": package_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted successfully"}

# Add-on Management
@api_router.post("/admin/addons", response_model=AddOn)
async def create_addon(addon_data: AddOnCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    addon = AddOn(client_id=client_id, **addon_data.model_dump())

# Gallery Management
@api_router.post("/admin/gallery", response_model=GalleryImage)
async def add_gallery_image(image_data: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    image = GalleryImage(client_id=client_id, **image_data)
    await db.gallery.insert_one(image.model_dump())
    return image

@api_router.get("/admin/gallery", response_model=List[GalleryImage])
async def get_admin_gallery(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    images = await db.gallery.find({"client_id": client_id}, {"_id": 0}).sort("display_order", 1).to_list(1000)
    return images

@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, payload: dict = Depends(verify_admin)):
    result = await db.gallery.delete_one({"image_id": image_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

@api_router.get("/public/gallery/{client_id}", response_model=List[GalleryImage])
async def get_public_gallery(client_id: str):
    images = await db.gallery.find({"client_id": client_id}, {"_id": 0}).sort("display_order", 1).to_list(1000)
    return images

    await db.addons.insert_one(addon.model_dump())
    return addon

@api_router.get("/admin/addons", response_model=List[AddOn])
async def get_addons(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    addons = await db.addons.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return addons

@api_router.put("/admin/addons/{addon_id}", response_model=AddOn)
async def update_addon(addon_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.addons.find_one_and_update(
        {"addon_id": addon_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Add-on not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/addons/{addon_id}")
async def delete_addon(addon_id: str, payload: dict = Depends(verify_admin)):
    result = await db.addons.delete_one({"addon_id": addon_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Add-on not found")
    return {"message": "Add-on deleted successfully"}

# Quotation Management
async def generate_quotation_number(client_id: str) -> str:
    count = await db.quotations.count_documents({"client_id": client_id})
    return f"QT-{count + 1:04d}"

@api_router.post("/admin/quotations", response_model=Quotation)
async def create_quotation(quotation_data: QuotationCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in quotation_data.items)
    discount_amount = quotation_data.discount_amount or (subtotal * quotation_data.discount_percentage / 100)
    tax_amount = (subtotal - discount_amount) * quotation_data.tax_percentage / 100
    total_amount = subtotal - discount_amount + tax_amount
    
    quotation_number = await generate_quotation_number(client_id)
    
    quotation = Quotation(
        quotation_number=quotation_number,
        client_id=client_id,
        lead_id=quotation_data.lead_id,
        items=quotation_data.items,
        subtotal=subtotal,
        discount_percentage=quotation_data.discount_percentage,
        discount_amount=discount_amount,
        tax_percentage=quotation_data.tax_percentage,
        tax_amount=tax_amount,
        total_amount=total_amount,
        notes=quotation_data.notes
    )
    
    await db.quotations.insert_one(quotation.model_dump())
    
    # Update lead status
    await db.leads.update_one(
        {"lead_id": quotation_data.lead_id},
        {"$set": {"status": LeadStatus.QUOTATION_SENT}}
    )
    
    return quotation

@api_router.get("/admin/quotations", response_model=List[Quotation])
async def get_quotations(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    quotations = await db.quotations.find({"client_id": client_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return quotations

@api_router.get("/admin/quotations/{quotation_id}", response_model=Quotation)
async def get_quotation(quotation_id: str, payload: dict = Depends(verify_admin)):
    quotation = await db.quotations.find_one({"quotation_id": quotation_id, "client_id": payload.get('client_id')}, {"_id": 0})
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return quotation

@api_router.put("/admin/quotations/{quotation_id}/status")
async def update_quotation_status(quotation_id: str, status_data: dict, payload: dict = Depends(verify_admin)):
    new_status = status_data.get('status')
    updates = {"status": new_status}
    
    if new_status == 'sent':
        updates['sent_at'] = datetime.now(timezone.utc).isoformat()
    elif new_status == 'accepted':
        updates['accepted_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.quotations.find_one_and_update(
        {"quotation_id": quotation_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    result.pop('_id', None)
    return result

@api_router.put("/admin/quotations/{quotation_id}")
async def update_quotation(quotation_id: str, quotation_data: QuotationCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in quotation_data.items)
    discount_amount = quotation_data.discount_amount or (subtotal * quotation_data.discount_percentage / 100)
    tax_amount = (subtotal - discount_amount) * quotation_data.tax_percentage / 100
    total_amount = subtotal - discount_amount + tax_amount
    
    updates = {
        "lead_id": quotation_data.lead_id,
        "items": [item.model_dump() for item in quotation_data.items],
        "subtotal": subtotal,
        "discount_percentage": quotation_data.discount_percentage,
        "discount_amount": discount_amount,
        "tax_percentage": quotation_data.tax_percentage,
        "tax_amount": tax_amount,
        "total_amount": total_amount,
        "notes": quotation_data.notes
    }
    
    result = await db.quotations.find_one_and_update(
        {"quotation_id": quotation_id, "client_id": client_id},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    result.pop('_id', None)
    return result

@api_router.delete("/admin/quotations/{quotation_id}")
async def delete_quotation(quotation_id: str, payload: dict = Depends(verify_admin)):
    result = await db.quotations.delete_one({"quotation_id": quotation_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Quotation not found")
    return {"message": "Quotation deleted successfully"}

# Quotation PDF Data (includes admin/client and customer details)
@api_router.get("/admin/quotations/{quotation_id}/pdf-data")
async def get_quotation_pdf_data(quotation_id: str, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Get quotation
    quotation = await db.quotations.find_one({"quotation_id": quotation_id, "client_id": client_id}, {"_id": 0})
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    # Get client/admin details
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    
    # Get lead (customer) details
    lead = await db.leads.find_one({"lead_id": quotation['lead_id']}, {"_id": 0})
    
    return {
        "quotation": quotation,
        "client": client,
        "customer": lead
    }

# Invoice Management
async def generate_invoice_number(client_id: str) -> str:
    count = await db.invoices.count_documents({"client_id": client_id})
    return f"INV-{count + 1:04d}"

@api_router.post("/admin/invoices/from-quotation/{quotation_id}", response_model=Invoice)
async def create_invoice_from_quotation(quotation_id: str, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    quotation = await db.quotations.find_one({"quotation_id": quotation_id, "client_id": client_id}, {"_id": 0})
    if not quotation:
        raise HTTPException(status_code=404, detail="Quotation not found")
    
    invoice_number = await generate_invoice_number(client_id)
    
    invoice = Invoice(
        invoice_number=invoice_number,
        client_id=client_id,
        quotation_id=quotation_id,
        lead_id=quotation['lead_id'],
        issue_date=datetime.now(timezone.utc).isoformat()[:10],
        items=quotation['items'],
        subtotal=quotation['subtotal'],
        discount_amount=quotation['discount_amount'],
        tax_amount=quotation['tax_amount'],
        total_amount=quotation['total_amount'],
        paid_amount=0,
        balance_due=quotation['total_amount'],
        status='unpaid',
        payments=[]
    )
    
    await db.invoices.insert_one(invoice.model_dump())
    
    # Update quotation status
    await db.quotations.update_one(
        {"quotation_id": quotation_id},
        {"$set": {"status": "accepted"}}
    )
    
    return invoice

@api_router.get("/admin/invoices", response_model=List[Invoice])
async def get_invoices(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    invoices = await db.invoices.find({"client_id": client_id}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return invoices

@api_router.post("/admin/invoices/{invoice_id}/payments")
async def add_payment(invoice_id: str, payment_data: dict, payload: dict = Depends(verify_admin)):
    invoice = await db.invoices.find_one({"invoice_id": invoice_id, "client_id": payload.get('client_id')}, {"_id": 0})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    payment = PaymentRecord(
        amount=payment_data['amount'],
        payment_date=payment_data.get('payment_date', datetime.now(timezone.utc).isoformat()[:10]),
        payment_method=payment_data.get('payment_method'),
        notes=payment_data.get('notes')
    )
    
    new_paid_amount = invoice['paid_amount'] + payment.amount
    new_balance = invoice['total_amount'] - new_paid_amount
    
    if new_balance <= 0:
        new_status = 'paid'
    elif new_paid_amount > 0:
        new_status = 'partially_paid'
    else:
        new_status = 'unpaid'
    
    result = await db.invoices.find_one_and_update(
        {"invoice_id": invoice_id},
        {
            "$push": {"payments": payment.model_dump()},
            "$set": {
                "paid_amount": new_paid_amount,
                "balance_due": new_balance,
                "status": new_status
            }
        },
        return_document=True
    )
    
    result.pop('_id', None)
    return result

# Create Invoice directly (without quotation)
class InvoiceCreate(BaseModel):
    customer_name: str
    customer_phone: str
    customer_email: Optional[str] = None
    items: List[QuotationItem]
    discount_percentage: float = 0
    discount_amount: float = 0
    tax_percentage: float = 0
    notes: Optional[str] = None
    event_date: Optional[str] = None

@api_router.post("/admin/invoices", response_model=Invoice)
async def create_invoice(invoice_data: InvoiceCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in invoice_data.items)
    discount_amount = invoice_data.discount_amount or (subtotal * invoice_data.discount_percentage / 100)
    tax_amount = (subtotal - discount_amount) * invoice_data.tax_percentage / 100
    total_amount = subtotal - discount_amount + tax_amount
    
    invoice_number = await generate_invoice_number(client_id)
    
    # Create a lead for the customer if needed
    lead = Lead(
        client_id=client_id,
        name=invoice_data.customer_name,
        phone=invoice_data.customer_phone,
        email=invoice_data.customer_email,
        source='manual'
    )
    await db.leads.insert_one(lead.model_dump())
    
    invoice = Invoice(
        invoice_number=invoice_number,
        client_id=client_id,
        quotation_id='',
        lead_id=lead.lead_id,
        issue_date=datetime.now(timezone.utc).isoformat()[:10],
        event_date=invoice_data.event_date,
        items=[item.model_dump() for item in invoice_data.items],
        subtotal=subtotal,
        discount_amount=discount_amount,
        tax_amount=tax_amount,
        total_amount=total_amount,
        paid_amount=0,
        balance_due=total_amount,
        status='unpaid',
        payments=[]
    )
    
    await db.invoices.insert_one(invoice.model_dump())
    return invoice

@api_router.put("/admin/invoices/{invoice_id}")
async def update_invoice(invoice_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.invoices.find_one_and_update(
        {"invoice_id": invoice_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Invoice not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/invoices/{invoice_id}")
async def delete_invoice(invoice_id: str, payload: dict = Depends(verify_admin)):
    result = await db.invoices.delete_one({"invoice_id": invoice_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return {"message": "Invoice deleted successfully"}

# Invoice PDF Data
@api_router.get("/admin/invoices/{invoice_id}/pdf-data")
async def get_invoice_pdf_data(invoice_id: str, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Get invoice
    invoice = await db.invoices.find_one({"invoice_id": invoice_id, "client_id": client_id}, {"_id": 0})
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    
    # Get client/admin details
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    
    # Get lead (customer) details
    lead = await db.leads.find_one({"lead_id": invoice['lead_id']}, {"_id": 0})
    
    return {
        "invoice": invoice,
        "client": client,
        "customer": lead
    }

# Walk-in Appointment (Block time period)
class WalkInAppointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    walkin_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    title: str
    start_date: str
    end_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notes: Optional[str] = None
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class WalkInCreate(BaseModel):
    title: str
    start_date: str
    end_date: str
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notes: Optional[str] = None

@api_router.post("/admin/walkin-appointments", response_model=WalkInAppointment)
async def create_walkin(walkin_data: WalkInCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    walkin = WalkInAppointment(client_id=client_id, **walkin_data.model_dump())
    await db.walkin_appointments.insert_one(walkin.model_dump())
    return walkin

@api_router.get("/admin/walkin-appointments", response_model=List[WalkInAppointment])
async def get_walkins(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    walkins = await db.walkin_appointments.find({"client_id": client_id}, {"_id": 0}).to_list(1000)
    return walkins

@api_router.delete("/admin/walkin-appointments/{walkin_id}")
async def delete_walkin(walkin_id: str, payload: dict = Depends(verify_admin)):
    result = await db.walkin_appointments.delete_one({"walkin_id": walkin_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Walk-in appointment not found")
    return {"message": "Walk-in appointment deleted"}

# Update booking status
@api_router.put("/admin/bookings/{booking_id}/status")
async def update_booking_status(booking_id: str, status_data: dict, payload: dict = Depends(verify_admin)):
    result = await db.bookings.find_one_and_update(
        {"booking_id": booking_id, "client_id": payload.get('client_id')},
        {"$set": {"status": status_data.get('status')}},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Booking not found")
    result.pop('_id', None)
    return result

# Delete expense
@api_router.delete("/admin/expenses/{expense_id}")
async def delete_expense(expense_id: str, payload: dict = Depends(verify_admin)):
    result = await db.expenses.delete_one({"expense_id": expense_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense deleted"}

# Expense Management
@api_router.post("/admin/expenses", response_model=Expense)
async def create_expense(expense_data: ExpenseCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    expense = Expense(client_id=client_id, **expense_data.model_dump())
    await db.expenses.insert_one(expense.model_dump())
    
    # Update event totals
    event = await db.events.find_one({"event_id": expense_data.event_id}, {"_id": 0})
    if event:
        total_expenses = await db.expenses.aggregate([
            {"$match": {"event_id": expense_data.event_id}},
            {"$group": {"_id": None, "total": {"$sum": "$amount"}}}
        ]).to_list(1)
        
        new_total_expenses = total_expenses[0]['total'] if total_expenses else 0
        new_profit = event.get('revenue', 0) - new_total_expenses
        
        await db.events.update_one(
            {"event_id": expense_data.event_id},
            {"$set": {"total_expenses": new_total_expenses, "profit": new_profit}}
        )
    
    return expense

@api_router.get("/admin/expenses")
async def get_expenses(payload: dict = Depends(verify_admin), event_id: Optional[str] = None):
    client_id = payload.get('client_id')
    query = {"client_id": client_id}
    if event_id:
        query["event_id"] = event_id
    expenses = await db.expenses.find(query, {"_id": 0}).sort("expense_date", -1).to_list(1000)
    return expenses

# Event Management
@api_router.post("/admin/events", response_model=Event)
async def create_event(event_data: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    event = Event(client_id=client_id, **event_data)
    await db.events.insert_one(event.model_dump())
    return event

@api_router.get("/admin/events", response_model=List[Event])
async def get_events(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    events = await db.events.find({"client_id": client_id}, {"_id": 0}).sort("event_date", -1).to_list(1000)
    return events

@api_router.put("/admin/events/{event_id}", response_model=Event)
async def update_event(event_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.events.find_one_and_update(
        {"event_id": event_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Event not found")
    result.pop('_id', None)
    return result

# Reports
@api_router.get("/admin/reports/revenue")
async def get_revenue_report(payload: dict = Depends(verify_admin), period: str = 'monthly', year: Optional[int] = None):
    client_id = payload.get('client_id')
    year = year or datetime.now().year
    
    if period == 'monthly':
        pipeline = [
            {"$match": {"client_id": client_id}},
            {"$addFields": {
                "month": {"$substr": ["$issue_date", 5, 2]},
                "year": {"$substr": ["$issue_date", 0, 4]}
            }},
            {"$match": {"year": str(year)}},
            {"$group": {
                "_id": "$month",
                "total_revenue": {"$sum": "$total_amount"},
                "total_paid": {"$sum": "$paid_amount"}
            }},
            {"$sort": {"_id": 1}}
        ]
    else:  # yearly
        pipeline = [
            {"$match": {"client_id": client_id}},
            {"$addFields": {"year": {"$substr": ["$issue_date", 0, 4]}}},
            {"$group": {
                "_id": "$year",
                "total_revenue": {"$sum": "$total_amount"},
                "total_paid": {"$sum": "$paid_amount"}
            }},
            {"$sort": {"_id": 1}}
        ]
    
    results = await db.invoices.aggregate(pipeline).to_list(100)
    return results

@api_router.get("/admin/reports/pending-payments")
async def get_pending_payments_report(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    pending_invoices = await db.invoices.find({
        "client_id": client_id,
        "balance_due": {"$gt": 0}
    }, {"_id": 0}).sort("issue_date", 1).to_list(1000)
    return pending_invoices

@api_router.get("/admin/reports/lead-conversion")
async def get_lead_conversion_report(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    total_leads = await db.leads.count_documents({"client_id": client_id})
    confirmed_leads = await db.leads.count_documents({"client_id": client_id, "status": LeadStatus.CONFIRMED})
    lost_leads = await db.leads.count_documents({"client_id": client_id, "status": LeadStatus.LOST})
    
    conversion_rate = (confirmed_leads / total_leads * 100) if total_leads > 0 else 0
    
    return {
        "total_leads": total_leads,
        "confirmed_leads": confirmed_leads,
        "lost_leads": lost_leads,
        "conversion_rate": round(conversion_rate, 2)
    }

@api_router.get("/admin/reports/event-profit")
async def get_event_profit_report(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    events = await db.events.find({
        "client_id": client_id,
        "status": "completed"
    }, {"_id": 0}).sort("event_date", -1).to_list(1000)
    return events

# ============= Product Management APIs =============

@api_router.post("/admin/products", response_model=Product)
async def create_product(product_data: ProductCreate, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    # Calculate final price
    final_price = product_data.base_price * (1 - product_data.discount_percentage / 100)
    
    product = Product(
        client_id=client_id,
        final_price=round(final_price, 2),
        **product_data.model_dump()
    )
    await db.products.insert_one(product.model_dump())
    return product

@api_router.get("/admin/products", response_model=List[Product])
async def get_products(payload: dict = Depends(verify_admin), category: Optional[str] = None):
    client_id = payload.get('client_id')
    query = {"client_id": client_id}
    if category:
        query["category"] = category
    products = await db.products.find(query, {"_id": 0}).sort("display_order", 1).to_list(1000)
    return products

@api_router.get("/admin/products/{product_id}", response_model=Product)
async def get_product(product_id: str, payload: dict = Depends(verify_admin)):
    product = await db.products.find_one(
        {"product_id": product_id, "client_id": payload.get('client_id')}, 
        {"_id": 0}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@api_router.put("/admin/products/{product_id}", response_model=Product)
async def update_product(product_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    # Recalculate final price if base_price or discount changed
    if 'base_price' in updates or 'discount_percentage' in updates:
        existing = await db.products.find_one({"product_id": product_id}, {"_id": 0})
        if existing:
            base = updates.get('base_price', existing.get('base_price', 0))
            disc = updates.get('discount_percentage', existing.get('discount_percentage', 0))
            updates['final_price'] = round(base * (1 - disc / 100), 2)
    
    result = await db.products.find_one_and_update(
        {"product_id": product_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Product not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/products/{product_id}")
async def delete_product(product_id: str, payload: dict = Depends(verify_admin)):
    result = await db.products.delete_one({"product_id": product_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# ============= Product Category APIs =============

@api_router.post("/admin/product-categories")
async def create_product_category(category_data: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    category = ProductCategory(client_id=client_id, name=MultiLangContent(**category_data.get('name', {})))
    await db.product_categories.insert_one(category.model_dump())
    return category

@api_router.get("/admin/product-categories")
async def get_product_categories(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    categories = await db.product_categories.find({"client_id": client_id}, {"_id": 0}).to_list(100)
    return categories

@api_router.delete("/admin/product-categories/{category_id}")
async def delete_product_category(category_id: str, payload: dict = Depends(verify_admin)):
    result = await db.product_categories.delete_one({"category_id": category_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# ============= Site Content Management APIs =============

@api_router.get("/admin/site-content")
async def get_site_content(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    content = await db.site_content.find_one({"client_id": client_id}, {"_id": 0})
    if not content:
        # Create default content
        default = SiteContent(client_id=client_id)
        await db.site_content.insert_one(default.model_dump())
        content = default.model_dump()
    return content

@api_router.put("/admin/site-content")
async def update_site_content(updates: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    updates['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    result = await db.site_content.find_one_and_update(
        {"client_id": client_id},
        {"$set": updates},
        return_document=True,
        upsert=True
    )
    result.pop('_id', None)
    return result

@api_router.put("/admin/site-content/{section}")
async def update_site_section(section: str, updates: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    
    result = await db.site_content.find_one_and_update(
        {"client_id": client_id},
        {"$set": {section: updates, "updated_at": datetime.now(timezone.utc).isoformat()}},
        return_document=True,
        upsert=True
    )
    result.pop('_id', None)
    return result

# ============= Gallery Management APIs =============

@api_router.post("/admin/gallery")
async def add_gallery_image(image_data: dict, payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    image = GalleryImage(client_id=client_id, **image_data)
    await db.gallery.insert_one(image.model_dump())
    return image

@api_router.get("/admin/gallery")
async def get_gallery(payload: dict = Depends(verify_admin)):
    client_id = payload.get('client_id')
    images = await db.gallery.find({"client_id": client_id}, {"_id": 0}).sort("display_order", 1).to_list(1000)
    return images

@api_router.put("/admin/gallery/{image_id}")
async def update_gallery_image(image_id: str, updates: dict, payload: dict = Depends(verify_admin)):
    result = await db.gallery.find_one_and_update(
        {"image_id": image_id, "client_id": payload.get('client_id')},
        {"$set": updates},
        return_document=True
    )
    if not result:
        raise HTTPException(status_code=404, detail="Image not found")
    result.pop('_id', None)
    return result

@api_router.delete("/admin/gallery/{image_id}")
async def delete_gallery_image(image_id: str, payload: dict = Depends(verify_admin)):
    result = await db.gallery.delete_one({"image_id": image_id, "client_id": payload.get('client_id')})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"message": "Image deleted"}

# ============= Public APIs (for public website) =============

@api_router.get("/public/site/{client_id}")
async def get_public_site_data(client_id: str):
    # Get client info
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Site not found")
    
    # Get site content
    site_content = await db.site_content.find_one({"client_id": client_id}, {"_id": 0})
    
    # Get services (if module enabled)
    services = []
    if 'services' in client.get('enabled_modules', []):
        services = await db.services.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
    
    # Get gallery (if module enabled)
    gallery = []
    if 'gallery' in client.get('enabled_modules', []):
        gallery = await db.gallery.find({"client_id": client_id}, {"_id": 0}).sort("display_order", 1).to_list(100)
    
    # Get products (if module enabled)
    products = []
    product_categories = []
    if 'products' in client.get('enabled_modules', []):
        products = await db.products.find({"client_id": client_id, "is_active": True}, {"_id": 0}).sort("display_order", 1).to_list(1000)
        product_categories = await db.product_categories.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
    
    # Get offers (if module enabled)
    offers = []
    if 'offers' in client.get('enabled_modules', []):
        offers = await db.offers.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
    
    # Get packages for booking
    packages = []
    addons = []
    if 'booking' in client.get('enabled_modules', []):
        packages = await db.packages.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
        addons = await db.addons.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
    
    return {
        "client": client,
        "site_content": site_content,
        "services": services,
        "gallery": gallery,
        "products": products,
        "product_categories": product_categories,
        "offers": offers,
        "packages": packages,
        "addons": addons
    }

@api_router.get("/public/products/{client_id}")
async def get_public_products(client_id: str, category: Optional[str] = None, sort: Optional[str] = None, min_price: Optional[float] = None, max_price: Optional[float] = None):
    query = {"client_id": client_id, "is_active": True}
    
    if category:
        query["category"] = category
    
    if min_price is not None:
        query["final_price"] = {"$gte": min_price}
    if max_price is not None:
        if "final_price" in query:
            query["final_price"]["$lte"] = max_price
        else:
            query["final_price"] = {"$lte": max_price}
    
    sort_order = [("display_order", 1)]
    if sort == 'price_asc':
        sort_order = [("final_price", 1)]
    elif sort == 'price_desc':
        sort_order = [("final_price", -1)]
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_order).to_list(1000)
    categories = await db.product_categories.find({"client_id": client_id, "is_active": True}, {"_id": 0}).to_list(100)
    
    return {"products": products, "categories": categories}

@api_router.get("/public/products/{client_id}/{product_id}")
async def get_public_product_detail(client_id: str, product_id: str):
    product = await db.products.find_one(
        {"product_id": product_id, "client_id": client_id, "is_active": True}, 
        {"_id": 0}
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    client = await db.clients.find_one({"client_id": client_id}, {"_id": 0, "business_name": 1, "phone": 1, "email": 1})
    return {"product": product, "client": client}

# Domain-based client lookup
@api_router.get("/public/site-by-domain")
async def get_site_by_domain(domain: str):
    client = await db.clients.find_one({"domain": domain, "status": "active"}, {"_id": 0})
    if not client:
        raise HTTPException(status_code=404, detail="Site not found")
    
    return await get_public_site_data(client['client_id'])

# ============= Notification System =============

class NotificationType:
    INFO = 'info'
    SUCCESS = 'success'
    WARNING = 'warning'
    BOOKING = 'booking'
    LEAD = 'lead'
    PAYMENT = 'payment'
    SYSTEM = 'system'

class NotificationCreate(BaseModel):
    title: str
    message: str
    notification_type: str = 'info'
    link: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class Notification(BaseModel):
    notification_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_id: str
    user_id: Optional[str] = None
    title: str
    message: str
    notification_type: str = 'info'
    link: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    is_read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

# Get notifications for current user
@api_router.get("/admin/notifications")
async def get_notifications(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    limit: int = 20,
    unread_only: bool = False
):
    user = await verify_token(credentials)
    
    query = {"client_id": user.get('client_id')}
    if unread_only:
        query["is_read"] = False
    
    notifications = await db.notifications.find(query, {"_id": 0}).sort("created_at", -1).limit(limit).to_list(limit)
    unread_count = await db.notifications.count_documents({"client_id": user.get('client_id'), "is_read": False})
    
    return {"notifications": notifications, "unread_count": unread_count}

# Mark notification as read
@api_router.put("/admin/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = await verify_token(credentials)
    
    result = await db.notifications.update_one(
        {"notification_id": notification_id, "client_id": user.get('client_id')},
        {"$set": {"is_read": True}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification marked as read"}

# Mark all notifications as read
@api_router.put("/admin/notifications/mark-all-read")
async def mark_all_notifications_read(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = await verify_token(credentials)
    
    await db.notifications.update_many(
        {"client_id": user.get('client_id'), "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    return {"message": "All notifications marked as read"}

# Delete a notification
@api_router.delete("/admin/notifications/{notification_id}")
async def delete_notification(
    notification_id: str,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = await verify_token(credentials)
    
    result = await db.notifications.delete_one(
        {"notification_id": notification_id, "client_id": user.get('client_id')}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    return {"message": "Notification deleted"}

# Helper function to create notification (called internally)
async def create_notification(
    client_id: str,
    title: str,
    message: str,
    notification_type: str = 'info',
    link: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None
):
    notification = {
        "notification_id": str(uuid.uuid4()),
        "client_id": client_id,
        "title": title,
        "message": message,
        "notification_type": notification_type,
        "link": link,
        "metadata": metadata,
        "is_read": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.notifications.insert_one(notification)
    return notification

# Create notification (API endpoint for testing/manual creation)
@api_router.post("/admin/notifications")
async def create_notification_api(
    notification_data: NotificationCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    user = await verify_token(credentials)
    
    notification = await create_notification(
        client_id=user.get('client_id'),
        title=notification_data.title,
        message=notification_data.message,
        notification_type=notification_data.notification_type,
        link=notification_data.link,
        metadata=notification_data.metadata
    )
    
    # Remove _id before returning
    notification.pop('_id', None)
    return notification

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
