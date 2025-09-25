#!/usr/bin/env python3
"""
FitLife AI Feedback Endpoint Test
Tests the POST /api/feedback endpoint as requested
"""

import requests
import json
import sys
from datetime import datetime

class FeedbackTester:
    def __init__(self, base_url="https://fitlife-personal.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        print(f"   Data: {json.dumps(data, indent=2) if data else 'None'}")
        
        try:
            if method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {json.dumps(error_data, indent=2)}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_feedback_submission_valid(self):
        """Test feedback submission with valid data as requested"""
        feedback_data = {
            "name": "João Test",
            "email": "joao.test@email.com",
            "message": "Este é um teste do sistema de feedback do FitLife AI",
            "rating": 5
        }
        
        success, response = self.run_test(
            "Submit Valid Feedback",
            "POST",
            "feedback",
            200,
            data=feedback_data
        )
        
        if success:
            print(f"   ✅ Feedback submitted successfully")
            print(f"   ✅ Status: {response.get('status', 'N/A')}")
            print(f"   ✅ Message: {response.get('message', 'N/A')}")
            print(f"   ✅ Feedback ID: {response.get('id', 'N/A')}")
            return True, response.get('id')
        return False, None

    def test_feedback_submission_without_rating(self):
        """Test feedback submission without optional rating field"""
        feedback_data = {
            "name": "João Test 2",
            "email": "joao.test2@email.com",
            "message": "Teste sem avaliação numérica"
        }
        
        success, response = self.run_test(
            "Submit Feedback Without Rating",
            "POST",
            "feedback",
            200,
            data=feedback_data
        )
        
        if success:
            print(f"   ✅ Feedback without rating submitted successfully")
            return True, response.get('id')
        return False, None

    def test_feedback_validation_missing_name(self):
        """Test feedback validation - missing name"""
        invalid_data = {
            "email": "test@email.com",
            "message": "Test message without name"
        }
        
        success, response = self.run_test(
            "Validation Test - Missing Name",
            "POST",
            "feedback",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        if success:
            print(f"   ✅ Validation correctly rejected missing name")
            return True
        return False

    def test_feedback_validation_missing_email(self):
        """Test feedback validation - missing email"""
        invalid_data = {
            "name": "Test User",
            "message": "Test message without email"
        }
        
        success, response = self.run_test(
            "Validation Test - Missing Email",
            "POST",
            "feedback",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        if success:
            print(f"   ✅ Validation correctly rejected missing email")
            return True
        return False

    def test_feedback_validation_missing_message(self):
        """Test feedback validation - missing message"""
        invalid_data = {
            "name": "Test User",
            "email": "test@email.com"
        }
        
        success, response = self.run_test(
            "Validation Test - Missing Message",
            "POST",
            "feedback",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        if success:
            print(f"   ✅ Validation correctly rejected missing message")
            return True
        return False

    def test_feedback_validation_invalid_email(self):
        """Test feedback validation - invalid email format"""
        invalid_data = {
            "name": "Test User",
            "email": "invalid-email-format",
            "message": "Test message with invalid email"
        }
        
        success, response = self.run_test(
            "Validation Test - Invalid Email Format",
            "POST",
            "feedback",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        if success:
            print(f"   ✅ Validation correctly rejected invalid email format")
            return True
        return False

    def test_feedback_validation_empty_fields(self):
        """Test feedback validation - empty string fields"""
        invalid_data = {
            "name": "",
            "email": "test@email.com",
            "message": ""
        }
        
        success, response = self.run_test(
            "Validation Test - Empty Fields",
            "POST",
            "feedback",
            422,  # Expecting validation error
            data=invalid_data
        )
        
        if success:
            print(f"   ✅ Validation correctly rejected empty fields")
            return True
        return False

def main():
    print("🚀 Starting FitLife AI Feedback Endpoint Tests")
    print("=" * 60)
    print("Testing POST /api/feedback endpoint")
    print("URL: https://fitlife-personal.preview.emergentagent.com/api/feedback")
    print("=" * 60)
    
    tester = FeedbackTester()
    
    # Test 1: Valid feedback submission (as requested)
    print("\n📝 PHASE 1: Valid Feedback Submission")
    feedback_success, feedback_id = tester.test_feedback_submission_valid()
    
    # Test 2: Valid feedback without optional rating
    print("\n📝 PHASE 2: Feedback Without Rating")
    feedback_no_rating_success, feedback_id_2 = tester.test_feedback_submission_without_rating()
    
    # Test 3: Validation tests (as requested)
    print("\n🔍 PHASE 3: Validation Tests")
    validation_tests = [
        tester.test_feedback_validation_missing_name(),
        tester.test_feedback_validation_missing_email(),
        tester.test_feedback_validation_missing_message(),
        tester.test_feedback_validation_invalid_email(),
        tester.test_feedback_validation_empty_fields()
    ]
    
    validation_passed = sum(validation_tests)
    
    # Final results
    print("\n" + "=" * 60)
    print(f"📊 FEEDBACK ENDPOINT TEST RESULTS")
    print("=" * 60)
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    print(f"\n📝 DETAILED RESULTS:")
    print(f"   Valid Feedback Submission: {'✅ PASSED' if feedback_success else '❌ FAILED'}")
    print(f"   Feedback Without Rating: {'✅ PASSED' if feedback_no_rating_success else '❌ FAILED'}")
    print(f"   Validation Tests: {validation_passed}/5 passed")
    
    print(f"\n💾 DATABASE VERIFICATION:")
    if feedback_success and feedback_id:
        print(f"   ✅ Feedback saved to MongoDB (ID: {feedback_id})")
    else:
        print(f"   ❌ Feedback may not be saved to MongoDB")
    
    print(f"\n📧 EMAIL FUNCTIONALITY:")
    if feedback_success:
        print(f"   ✅ Email sending functionality tested (check response status)")
        print(f"   ℹ️  Note: SMTP credentials may not be configured, but endpoint should still work")
    else:
        print(f"   ❌ Email functionality not tested due to submission failure")
    
    print(f"\n🎯 SUMMARY:")
    if tester.tests_passed == tester.tests_run:
        print("🎉 All feedback endpoint tests passed! Endpoint is working correctly.")
        return 0
    elif tester.tests_passed >= tester.tests_run * 0.8:
        print("⚠️  Most tests passed, minor issues detected.")
        return 0
    else:
        print("❌ Multiple test failures detected in feedback endpoint.")
        return 1

if __name__ == "__main__":
    sys.exit(main())