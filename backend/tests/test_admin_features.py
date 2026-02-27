"""
Backend API Tests for FrameBook Pro Admin Features
Tests: Quotations, Invoices, Calendar/Walk-ins, Leads, Expenses, Reports
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
TEST_EMAIL = "photographer@demo.com"
TEST_PASSWORD = "photographer123"
TEST_CLIENT_ID = "f0afd9ff-fb85-45e6-9f9e-8027f5fcfbca"

@pytest.fixture(scope="session")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture(scope="session")
def auth_token(api_client):
    """Get authentication token"""
    response = api_client.post(f"{BASE_URL}/api/auth/login", json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    if response.status_code == 200:
        return response.json().get("token")
    pytest.skip(f"Authentication failed - {response.text}")

@pytest.fixture(scope="session")
def authenticated_client(api_client, auth_token):
    """Session with auth header"""
    api_client.headers.update({"Authorization": f"Bearer {auth_token}"})
    return api_client


class TestAuthentication:
    """Admin authentication tests"""
    
    def test_login_success(self, api_client):
        """Test admin login with valid credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": TEST_EMAIL,
            "password": TEST_PASSWORD
        })
        assert response.status_code == 200
        data = response.json()
        assert "token" in data
        assert "user" in data
        assert data["user"]["email"] == TEST_EMAIL
        print(f"PASS: Login successful for {TEST_EMAIL}")
    
    def test_login_invalid_credentials(self, api_client):
        """Test login with wrong credentials"""
        response = api_client.post(f"{BASE_URL}/api/auth/login", json={
            "email": "wrong@example.com",
            "password": "wrongpassword"
        })
        assert response.status_code == 401
        print("PASS: Invalid login rejected correctly")


