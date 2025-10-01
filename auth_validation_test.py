#!/usr/bin/env python3
"""
Additional validation test for dietary_restrictions field fix
Testing edge cases and validation scenarios
"""

import requests
import time
import json

def test_dietary_restrictions_validation():
    """Test various dietary restrictions scenarios"""
    base_url = "https://mobile-optimized-10.preview.emergentagent.com/api"
    
    print("🧪 Additional Dietary Restrictions Validation Tests")
    print("=" * 60)
    
    # Test 1: Registration with empty dietary_restrictions
    print("\n📝 Test 1: Registration with empty dietary_restrictions")
    test_data_1 = {
        "email": f"test.empty.{int(time.time())}@example.com",
        "password": "TestPassword123!",
        "name": "Empty Restrictions User",
        "age": 30,
        "weight": 75,
        "height": 180,
        "goals": "Test empty restrictions",
        "dietary_restrictions": ""
    }
    
    response = requests.post(f"{base_url}/auth/register", json=test_data_1)
    if response.status_code == 200:
        data = response.json()
        dietary_restrictions = data.get('user', {}).get('dietary_restrictions', 'MISSING')
        print(f"✅ Registration successful - dietary_restrictions: '{dietary_restrictions}'")
    else:
        print(f"❌ Registration failed: {response.status_code}")
    
    # Test 2: Registration without dietary_restrictions field
    print("\n📝 Test 2: Registration without dietary_restrictions field")
    test_data_2 = {
        "email": f"test.missing.{int(time.time())}@example.com",
        "password": "TestPassword123!",
        "name": "Missing Field User",
        "age": 25,
        "weight": 65,
        "height": 170,
        "goals": "Test missing field"
        # dietary_restrictions field intentionally omitted
    }
    
    response = requests.post(f"{base_url}/auth/register", json=test_data_2)
    if response.status_code == 200:
        data = response.json()
        dietary_restrictions = data.get('user', {}).get('dietary_restrictions', 'MISSING')
        print(f"✅ Registration successful - dietary_restrictions: '{dietary_restrictions}'")
    else:
        print(f"❌ Registration failed: {response.status_code}")
    
    # Test 3: Registration with long dietary_restrictions
    print("\n📝 Test 3: Registration with long dietary_restrictions")
    long_restrictions = "Vegetariano, sem glúten, sem lactose, sem nozes, sem frutos do mar, sem ovos, sem soja, preferência por alimentos orgânicos e locais"
    test_data_3 = {
        "email": f"test.long.{int(time.time())}@example.com",
        "password": "TestPassword123!",
        "name": "Long Restrictions User",
        "age": 35,
        "weight": 80,
        "height": 185,
        "goals": "Test long restrictions",
        "dietary_restrictions": long_restrictions
    }
    
    response = requests.post(f"{base_url}/auth/register", json=test_data_3)
    if response.status_code == 200:
        data = response.json()
        dietary_restrictions = data.get('user', {}).get('dietary_restrictions', 'MISSING')
        print(f"✅ Registration successful - dietary_restrictions: '{dietary_restrictions[:50]}...'")
        
        # Test login and profile for this user
        login_data = {
            "email": test_data_3["email"],
            "password": test_data_3["password"]
        }
        
        login_response = requests.post(f"{base_url}/auth/login", json=login_data)
        if login_response.status_code == 200:
            token = login_response.json()['token']
            headers = {'Authorization': f'Bearer {token}'}
            
            profile_response = requests.get(f"{base_url}/user/profile", headers=headers)
            if profile_response.status_code == 200:
                profile_data = profile_response.json()
                profile_restrictions = profile_data.get('dietary_restrictions', 'MISSING')
                print(f"✅ Profile verification - dietary_restrictions: '{profile_restrictions[:50]}...'")
                
                # Verify the full content matches
                if profile_restrictions == long_restrictions:
                    print("✅ Full dietary restrictions content preserved correctly")
                else:
                    print("❌ Dietary restrictions content mismatch")
            else:
                print(f"❌ Profile fetch failed: {profile_response.status_code}")
        else:
            print(f"❌ Login failed: {login_response.status_code}")
    else:
        print(f"❌ Registration failed: {response.status_code}")
    
    print("\n" + "=" * 60)
    print("🎯 Validation tests completed")

if __name__ == "__main__":
    test_dietary_restrictions_validation()