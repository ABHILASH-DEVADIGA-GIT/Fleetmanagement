"""
Backend API Tests for FrameBook Pro Phase 1, 2, and 3 Features
Tests: Super Admin Client/Module Management, Product Catalog, Gallery Management, Site Content Editor
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
SUPER_ADMIN_EMAIL = "admin@lumina.com"
SUPER_ADMIN_PASSWORD = "admin123"
ADMIN_EMAIL = "photographer@demo.com"
ADMIN_PASSWORD = "photographer123"
TEST_CLIENT_ID = "f0afd9ff-fb85-45e6-9f9e-8027f5fcfbca"


@pytest.fixture(scope="session")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session


@pytest.fixture(scope="session")
def super_admin_token(api_client):
    """Get super admin authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": SUPER_ADMIN_EMAIL,
        "password": SUPER_ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip(f"Super Admin Authentication failed - {response.text}")


@pytest.fixture(scope="session")
def admin_token(api_client):
    """Get admin authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip(f"Admin Authentication failed - {response.text}")


@pytest.fixture(scope="session")
def super_admin_client(api_client, super_admin_token):
    """Session with super admin auth header"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {super_admin_token}"
    })
    return session


@pytest.fixture(scope="session")
def admin_client(api_client, admin_token):
    """Session with admin auth header"""
    session = requests.Session()
    session.headers.update({
        "Content-Type": "application/json",
        "Authorization": f"Bearer {admin_token}"
    })
    return session


# ============= Phase 1: Super Admin Client & Module Management =============