class TestLeadManagement:
    """Lead CRUD and status management tests"""
    
    def test_get_leads_list(self, authenticated_client):
        """Test fetching all leads"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/leads")
        assert response.status_code == 200
        leads = response.json()
        assert isinstance(leads, list)
        print(f"PASS: Fetched {len(leads)} leads")
    
    def test_create_lead(self, authenticated_client):
        """Test creating a new lead"""
        lead_data = {
            "name": "TEST_Lead_User",
            "phone": "9876543210",
            "email": "testlead@example.com",
            "event_type": "Wedding",
            "source": "manual",
            "notes": "Test lead for API testing"
        }
        response = authenticated_client.post(f"{BASE_URL}/api/admin/leads", json=lead_data)
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == lead_data["name"]
        assert "lead_id" in data
        print(f"PASS: Created lead with ID {data['lead_id']}")
        return data["lead_id"]
    
    def test_update_lead_status(self, authenticated_client):
        """Test updating lead status"""
        # First get leads
        response = authenticated_client.get(f"{BASE_URL}/api/admin/leads")
        leads = response.json()
        if not leads:
            pytest.skip("No leads to update")
        
        lead_id = leads[0]["lead_id"]
        original_status = leads[0]["status"]
        
        # Update status to 'contacted'
        new_status = "contacted" if original_status != "contacted" else "follow_up"
        response = authenticated_client.put(f"{BASE_URL}/api/admin/leads/{lead_id}", json={
            "status": new_status
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == new_status
        print(f"PASS: Updated lead status from {original_status} to {new_status}")
    
    def test_add_lead_note(self, authenticated_client):
        """Test adding a note to a lead"""
        # Get first lead
        response = authenticated_client.get(f"{BASE_URL}/api/admin/leads")
        leads = response.json()
        if not leads:
            pytest.skip("No leads available")
        
        lead_id = leads[0]["lead_id"]
        response = authenticated_client.post(f"{BASE_URL}/api/admin/leads/{lead_id}/notes", json={
            "note": "Test note from API testing"
        })
        assert response.status_code == 200
        print(f"PASS: Added note to lead {lead_id}")


class TestPackagesAndAddons:
    """Package and Add-on management tests"""
    
    def test_get_packages(self, authenticated_client):
        """Test fetching packages"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/packages")
        assert response.status_code == 200
        packages = response.json()
        assert isinstance(packages, list)
        print(f"PASS: Fetched {len(packages)} packages")
    
    def test_get_addons(self, authenticated_client):
        """Test fetching add-ons"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/addons")
        assert response.status_code == 200
        addons = response.json()
        assert isinstance(addons, list)
        print(f"PASS: Fetched {len(addons)} add-ons")


class TestQuotationManagement:
    """Quotation CRUD and PDF tests"""
    
    def test_get_quotations_list(self, authenticated_client):
        """Test fetching all quotations"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/quotations")
        assert response.status_code == 200
        quotations = response.json()
        assert isinstance(quotations, list)
        print(f"PASS: Fetched {len(quotations)} quotations")
    
    def test_create_quotation(self, authenticated_client):
        """Test creating a new quotation"""
        # Get a lead first
        leads_response = authenticated_client.get(f"{BASE_URL}/api/admin/leads")
        leads = leads_response.json()
        if not leads:
            pytest.skip("No leads available for quotation")
        
        lead_id = leads[0]["lead_id"]
        
        quotation_data = {
            "lead_id": lead_id,
            "items": [
                {
                    "item_type": "custom",
                    "item_id": None,
                    "name": "Test Photography Service",
                    "price": 15000,
                    "quantity": 1
                }
            ],
            "discount_percentage": 5,
            "discount_amount": 0,
            "tax_percentage": 18,
            "notes": "Test quotation from API"
        }
        
        response = authenticated_client.post(f"{BASE_URL}/api/admin/quotations", json=quotation_data)
        assert response.status_code == 200
        data = response.json()
        assert "quotation_id" in data
        assert "quotation_number" in data
        assert data["total_amount"] > 0
        print(f"PASS: Created quotation {data['quotation_number']} with total ₹{data['total_amount']}")
        return data["quotation_id"]
    
    def test_update_quotation_status(self, authenticated_client):
        """Test updating quotation status"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/quotations")
        quotations = response.json()
        if not quotations:
            pytest.skip("No quotations available")
        
        quotation_id = quotations[0]["quotation_id"]
        
        response = authenticated_client.put(f"{BASE_URL}/api/admin/quotations/{quotation_id}/status", json={
            "status": "sent"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "sent"
        print(f"PASS: Updated quotation status to 'sent'")
    
    def test_get_quotation_pdf_data(self, authenticated_client):
        """Test fetching quotation PDF data"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/quotations")
        quotations = response.json()
        if not quotations:
            pytest.skip("No quotations available")
        
        quotation_id = quotations[0]["quotation_id"]
        response = authenticated_client.get(f"{BASE_URL}/api/admin/quotations/{quotation_id}/pdf-data")
        assert response.status_code == 200
        data = response.json()
        assert "quotation" in data
        assert "client" in data
        assert "customer" in data
        print("PASS: Fetched quotation PDF data successfully")


