import requests
import json

# Test backend connection
print("Testing backend connection...")

# Test health endpoint
try:
    response = requests.get('http://localhost:8000/health')
    print(f"✅ Health check: {response.status_code} - {response.json()}")
except Exception as e:
    print(f"❌ Health check failed: {e}")
    exit(1)

# Test registration
print("\nTesting registration...")
user_data = {
    "full_name": "Test User",
    "email": f"test{int(__import__('time').time())}@example.com",
    "password": "test123456"
}

try:
    response = requests.post(
        'http://localhost:8000/api/auth/register',
        headers={'Content-Type': 'application/json'},
        json=user_data
    )
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    if response.status_code == 201:
        print("\n✅ Registration successful!")
    else:
        print(f"\n❌ Registration failed!")
except Exception as e:
    print(f"❌ Registration error: {e}")
