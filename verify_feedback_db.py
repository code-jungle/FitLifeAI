#!/usr/bin/env python3
"""
Verify feedback was saved to MongoDB database
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path

async def verify_feedback_in_db():
    """Verify feedback entries in MongoDB"""
    try:
        # Load environment variables
        ROOT_DIR = Path(__file__).parent / "backend"
        load_dotenv(ROOT_DIR / '.env')
        
        # Connect to MongoDB
        mongo_url = os.environ['MONGO_URL']
        db_name = os.environ['DB_NAME']
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        print("🔍 Checking feedback collection in MongoDB...")
        print(f"   Database: {db_name}")
        print(f"   MongoDB URL: {mongo_url}")
        
        # Count total feedback entries
        feedback_count = await db.feedback.count_documents({})
        print(f"   Total feedback entries: {feedback_count}")
        
        if feedback_count > 0:
            # Get recent feedback entries
            recent_feedback = await db.feedback.find().sort("created_at", -1).limit(5).to_list(5)
            
            print(f"\n📝 Recent feedback entries:")
            for i, feedback in enumerate(recent_feedback, 1):
                print(f"   {i}. ID: {feedback.get('id', 'N/A')}")
                print(f"      Name: {feedback.get('name', 'N/A')}")
                print(f"      Email: {feedback.get('email', 'N/A')}")
                print(f"      Status: {feedback.get('status', 'N/A')}")
                print(f"      Created: {feedback.get('created_at', 'N/A')}")
                print(f"      Message: {feedback.get('message', 'N/A')[:50]}...")
                print()
            
            print("✅ Feedback entries found in database!")
            return True
        else:
            print("❌ No feedback entries found in database")
            return False
            
    except Exception as e:
        print(f"❌ Error connecting to database: {str(e)}")
        return False
    finally:
        if 'client' in locals():
            client.close()

if __name__ == "__main__":
    result = asyncio.run(verify_feedback_in_db())
    exit(0 if result else 1)