class TestInvoiceManagement:
    """Invoice CRUD and payment tests"""
    
    def test_get_invoices_list(self, authenticated_client):
        """Test fetching all invoices"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/invoices")
        assert response.status_code == 200
        invoices = response.json()
        assert isinstance(invoices, list)
        print(f"PASS: Fetched {len(invoices)} invoices")
    
    def test_create_direct_invoice(self, authenticated_client):
        """Test creating a direct invoice (without quotation)"""
        invoice_data = {
            "customer_name": "TEST_Invoice_Customer",
            "customer_phone": "9876543211",
            "customer_email": "testinvoice@example.com",
            "items": [
                {
                    "item_type": "custom",
                    "item_id": None,
                    "name": "Portrait Photography",
                    "price": 8000,
                    "quantity": 1
                }
            ],
            "discount_percentage": 0,
            "tax_percentage": 18,
            "notes": "Test direct invoice",
            "event_date": "2026-03-15"
        }
        
        response = authenticated_client.post(f"{BASE_URL}/api/admin/invoices", json=invoice_data)
        assert response.status_code == 200
        data = response.json()
        assert "invoice_id" in data
        assert "invoice_number" in data
        assert data["status"] == "unpaid"
        assert data["balance_due"] == data["total_amount"]
        print(f"PASS: Created invoice {data['invoice_number']} with total ₹{data['total_amount']}")
        return data["invoice_id"]
    
    def test_add_payment_to_invoice(self, authenticated_client):
        """Test adding a payment to an invoice"""
        # Get an unpaid invoice
        response = authenticated_client.get(f"{BASE_URL}/api/admin/invoices")
        invoices = response.json()
        unpaid = [inv for inv in invoices if inv["balance_due"] > 0]
        
        if not unpaid:
            pytest.skip("No unpaid invoices available")
        
        invoice = unpaid[0]
        invoice_id = invoice["invoice_id"]
        payment_amount = min(invoice["balance_due"], 5000)  # Partial payment
        
        response = authenticated_client.post(f"{BASE_URL}/api/admin/invoices/{invoice_id}/payments", json={
            "amount": payment_amount,
            "payment_method": "upi",
            "payment_date": "2026-02-27",
            "notes": "Test payment"
        })
        assert response.status_code == 200
        data = response.json()
        assert data["paid_amount"] >= payment_amount
        print(f"PASS: Added payment of ₹{payment_amount} to invoice")
    
    def test_get_invoice_pdf_data(self, authenticated_client):
        """Test fetching invoice PDF data"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/invoices")
        invoices = response.json()
        if not invoices:
            pytest.skip("No invoices available")
        
        invoice_id = invoices[0]["invoice_id"]
        response = authenticated_client.get(f"{BASE_URL}/api/admin/invoices/{invoice_id}/pdf-data")
        assert response.status_code == 200
        data = response.json()
        assert "invoice" in data
        assert "client" in data
        assert "customer" in data
        print("PASS: Fetched invoice PDF data successfully")


class TestCalendarAndWalkins:
    """Calendar and Walk-in appointment tests"""
    
    def test_get_calendar_data(self, authenticated_client):
        """Test fetching calendar data for current month"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/calendar?month=2026-02")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, dict)
        print(f"PASS: Fetched calendar data with {len(data)} dates having events")
    
    def test_get_walkin_appointments(self, authenticated_client):
        """Test fetching walk-in appointments"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/walkin-appointments")
        assert response.status_code == 200
        walkins = response.json()
        assert isinstance(walkins, list)
        print(f"PASS: Fetched {len(walkins)} walk-in appointments")
    
    def test_create_walkin_appointment(self, authenticated_client):
        """Test creating a walk-in/blocked time"""
        walkin_data = {
            "title": "TEST_Personal Work",
            "start_date": "2026-03-10",
            "end_date": "2026-03-10",
            "start_time": "10:00",
            "end_time": "14:00",
            "notes": "Test blocked time from API"
        }
        
        response = authenticated_client.post(f"{BASE_URL}/api/admin/walkin-appointments", json=walkin_data)
        assert response.status_code == 200
        data = response.json()
        assert "walkin_id" in data
        assert data["title"] == walkin_data["title"]
        print(f"PASS: Created walk-in appointment: {data['title']}")
        return data["walkin_id"]
    
    def test_delete_walkin_appointment(self, authenticated_client):
        """Test deleting a walk-in appointment"""
        # Create one first
        response = authenticated_client.post(f"{BASE_URL}/api/admin/walkin-appointments", json={
            "title": "TEST_Delete_Me",
            "start_date": "2026-03-20",
            "end_date": "2026-03-20"
        })
        if response.status_code != 200:
            pytest.skip("Could not create walk-in to delete")
        
        walkin_id = response.json()["walkin_id"]
        
        # Delete it
        response = authenticated_client.delete(f"{BASE_URL}/api/admin/walkin-appointments/{walkin_id}")
        assert response.status_code == 200
        print("PASS: Deleted walk-in appointment successfully")


