import requests
import sys
import time
from datetime import datetime

class FitLifeAPITester:
    def __init__(self, base_url="https://smartfit-ai-2.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_user_registration(self):
        """Test user registration with provided test data"""
        test_data = {
            "email": "teste@fitlife.com",
            "password": "senha123",
            "name": "Carlos Santos",
            "age": 28,
            "weight": 80.5,
            "height": 178,
            "goals": "Ganhar massa muscular e melhorar condicionamento físico para competições de natação"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            print(f"   ✅ Token received and stored")
            print(f"   ✅ User ID: {self.user_data.get('id', 'N/A')}")
            return True
        return False

    def test_user_login(self):
        """Test user login"""
        login_data = {
            "email": "teste@fitlife.com",
            "password": "senha123"
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            print(f"   ✅ Login successful, token updated")
            return True
        return False

    def test_user_profile(self):
        """Test getting user profile"""
        success, response = self.run_test(
            "Get User Profile",
            "GET",
            "user/profile",
            200
        )
        
        if success:
            print(f"   ✅ Profile data: {response.get('name', 'N/A')} - {response.get('email', 'N/A')}")
            print(f"   ✅ Trial status: {'Premium' if response.get('is_premium') else 'Trial'}")
            return True
        return False

    def test_workout_suggestion(self):
        """Test AI workout suggestion generation"""
        print(f"\n🤖 Testing AI Workout Suggestion (this may take 10-15 seconds)...")
        success, response = self.run_test(
            "Generate Workout Suggestion",
            "POST",
            "suggestions/workout",
            200
        )
        
        if success and 'suggestion' in response:
            suggestion_preview = response['suggestion'][:200] + "..." if len(response['suggestion']) > 200 else response['suggestion']
            print(f"   ✅ AI Suggestion generated (ID: {response.get('id', 'N/A')})")
            print(f"   ✅ Preview: {suggestion_preview}")
            return True
        return False

    def test_nutrition_suggestion(self):
        """Test AI nutrition suggestion generation"""
        print(f"\n🍎 Testing AI Nutrition Suggestion (this may take 10-15 seconds)...")
        success, response = self.run_test(
            "Generate Nutrition Suggestion",
            "POST",
            "suggestions/nutrition",
            200
        )
        
        if success and 'suggestion' in response:
            suggestion_preview = response['suggestion'][:200] + "..." if len(response['suggestion']) > 200 else response['suggestion']
            print(f"   ✅ AI Suggestion generated (ID: {response.get('id', 'N/A')})")
            print(f"   ✅ Preview: {suggestion_preview}")
            return True
        return False

    def test_workout_history(self):
        """Test workout history retrieval"""
        success, response = self.run_test(
            "Get Workout History",
            "GET",
            "history/workouts",
            200
        )
        
        if success:
            history_count = len(response) if isinstance(response, list) else 0
            print(f"   ✅ Workout history retrieved: {history_count} items")
            return True
        return False

    def test_nutrition_history(self):
        """Test nutrition history retrieval"""
        success, response = self.run_test(
            "Get Nutrition History",
            "GET",
            "history/nutrition",
            200
        )
        
        if success:
            history_count = len(response) if isinstance(response, list) else 0
            print(f"   ✅ Nutrition history retrieved: {history_count} items")
            return True, response
        return False, []

    def test_delete_workout_suggestion(self, suggestion_id):
        """Test deleting a workout suggestion"""
        success, response = self.run_test(
            f"Delete Workout Suggestion ({suggestion_id})",
            "DELETE",
            f"history/workouts/{suggestion_id}",
            200
        )
        
        if success:
            print(f"   ✅ Workout suggestion deleted successfully")
            return True
        return False

    def test_delete_nutrition_suggestion(self, suggestion_id):
        """Test deleting a nutrition suggestion"""
        success, response = self.run_test(
            f"Delete Nutrition Suggestion ({suggestion_id})",
            "DELETE", 
            f"history/nutrition/{suggestion_id}",
            200
        )
        
        if success:
            print(f"   ✅ Nutrition suggestion deleted successfully")
            return True
        return False

    def test_payment_checkout(self):
        """Test payment checkout session creation"""
        success, response = self.run_test(
            "Create Payment Checkout",
            "POST",
            "payments/checkout",
            200
        )
        
        if success and 'url' in response:
            print(f"   ✅ Checkout session created")
            print(f"   ✅ Stripe URL: {response['url'][:50]}...")
            return True, response.get('session_id')
        return False, None

def main():
    print("🚀 Starting FitLife AI Backend API Tests")
    print("=" * 60)
    
    tester = FitLifeAPITester()
    
    # Test sequence
    print("\n📝 PHASE 1: Authentication Tests")
    if not tester.test_user_registration():
        print("❌ Registration failed, trying login instead...")
        if not tester.test_user_login():
            print("❌ Both registration and login failed, stopping tests")
            return 1
    
    # Test profile access
    print("\n👤 PHASE 2: User Profile Test")
    if not tester.test_user_profile():
        print("❌ Profile access failed")
        return 1
    
    # Test AI suggestions (the core feature)
    print("\n🤖 PHASE 3: AI Integration Tests")
    workout_success = tester.test_workout_suggestion()
    time.sleep(2)  # Brief pause between AI calls
    nutrition_success = tester.test_nutrition_suggestion()
    
    if not workout_success and not nutrition_success:
        print("❌ Both AI suggestions failed - critical issue")
        return 1
    
    # Test history
    print("\n📚 PHASE 4: History Tests")
    tester.test_workout_history()
    tester.test_nutrition_history()
    
    # Test payment system
    print("\n💳 PHASE 5: Payment System Test")
    payment_success, session_id = tester.test_payment_checkout()
    
    # Final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend is working correctly.")
        return 0
    elif tester.tests_passed >= tester.tests_run * 0.8:
        print("⚠️  Most tests passed, minor issues detected.")
        return 0
    else:
        print("❌ Multiple test failures detected.")
        return 1

if __name__ == "__main__":
    sys.exit(main())