class TestSuperAdminLogin:
    """Super Admin authentication tests"""
    
    def test_super_admin_login_success(self, api_client):
        """Test super admin login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": SUPER_ADMIN_EMAIL,
            "password": SUPER_ADMIN_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert data["user"]["role"] == "super_admin"
        print(f"PASS: Super Admin login successful")


class TestClientManagement:
    """Super Admin client management tests"""
    
    def test_get_all_clients(self, super_admin_client):
        """Test fetching all clients"""
        response = super_admin_client.get(f"{BASE_URL}/api/super-admin/clients")
        assert response.status_code == 200
        clients = response.json()
        assert isinstance(clients, list)
        print(f"PASS: Fetched {len(clients)} clients")
    
    def test_get_single_client(self, super_admin_client):
        """Test fetching single client details"""
        response = super_admin_client.get(f"{BASE_URL}/api/super-admin/clients/{TEST_CLIENT_ID}")
        assert response.status_code == 200
        client = response.json()
        assert client["client_id"] == TEST_CLIENT_ID
        assert "enabled_modules" in client
        print(f"PASS: Fetched client: {client['business_name']}")
        print(f"  - Enabled modules: {client.get('enabled_modules', [])}")
    
    def test_create_client_with_modules(self, super_admin_client):
        """Test creating a new client with module selection"""
        client_data = {
            "business_name": "TEST_New Photography Studio",
            "email": "test.newstudio@example.com",
            "phone": "9998887776",
            "domain": "testnewstudio.com",
            "subscription_plan": "premium",
            "enabled_languages": ["en", "hi"],
            "theme": "light",
            "enabled_modules": ["about", "services", "gallery", "products", "contact"],
            "primary_color": "#ff5722",
            "admin_password": "test123"
        }
        response = super_admin_client.post(f"{BASE_URL}/api/super-admin/clients", json=client_data)
        assert response.status_code == 200
        data = response.json()
        assert data["business_name"] == client_data["business_name"]
        assert data["enabled_modules"] == client_data["enabled_modules"]
        assert "products" in data["enabled_modules"]
        print(f"PASS: Created client with ID: {data['client_id']}")
        print(f"  - Modules: {data['enabled_modules']}")
        return data["client_id"]
    
    def test_update_client_modules(self, super_admin_client):
        """Test updating client to enable/disable modules"""
        # First get current client
        response = super_admin_client.get(f"{BASE_URL}/api/super-admin/clients/{TEST_CLIENT_ID}")
        current_client = response.json()
        current_modules = current_client.get("enabled_modules", [])
        
        # Add 'products' if not present, or remove it if present
        if "products" in current_modules:
            new_modules = [m for m in current_modules if m != "products"]
            action = "disabled"
        else:
            new_modules = current_modules + ["products"]
            action = "enabled"
        
        response = super_admin_client.put(f"{BASE_URL}/api/super-admin/clients/{TEST_CLIENT_ID}", json={
            "enabled_modules": new_modules
        })
        assert response.status_code == 200
        data = response.json()
        assert data["enabled_modules"] == new_modules
        print(f"PASS: {action.capitalize()} 'products' module for client")
        
        # Restore original state
        super_admin_client.put(f"{BASE_URL}/api/super-admin/clients/{TEST_CLIENT_ID}", json={
            "enabled_modules": current_modules
        })
        print(f"  - Restored original modules: {current_modules}")


# ============= Phase 2: Product Catalog Management =============

class TestProductManagement:
    """Admin product management tests"""
    
    def test_get_products_list(self, admin_client):
        """Test fetching all products"""
        response = admin_client.get(f"{BASE_URL}/api/admin/products")
        assert response.status_code == 200
        products = response.json()
        assert isinstance(products, list)
        print(f"PASS: Fetched {len(products)} products")
    
    def test_create_product(self, admin_client):
        """Test creating a new product with multi-language support"""
        product_data = {
            "name": {
                "en": "TEST_Premium Photo Album",
                "kn": "ಟೆಸ್ಟ್ ಪ್ರೀಮಿಯಂ ಫೋಟೋ ಆಲ್ಬಮ್",
                "hi": "टेस्ट प्रीमियम फोटो एल्बम"
            },
            "description": {
                "en": "High quality photo album with premium binding",
                "kn": "ಉತ್ತಮ ಗುಣಮಟ್ಟದ ಫೋಟೋ ಆಲ್ಬಮ್",
                "hi": "उच्च गुणवत्ता वाला फोटो एल्बम"
            },
            "images": ["https://example.com/album1.jpg"],
            "base_price": 5000,
            "discount_percentage": 10,
            "category": "",
            "is_active": True
        }
        response = admin_client.post(f"{BASE_URL}/api/admin/products", json=product_data)
        assert response.status_code == 200
        data = response.json()
        assert "product_id" in data
        assert data["name"]["en"] == product_data["name"]["en"]
        assert data["base_price"] == 5000
        assert data["final_price"] == 4500  # 5000 - 10%
        print(f"PASS: Created product with ID: {data['product_id']}")
        print(f"  - Base price: ₹{data['base_price']}, Final price: ₹{data['final_price']}")
        return data["product_id"]
    
    def test_update_product(self, admin_client):
        """Test updating a product"""
        # First create a product
        create_response = admin_client.post(f"{BASE_URL}/api/admin/products", json={
            "name": {"en": "TEST_Update Product"},
            "description": {"en": "Product to update"},
            "base_price": 1000,
            "discount_percentage": 0
        })
        if create_response.status_code != 200:
            pytest.skip("Could not create product to update")
        
        product_id = create_response.json()["product_id"]
        
        # Update the product
        response = admin_client.put(f"{BASE_URL}/api/admin/products/{product_id}", json={
            "base_price": 1500,
            "discount_percentage": 15,
            "is_active": True
        })
        assert response.status_code == 200
        data = response.json()
        assert data["base_price"] == 1500
        assert data["final_price"] == 1275  # 1500 - 15%
        print(f"PASS: Updated product - New price: ₹{data['base_price']}, Discount: {data['discount_percentage']}%")
    
    def test_delete_product(self, admin_client):
        """Test deleting a product"""
        # Create a product first
        create_response = admin_client.post(f"{BASE_URL}/api/admin/products", json={
            "name": {"en": "TEST_Delete Product"},
            "description": {"en": "Product to delete"},
            "base_price": 500
        })
        if create_response.status_code != 200:
            pytest.skip("Could not create product to delete")
        
        product_id = create_response.json()["product_id"]
        
        # Delete it
        response = admin_client.delete(f"{BASE_URL}/api/admin/products/{product_id}")
        assert response.status_code == 200
        print(f"PASS: Deleted product successfully")


class TestProductCategories:
    """Product category management tests"""
    
    def test_get_product_categories(self, admin_client):
        """Test fetching product categories"""
        response = admin_client.get(f"{BASE_URL}/api/admin/product-categories")
        assert response.status_code == 200
        categories = response.json()
        assert isinstance(categories, list)
        print(f"PASS: Fetched {len(categories)} product categories")
    
    def test_create_product_category(self, admin_client):
        """Test creating a product category"""
        category_data = {
            "name": {
                "en": "TEST_Photo Albums",
                "kn": "ಫೋಟೋ ಆಲ್ಬಮ್‌ಗಳು",
                "hi": "फोटो एल्बम"
            }
        }
        response = admin_client.post(f"{BASE_URL}/api/admin/product-categories", json=category_data)
        assert response.status_code == 200
        data = response.json()
        assert "category_id" in data
        print(f"PASS: Created product category: {data['name']['en']}")
        return data["category_id"]
    
    def test_delete_product_category(self, admin_client):
        """Test deleting a product category"""
        # Create a category first
        create_response = admin_client.post(f"{BASE_URL}/api/admin/product-categories", json={
            "name": {"en": "TEST_Delete Category"}
        })
        if create_response.status_code != 200:
            pytest.skip("Could not create category to delete")
        
        category_id = create_response.json()["category_id"]
        
        # Delete it
        response = admin_client.delete(f"{BASE_URL}/api/admin/product-categories/{category_id}")
        assert response.status_code == 200
        print(f"PASS: Deleted product category successfully")


# ============= Phase 2: Gallery Management =============

class TestGalleryManagement:
    """Admin gallery management tests"""
    
    def test_get_gallery_list(self, admin_client):
        """Test fetching gallery images"""
        response = admin_client.get(f"{BASE_URL}/api/admin/gallery")
        assert response.status_code == 200
        images = response.json()
        assert isinstance(images, list)
        print(f"PASS: Fetched {len(images)} gallery images")
    
    def test_add_gallery_image(self, admin_client):
        """Test adding an image to gallery"""
        image_data = {
            "image_url": "https://images.unsplash.com/photo-1519741497674-611481863552",
            "title": "TEST_Wedding Photo",
            "description": "Beautiful wedding photo",
            "category": "Wedding",
            "is_featured": True
        }
        response = admin_client.post(f"{BASE_URL}/api/admin/gallery", json=image_data)
        assert response.status_code == 200
        data = response.json()
        assert "image_id" in data
        assert data["title"] == image_data["title"]
        assert data["is_featured"] == True
        print(f"PASS: Added gallery image with ID: {data['image_id']}")
        return data["image_id"]
    
    def test_update_gallery_image(self, admin_client):
        """Test updating a gallery image"""
        # Create an image first
        create_response = admin_client.post(f"{BASE_URL}/api/admin/gallery", json={
            "image_url": "https://example.com/test-update.jpg",
            "title": "TEST_Update Image",
            "is_featured": False
        })
        if create_response.status_code != 200:
            pytest.skip("Could not create image to update")
        
        image_id = create_response.json()["image_id"]
        
        # Update it
        response = admin_client.put(f"{BASE_URL}/api/admin/gallery/{image_id}", json={
            "title": "TEST_Updated Image Title",
            "is_featured": True,
            "category": "Portrait"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["title"] == "TEST_Updated Image Title"
        assert data["is_featured"] == True
        print(f"PASS: Updated gallery image - Title: {data['title']}, Featured: {data['is_featured']}")
    
    def test_delete_gallery_image(self, admin_client):
        """Test deleting a gallery image"""
        # Create an image first
        create_response = admin_client.post(f"{BASE_URL}/api/admin/gallery", json={
            "image_url": "https://example.com/test-delete.jpg",
            "title": "TEST_Delete Image"
        })
        if create_response.status_code != 200:
            pytest.skip("Could not create image to delete")
        
        image_id = create_response.json()["image_id"]
        
        # Delete it
        response = admin_client.delete(f"{BASE_URL}/api/admin/gallery/{image_id}")
        assert response.status_code == 200
        print(f"PASS: Deleted gallery image successfully")


# ============= Phase 3: Site Content Editor =============

class TestSiteContentEditor:
    """Admin site content editor tests"""
    
    def test_get_site_content(self, admin_client):
        """Test fetching site content"""
        response = admin_client.get(f"{BASE_URL}/api/admin/site-content")
        assert response.status_code == 200
        content = response.json()
        assert "hero" in content or "content_id" in content
        print(f"PASS: Fetched site content")
    
    def test_update_hero_section(self, admin_client):
        """Test updating hero section"""
        update_data = {
            "headline": {
                "en": "Welcome to Our Studio",
                "kn": "ನಮ್ಮ ಸ್ಟುಡಿಯೋಗೆ ಸ್ವಾಗತ",
                "hi": "हमारे स्टूडियो में आपका स्वागत है"
            },
            "sub_headline": {
                "en": "Professional Photography Services",
                "kn": "ವೃತ್ತಿಪರ ಛಾಯಾಗ್ರಹಣ ಸೇವೆಗಳು",
                "hi": "पेशेवर फोटोग्राफी सेवाएं"
            }
        }
        response = admin_client.put(f"{BASE_URL}/api/admin/site-content/hero", json=update_data)
        assert response.status_code == 200
        print(f"PASS: Updated hero section")
    
    def test_update_about_section(self, admin_client):
        """Test updating about section"""
        update_data = {
            "title": {
                "en": "About Our Studio",
                "kn": "ನಮ್ಮ ಸ್ಟುಡಿಯೋ ಬಗ್ಗೆ",
                "hi": "हमारे स्टूडियो के बारे में"
            },
            "description": {
                "en": "We are passionate photographers with 10+ years of experience.",
                "kn": "ನಾವು 10+ ವರ್ಷಗಳ ಅನುಭವ ಹೊಂದಿರುವ ಉತ್ಸಾಹೀ ಛಾಯಾಗ್ರಾಹಕರು.",
                "hi": "हम 10+ वर्षों के अनुभव वाले जुनूनी फोटोग्राफर हैं।"
            }
        }
        response = admin_client.put(f"{BASE_URL}/api/admin/site-content/about", json=update_data)
        assert response.status_code == 200
        print(f"PASS: Updated about section")
    
    def test_update_contact_section(self, admin_client):
        """Test updating contact section"""
        update_data = {
            "title": {
                "en": "Contact Us",
                "kn": "ನಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸಿ",
                "hi": "संपर्क करें"
            },
            "address": {
                "en": "123 Photography Lane, Bengaluru",
                "kn": "123 ಫೋಟೋಗ್ರಫಿ ಲೇನ್, ಬೆಂಗಳೂರು",
                "hi": "123 फोटोग्राफी लेन, बेंगलुरु"
            }
        }
        response = admin_client.put(f"{BASE_URL}/api/admin/site-content/contact", json=update_data)
        assert response.status_code == 200
        print(f"PASS: Updated contact section")
    
    def test_update_footer_section(self, admin_client):
        """Test updating footer section"""
        update_data = {
            "copyright_text": {
                "en": "© 2026 Demo Photography. All rights reserved.",
                "kn": "© 2026 ಡೆಮೊ ಫೋಟೋಗ್ರಫಿ. ಎಲ್ಲಾ ಹಕ್ಕುಗಳು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.",
                "hi": "© 2026 डेमो फोटोग्राफी। सर्वाधिकार सुरक्षित।"
            },
            "social_links": {
                "facebook": "https://facebook.com/demophoto",
                "instagram": "https://instagram.com/demophoto"
            }
        }
        response = admin_client.put(f"{BASE_URL}/api/admin/site-content/footer", json=update_data)
        assert response.status_code == 200
        print(f"PASS: Updated footer section")


# ============= Public Website Tests =============

class TestPublicWebsite:
    """Public website API tests"""
    
    def test_get_public_client(self, api_client):
        """Test fetching public client info"""
        response = api_client.get(f"{BASE_URL}/api/public/clients/{TEST_CLIENT_ID}")
        assert response.status_code == 200
        client = response.json()
        assert "enabled_modules" in client
        print(f"PASS: Fetched public client - Enabled modules: {client['enabled_modules']}")
    
    def test_get_public_site_data(self, api_client):
        """Test fetching all public site data"""
        response = api_client.get(f"{BASE_URL}/api/public/site/{TEST_CLIENT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert "client" in data
        assert "site_content" in data
        print(f"PASS: Fetched public site data")
        print(f"  - Has gallery: {'gallery' in data}")
        print(f"  - Has products: {'products' in data}")
    
    def test_get_public_products(self, api_client):
        """Test fetching public products"""
        response = api_client.get(f"{BASE_URL}/api/public/products/{TEST_CLIENT_ID}")
        assert response.status_code == 200
        data = response.json()
        assert "products" in data
        assert "categories" in data
        print(f"PASS: Fetched {len(data['products'])} public products")
    
    def test_get_public_products_sorted(self, api_client):
        """Test fetching public products with price sorting"""
        response = api_client.get(f"{BASE_URL}/api/public/products/{TEST_CLIENT_ID}?sort=price_asc")
        assert response.status_code == 200
        data = response.json()
        products = data["products"]
        if len(products) > 1:
            for i in range(len(products) - 1):
                assert products[i]["final_price"] <= products[i+1]["final_price"]
            print(f"PASS: Products sorted by price ascending")
        else:
            print(f"PASS: Product sorting (not enough products to verify order)")
    
    def test_get_public_gallery(self, api_client):
        """Test fetching public gallery"""
        response = api_client.get(f"{BASE_URL}/api/public/gallery/{TEST_CLIENT_ID}")
        assert response.status_code == 200
        images = response.json()
        assert isinstance(images, list)
        print(f"PASS: Fetched {len(images)} public gallery images")


# ============= Cleanup =============

class TestCleanup:
    """Cleanup TEST_ prefixed data"""
    
    def test_cleanup_test_products(self, admin_client):
        """Delete test products"""
        response = admin_client.get(f"{BASE_URL}/api/admin/products")
        products = response.json()
        deleted = 0
        for product in products:
            name = product.get("name", {}).get("en", "")
            if name.startswith("TEST_"):
                admin_client.delete(f"{BASE_URL}/api/admin/products/{product['product_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test products")
    
    def test_cleanup_test_categories(self, admin_client):
        """Delete test product categories"""
        response = admin_client.get(f"{BASE_URL}/api/admin/product-categories")
        categories = response.json()
        deleted = 0
        for cat in categories:
            name = cat.get("name", {}).get("en", "")
            if name.startswith("TEST_"):
                admin_client.delete(f"{BASE_URL}/api/admin/product-categories/{cat['category_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test categories")
    
    def test_cleanup_test_gallery_images(self, admin_client):
        """Delete test gallery images"""
        response = admin_client.get(f"{BASE_URL}/api/admin/gallery")
        images = response.json()
        deleted = 0
        for image in images:
            title = image.get("title", "")
            if title and title.startswith("TEST_"):
                admin_client.delete(f"{BASE_URL}/api/admin/gallery/{image['image_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test gallery images")
    
    def test_cleanup_test_clients(self, super_admin_client):
        """Delete test clients created by super admin"""
        response = super_admin_client.get(f"{BASE_URL}/api/super-admin/clients")
        clients = response.json()
        deleted = 0
        for client in clients:
            if client["business_name"].startswith("TEST_"):
                super_admin_client.delete(f"{BASE_URL}/api/super-admin/clients/{client['client_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test clients")
