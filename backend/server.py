from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone, timedelta
import jwt
import bcrypt
from emergentintegrations.llm.chat import LlmChat, UserMessage
from emergentintegrations.payments.stripe.checkout import StripeCheckout, CheckoutSessionResponse, CheckoutStatusResponse, CheckoutSessionRequest

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT settings
JWT_SECRET = os.environ.get('JWT_SECRET', 'fitlife-secret-key-2025')
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# Stripe setup
stripe_api_key = os.environ.get('STRIPE_API_KEY')

# Create the main app without a prefix
app = FastAPI(title="FitLife AI API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

security = HTTPBearer()

# Define Models
class User(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    age: int
    weight: float
    height: float
    goals: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_premium: bool = False
    trial_end_date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc) + timedelta(days=7))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    age: int
    weight: float
    height: float
    goals: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    age: int
    weight: float
    height: float
    goals: str
    is_premium: bool
    trial_end_date: datetime

class WorkoutSuggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    suggestion: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NutritionSuggestion(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    suggestion: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentTransaction(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    session_id: str
    amount: float
    currency: str
    payment_status: str = "pending"
    metadata: Dict[str, str] = {}
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Authentication functions
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))

def create_jwt_token(user_data: dict) -> str:
    payload = {
        "user_id": user_data["id"],
        "email": user_data["email"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def verify_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    payload = verify_jwt_token(credentials.credentials)
    user = await db.users.find_one({"id": payload["user_id"]})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return User(**user)

# Authentication endpoints
@api_router.post("/auth/register", response_model=dict)
async def register_user(user_data: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    hashed_password = hash_password(user_data.password)
    user = User(
        email=user_data.email,
        name=user_data.name,
        age=user_data.age,
        weight=user_data.weight,
        height=user_data.height,
        goals=user_data.goals
    )
    
    user_dict = user.dict()
    user_dict["password"] = hashed_password
    
    await db.users.insert_one(user_dict)
    
    # Create JWT token
    token = create_jwt_token(user.dict())
    
    return {
        "message": "User registered successfully",
        "token": token,
        "user": UserResponse(**user.dict())
    }

@api_router.post("/auth/login", response_model=dict)
async def login_user(login_data: UserLogin):
    # Find user
    user = await db.users.find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create JWT token
    token = create_jwt_token(user)
    
    return {
        "message": "Login successful",
        "token": token,
        "user": UserResponse(**user)
    }

# AI Suggestions endpoints
@api_router.post("/suggestions/workout", response_model=WorkoutSuggestion)
async def get_workout_suggestion(current_user: User = Depends(get_current_user)):
    # Check if user has access (premium or in trial)
    trial_end = current_user.trial_end_date
    if trial_end.tzinfo is None:
        trial_end = trial_end.replace(tzinfo=timezone.utc)
    if not current_user.is_premium and datetime.now(timezone.utc) > trial_end:
        raise HTTPException(status_code=403, detail="Trial expired. Please upgrade to premium.")
    
    # Initialize Gemini chat
    chat = LlmChat(
        api_key=os.environ['EMERGENT_LLM_KEY'],
        session_id=f"workout_{current_user.id}_{uuid.uuid4()}",
        system_message="Você é um personal trainer especialista em IA. Crie sugestões de treinos personalizados em português brasileiro. Seja específico com exercícios, séries, repetições e dicas importantes."
    ).with_model("gemini", "gemini-2.0-flash")
    
    # Create personalized prompt
    user_message = UserMessage(
        text=f"""
        Crie uma sugestão de treino personalizada para:
        - Nome: {current_user.name}
        - Idade: {current_user.age} anos
        - Peso: {current_user.weight}kg
        - Altura: {current_user.height}cm
        - Objetivos: {current_user.goals}
        
        Por favor, forneça um treino específico com:
        1. Aquecimento (5-10 minutos)
        2. Exercícios principais (séries x repetições)
        3. Exercícios de resfriamento
        4. Dicas importantes de segurança
        
        Mantenha o treino prático e adequado ao nível do usuário.
        """
    )
    
    # Get AI response
    response = await chat.send_message(user_message)
    
    # Save suggestion to database
    suggestion = WorkoutSuggestion(
        user_id=current_user.id,
        suggestion=response
    )
    
    await db.workout_suggestions.insert_one(suggestion.dict())
    
    return suggestion

@api_router.post("/suggestions/nutrition", response_model=NutritionSuggestion)
async def get_nutrition_suggestion(current_user: User = Depends(get_current_user)):
    # Check if user has access (premium or in trial)
    if not current_user.is_premium and datetime.now(timezone.utc) > current_user.trial_end_date:
        raise HTTPException(status_code=403, detail="Trial expired. Please upgrade to premium.")
    
    # Initialize Gemini chat
    chat = LlmChat(
        api_key=os.environ['EMERGENT_LLM_KEY'],
        session_id=f"nutrition_{current_user.id}_{uuid.uuid4()}",
        system_message="Você é um nutricionista especialista em IA. Crie sugestões de dietas personalizadas em português brasileiro. Seja específico com refeições, porções e dicas nutricionais importantes."
    ).with_model("gemini", "gemini-2.0-flash")
    
    # Create personalized prompt
    user_message = UserMessage(
        text=f"""
        Crie uma sugestão de dieta personalizada para:
        - Nome: {current_user.name}
        - Idade: {current_user.age} anos
        - Peso: {current_user.weight}kg
        - Altura: {current_user.height}cm
        - Objetivos: {current_user.goals}
        
        Por favor, forneça um plano alimentar com:
        1. Café da manhã
        2. Lanche da manhã
        3. Almoço
        4. Lanche da tarde
        5. Jantar
        6. Ceia (se necessário)
        
        Inclua porções aproximadas e dicas nutricionais importantes.
        """
    )
    
    # Get AI response
    response = await chat.send_message(user_message)
    
    # Save suggestion to database
    suggestion = NutritionSuggestion(
        user_id=current_user.id,
        suggestion=response
    )
    
    await db.nutrition_suggestions.insert_one(suggestion.dict())
    
    return suggestion

# History endpoints
@api_router.get("/history/workouts", response_model=List[WorkoutSuggestion])
async def get_workout_history(current_user: User = Depends(get_current_user)):
    suggestions = await db.workout_suggestions.find({"user_id": current_user.id}).sort("created_at", -1).limit(10).to_list(10)
    return [WorkoutSuggestion(**suggestion) for suggestion in suggestions]

@api_router.get("/history/nutrition", response_model=List[NutritionSuggestion])
async def get_nutrition_history(current_user: User = Depends(get_current_user)):
    suggestions = await db.nutrition_suggestions.find({"user_id": current_user.id}).sort("created_at", -1).limit(10).to_list(10)
    return [NutritionSuggestion(**suggestion) for suggestion in suggestions]

# Payment endpoints
@api_router.post("/payments/checkout", response_model=CheckoutSessionResponse)
async def create_checkout_session(request: Request, current_user: User = Depends(get_current_user)):
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    # Fixed subscription price - R$ 14.90 per month
    amount = 14.90
    currency = "brl"
    
    # Get host URL from request
    host_url = str(request.base_url).rstrip('/')
    success_url = f"{host_url}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{host_url}/cancel"
    
    # Initialize Stripe checkout
    webhook_url = f"{host_url}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Create checkout session
    checkout_request = CheckoutSessionRequest(
        amount=amount,
        currency=currency,
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "user_id": current_user.id,
            "email": current_user.email,
            "subscription_type": "premium_monthly"
        }
    )
    
    session = await stripe_checkout.create_checkout_session(checkout_request)
    
    # Save transaction record
    transaction = PaymentTransaction(
        user_id=current_user.id,
        session_id=session.session_id,
        amount=amount,
        currency=currency,
        payment_status="pending",
        metadata=checkout_request.metadata or {}
    )
    
    await db.payment_transactions.insert_one(transaction.dict())
    
    return session

@api_router.get("/payments/status/{session_id}", response_model=CheckoutStatusResponse)
async def get_payment_status(session_id: str, current_user: User = Depends(get_current_user)):
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    # Initialize Stripe checkout
    webhook_url = "http://placeholder"  # Not used for status check
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    # Get checkout status
    status = await stripe_checkout.get_checkout_status(session_id)
    
    # Update transaction in database
    if status.payment_status == "paid":
        # Update user to premium
        await db.users.update_one(
            {"id": current_user.id},
            {"$set": {"is_premium": True}}
        )
        
        # Update transaction status
        await db.payment_transactions.update_one(
            {"session_id": session_id, "user_id": current_user.id},
            {"$set": {"payment_status": "completed"}}
        )
    elif status.status == "expired":
        await db.payment_transactions.update_one(
            {"session_id": session_id, "user_id": current_user.id},
            {"$set": {"payment_status": "expired"}}
        )
    
    return status

@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    if not stripe_api_key:
        raise HTTPException(status_code=500, detail="Payment system not configured")
    
    webhook_url = "http://placeholder"  # Placeholder for webhook handling
    stripe_checkout = StripeCheckout(api_key=stripe_api_key, webhook_url=webhook_url)
    
    body = await request.body()
    stripe_signature = request.headers.get("Stripe-Signature")
    
    try:
        webhook_response = await stripe_checkout.handle_webhook(body, stripe_signature)
        
        if webhook_response.payment_status == "paid":
            # Update user to premium based on metadata
            if webhook_response.metadata and webhook_response.metadata.get("user_id"):
                user_id = webhook_response.metadata["user_id"]
                await db.users.update_one(
                    {"id": user_id},
                    {"$set": {"is_premium": True}}
                )
                
                # Update transaction status
                await db.payment_transactions.update_one(
                    {"session_id": webhook_response.session_id},
                    {"$set": {"payment_status": "completed"}}
                )
        
        return {"status": "success"}
    except Exception as e:
        logging.error(f"Webhook error: {str(e)}")
        raise HTTPException(status_code=400, detail="Webhook processing failed")

# User profile endpoint
@api_router.get("/user/profile", response_model=UserResponse)
async def get_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse(**current_user.dict())

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()