class TestExpenseManagement:
    """Expense tracking tests"""
    
    def test_get_expenses_list(self, authenticated_client):
        """Test fetching all expenses"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/expenses")
        assert response.status_code == 200
        expenses = response.json()
        assert isinstance(expenses, list)
        print(f"PASS: Fetched {len(expenses)} expenses")
    
    def test_create_expense(self, authenticated_client):
        """Test creating an expense"""
        # First create an event if needed
        events_response = authenticated_client.get(f"{BASE_URL}/api/admin/events")
        events = events_response.json()
        
        if not events:
            # Create an event first
            event_response = authenticated_client.post(f"{BASE_URL}/api/admin/events", json={
                "name": "TEST_Event",
                "event_type": "wedding",
                "event_date": "2026-03-01",
                "status": "confirmed"
            })
            if event_response.status_code == 200:
                event_id = event_response.json()["event_id"]
            else:
                pytest.skip("Could not create event for expense")
        else:
            event_id = events[0]["event_id"]
        
        expense_data = {
            "event_id": event_id,
            "category": "travel",
            "amount": 2500,
            "description": "Test travel expense",
            "expense_date": "2026-02-27"
        }
        
        response = authenticated_client.post(f"{BASE_URL}/api/admin/expenses", json=expense_data)
        assert response.status_code == 200
        data = response.json()
        assert "expense_id" in data
        assert data["amount"] == 2500
        print(f"PASS: Created expense of ₹{data['amount']}")


class TestReports:
    """Business reports tests"""
    
    def test_get_revenue_report(self, authenticated_client):
        """Test fetching revenue report"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/reports/revenue?period=monthly&year=2026")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Fetched revenue report with {len(data)} months")
    
    def test_get_pending_payments_report(self, authenticated_client):
        """Test fetching pending payments report"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/reports/pending-payments")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        total_pending = sum(inv["balance_due"] for inv in data)
        print(f"PASS: Fetched pending payments report - Total pending: ₹{total_pending}")
    
    def test_get_lead_conversion_report(self, authenticated_client):
        """Test fetching lead conversion report"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/reports/lead-conversion")
        assert response.status_code == 200
        data = response.json()
        assert "total_leads" in data
        assert "confirmed_leads" in data
        assert "conversion_rate" in data
        print(f"PASS: Lead conversion: {data['conversion_rate']}% ({data['confirmed_leads']}/{data['total_leads']})")
    
    def test_get_event_profit_report(self, authenticated_client):
        """Test fetching event profit report"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/reports/event-profit")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"PASS: Fetched event profit report with {len(data)} events")


class TestDashboard:
    """Dashboard stats test"""
    
    def test_get_dashboard_stats(self, authenticated_client):
        """Test fetching dashboard statistics"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/dashboard/stats")
        assert response.status_code == 200
        data = response.json()
        assert "total_revenue_month" in data
        assert "events_this_month" in data
        assert "pending_payments" in data
        assert "new_leads_count" in data
        print(f"PASS: Dashboard stats - Revenue: ₹{data['total_revenue_month']}, New Leads: {data['new_leads_count']}")


# Cleanup test data
class TestCleanup:
    """Cleanup TEST_ prefixed data"""
    
    def test_cleanup_test_leads(self, authenticated_client):
        """Delete test leads"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/leads")
        leads = response.json()
        deleted = 0
        for lead in leads:
            if lead["name"].startswith("TEST_"):
                authenticated_client.delete(f"{BASE_URL}/api/admin/leads/{lead['lead_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test leads")
    
    def test_cleanup_test_walkins(self, authenticated_client):
        """Delete test walk-ins"""
        response = authenticated_client.get(f"{BASE_URL}/api/admin/walkin-appointments")
        walkins = response.json()
        deleted = 0
        for walkin in walkins:
            if walkin["title"].startswith("TEST_"):
                authenticated_client.delete(f"{BASE_URL}/api/admin/walkin-appointments/{walkin['walkin_id']}")
                deleted += 1
        print(f"CLEANUP: Deleted {deleted} test walk-ins")
