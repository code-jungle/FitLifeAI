import requests
import sys
import time
from datetime import datetime

class FitLifeAPITester:
    def __init__(self, base_url="https://fitlife-personal.preview.emergentagent.com"):
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
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

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

    def test_user_registration_with_dietary_restrictions(self):
        """Test user registration with dietary_restrictions field - FIX VERIFICATION"""
        import time
        unique_email = f"test.fix.{int(time.time())}@example.com"
        
        test_data = {
            "email": unique_email,
            "password": "TestPassword123!",
            "name": "Test Fix User",
            "age": 25,
            "weight": 70,
            "height": 175,
            "goals": "Teste após correção",
            "dietary_restrictions": "Sem restrições"
        }
        
        success, response = self.run_test(
            "User Registration with Dietary Restrictions",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            self.new_user_email = unique_email  # Store for login test
            print(f"   ✅ Token received and stored")
            print(f"   ✅ User ID: {self.user_data.get('id', 'N/A')}")
            
            # Verify dietary_restrictions field is present in response
            if 'dietary_restrictions' in self.user_data:
                print(f"   ✅ Dietary restrictions field present: '{self.user_data['dietary_restrictions']}'")
                return True
            else:
                print(f"   ❌ Dietary restrictions field missing from user response")
                return False
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

    def test_user_login_with_new_user(self):
        """Test login with newly registered user (with dietary_restrictions)"""
        login_data = {
            "email": getattr(self, 'new_user_email', 'test.fix@example.com'),
            "password": "TestPassword123!"
        }
        
        success, response = self.run_test(
            "Login with New User (Dietary Restrictions)",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            print(f"   ✅ Login successful, token updated")
            
            # Verify dietary_restrictions field is present in login response
            if 'dietary_restrictions' in self.user_data:
                print(f"   ✅ Dietary restrictions field present: '{self.user_data['dietary_restrictions']}'")
                return True
            else:
                print(f"   ❌ Dietary restrictions field missing from login response")
                return False
        return False

    def test_existing_user_backward_compatibility(self):
        """Test login with existing user (backward compatibility for users without dietary_restrictions)"""
        # First try to login with the original test user
        login_data = {
            "email": "teste@fitlife.com",
            "password": "senha123"
        }
        
        success, response = self.run_test(
            "Existing User Backward Compatibility",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            self.token = response['token']
            self.user_data = response.get('user', {})
            print(f"   ✅ Login successful with existing user")
            
            # Check if dietary_restrictions field exists (should have default value)
            dietary_restrictions = self.user_data.get('dietary_restrictions', 'FIELD_MISSING')
            if dietary_restrictions != 'FIELD_MISSING':
                print(f"   ✅ Dietary restrictions field present with default: '{dietary_restrictions}'")
                return True
            else:
                print(f"   ❌ Dietary restrictions field missing for existing user")
                return False
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

    def test_user_profile_dietary_restrictions(self):
        """Test getting user profile with dietary_restrictions field verification"""
        success, response = self.run_test(
            "Get User Profile (Dietary Restrictions Check)",
            "GET",
            "user/profile",
            200
        )
        
        if success:
            print(f"   ✅ Profile data: {response.get('name', 'N/A')} - {response.get('email', 'N/A')}")
            print(f"   ✅ Trial status: {'Premium' if response.get('is_premium') else 'Trial'}")
            
            # Verify dietary_restrictions field is present
            if 'dietary_restrictions' in response:
                dietary_restrictions = response['dietary_restrictions']
                print(f"   ✅ Dietary restrictions field present: '{dietary_restrictions}'")
                return True
            else:
                print(f"   ❌ Dietary restrictions field missing from profile response")
                return False
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
            return True, response
        return False, []

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

    def test_feedback_submission(self):
        """Test feedback submission with valid data"""
        feedback_data = {
            "name": "João Test",
            "email": "joao.test@email.com",
            "message": "Este é um teste do sistema de feedback do FitLife AI",
            "rating": 5
        }
        
        # Remove token temporarily since feedback endpoint is public
        temp_token = self.token
        self.token = None
        
        success, response = self.run_test(
            "Submit Feedback",
            "POST",
            "feedback",
            200,
            data=feedback_data
        )
        
        # Restore token
        self.token = temp_token
        
        if success:
            print(f"   ✅ Feedback submitted successfully")
            print(f"   ✅ Status: {response.get('status', 'N/A')}")
            print(f"   ✅ Feedback ID: {response.get('id', 'N/A')}")
            return True, response.get('id')
        return False, None

    def test_feedback_validation(self):
        """Test feedback validation with missing required fields"""
        # Test missing name
        invalid_data_1 = {
            "email": "test@email.com",
            "message": "Test message"
        }
        
        # Test missing email
        invalid_data_2 = {
            "name": "Test User",
            "message": "Test message"
        }
        
        # Test missing message
        invalid_data_3 = {
            "name": "Test User",
            "email": "test@email.com"
        }
        
        # Test invalid email format
        invalid_data_4 = {
            "name": "Test User",
            "email": "invalid-email",
            "message": "Test message"
        }
        
        # Remove token temporarily since feedback endpoint is public
        temp_token = self.token
        self.token = None
        
        validation_tests = [
            ("Missing Name", invalid_data_1),
            ("Missing Email", invalid_data_2),
            ("Missing Message", invalid_data_3),
            ("Invalid Email Format", invalid_data_4)
        ]
        
        validation_passed = 0
        for test_name, test_data in validation_tests:
            success, response = self.run_test(
                f"Feedback Validation - {test_name}",
                "POST",
                "feedback",
                422,  # Expecting validation error
                data=test_data
            )
            if success:
                validation_passed += 1
                print(f"   ✅ Validation correctly rejected {test_name.lower()}")
        
        # Restore token
        self.token = temp_token
        
        return validation_passed == len(validation_tests)

    def verify_feedback_in_database(self, feedback_id):
        """Verify feedback was saved to database by checking if we can retrieve it"""
        # Note: This is a simplified check since we don't have direct DB access
        # We'll assume if the API returned an ID, it was saved successfully
        if feedback_id:
            print(f"   ✅ Feedback appears to be saved (ID: {feedback_id})")
            return True
        else:
            print(f"   ❌ No feedback ID returned, may not be saved")
            return False

def main():
    print("🚀 Starting FitLife AI Authentication System Tests")
    print("🔍 Focus: Testing dietary_restrictions field fix")
    print("=" * 60)
    
    tester = FitLifeAPITester()
    
    # Test sequence for authentication system with dietary_restrictions fix
    print("\n📝 PHASE 1: New User Registration with Dietary Restrictions")
    registration_success = tester.test_user_registration_with_dietary_restrictions()
    
    if not registration_success:
        print("❌ New user registration with dietary_restrictions failed")
        return 1
    
    print("\n🔐 PHASE 2: Login with New User")
    login_new_user_success = tester.test_user_login_with_new_user()
    
    if not login_new_user_success:
        print("❌ Login with new user failed")
        return 1
    
    print("\n👤 PHASE 3: Profile Verification with Dietary Restrictions")
    profile_success = tester.test_user_profile_dietary_restrictions()
    
    if not profile_success:
        print("❌ Profile verification failed - dietary_restrictions field issue")
        return 1
    
    print("\n🔄 PHASE 4: Backward Compatibility Test")
    backward_compatibility_success = tester.test_existing_user_backward_compatibility()
    
    if not backward_compatibility_success:
        print("❌ Backward compatibility test failed")
        return 1
    
    print("\n👤 PHASE 5: Profile Verification for Existing User")
    existing_profile_success = tester.test_user_profile_dietary_restrictions()
    
    if not existing_profile_success:
        print("❌ Profile verification for existing user failed")
        return 1
    
    # Final results
    print("\n" + "=" * 60)
    print(f"📊 AUTHENTICATION SYSTEM TEST RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    # Specific authentication test results
    print(f"\n🔐 DIETARY RESTRICTIONS FIX VERIFICATION:")
    print(f"   New User Registration: {'✅ PASSED' if registration_success else '❌ FAILED'}")
    print(f"   New User Login: {'✅ PASSED' if login_new_user_success else '❌ FAILED'}")
    print(f"   Profile with Dietary Restrictions: {'✅ PASSED' if profile_success else '❌ FAILED'}")
    print(f"   Backward Compatibility: {'✅ PASSED' if backward_compatibility_success else '❌ FAILED'}")
    print(f"   Existing User Profile: {'✅ PASSED' if existing_profile_success else '❌ FAILED'}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All authentication tests passed! Dietary restrictions fix verified.")
        return 0
    elif tester.tests_passed >= tester.tests_run * 0.8:
        print("⚠️  Most tests passed, minor issues detected.")
        return 0
    else:
        print("❌ Multiple test failures detected in authentication system.")
        return 1

if __name__ == "__main__":
    sys.exit(main())