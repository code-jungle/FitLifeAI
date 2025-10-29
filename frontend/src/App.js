import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  Star, 
  Trophy, 
  Zap, 
  Activity,
  User,
  LogOut,
  History,
  CreditCard,
  Crown,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  AlertTriangle,
  UserMinus,
  MessageSquare,
  Send
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setFeedbackLoading(true);

    try {
      const response = await axios.post(`${API}/feedback`, {
        name: feedbackData.name,
        email: feedbackData.email,
        message: feedbackData.message,
        rating: null
      });

      toast({
        title: "Feedback enviado!",
        description: "Obrigado pelo seu feedback. Recebemos sua mensagem com sucesso."
      });

      // Reset form and close modal
      setFeedbackData({ name: '', email: '', message: '' });
      setFeedbackOpen(false);

    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Não foi possível enviar o feedback. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setFeedbackLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Gradient Header */}
      <header className="relative sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
        {/* Background with gradient and glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-red-500/10"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          {/* Enhanced Logo with gradient */}
          <div className="fitlife-logo flex items-center">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 flex items-center justify-center mr-3 shadow-lg shadow-pink-500/25">
              <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="fitlife-logo-text bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-bold text-lg sm:text-xl">
              FitLife AI
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 text-sm sm:text-base px-3 sm:px-4 rounded-lg backdrop-blur-sm hover:shadow-lg hover:shadow-white/5 transition-all duration-200"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
            
            {/* PWA Install Button - Hidden by default, shown by PWA script */}
            <Button
              id="pwa-install-btn"
              variant="outline"
              className="hidden border-pink-500/50 text-pink-400 hover:bg-gradient-to-r hover:from-pink-500 hover:to-orange-500 hover:text-white text-sm px-3 py-1 rounded-lg backdrop-blur-sm transition-all duration-300"
              style={{ display: 'none' }}
            >
              📱 Instalar App
            </Button>
          </div>
        </div>
        
        {/* Subtle glow line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
      </header>

      {/* Enhanced Mobile Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-3 sm:px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://customer-assets.emergentagent.com/job_smartfit-ai-2/artifacts/0b9ap7fs_f7736199-989a-4bc2-ad40-54f184078b7a.png')`
          }}
        />
        
        <div className="relative mobile-container max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-8 leading-tight sm:leading-normal px-2">
            Transforme seu corpo com
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent mt-1">
              Inteligência Artificial
            </span>
          </h1>
          
          <p className="text-sm sm:text-xl text-gray-300 mb-6 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-3">
            Sugestões personalizadas de treinos e nutrição criadas especialmente para você.
            <span className="block sm:inline mt-1 sm:mt-0"> 7 dias grátis, depois apenas R$ 14,90/mês.</span>
          </p>
          
          <div className="flex flex-col gap-3 justify-center items-center px-3">
            <Button 
              size="lg" 
              className="mobile-button bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold shadow-xl touch-manipulation"
              onClick={() => navigate('/register')}
            >
              <Zap className="mr-2 h-5 w-5" />
              <span className="text-base font-semibold">Começar Grátis Agora</span>
            </Button>
          </div>
          
          <div className="mt-6 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-8 text-xs sm:text-sm text-gray-400 px-3 max-w-lg sm:max-w-none mx-auto">
            <div className="flex items-center justify-center">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center justify-center">
              <Crown className="h-4 w-4 text-orange-500 mr-2" />
              <span>IA Personalizada</span>
            </div>
            <div className="flex items-center justify-center">
              <Activity className="h-4 w-4 text-pink-500 mr-2" />
              <span>Sugestões Ilimitadas</span>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mobile Features Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 bg-slate-800/50">
        <div className="mobile-container max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-4xl font-bold text-white mb-3 sm:mb-6 px-2">
              Tecnologia que Transforma seu
              <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent mt-1"> Fitness</span>
            </h2>
            <p className="text-sm sm:text-xl text-gray-300 max-w-2xl mx-auto px-3 leading-relaxed">
              Nossa IA analisa seus dados pessoais para criar sugestões únicas de treino e nutrição
            </p>
          </div>

          <div className="mobile-grid md:grid md:grid-cols-3 gap-4 sm:gap-8">
            <Card className="mobile-card bg-slate-900/90 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300 shadow-lg">
              <CardHeader className="text-center pb-3">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Dumbbell className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-white font-bold">Treinos Personalizados</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-center text-sm sm:text-lg leading-relaxed">
                  IA cria treinos específicos baseados em sua idade, peso, altura e objetivos pessoais
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="mobile-card bg-slate-900/90 border-slate-700 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300 shadow-lg">
              <CardHeader className="text-center pb-3">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Apple className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-white font-bold">Nutrição Inteligente</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-center text-sm sm:text-lg leading-relaxed">
                  Sugestões de dieta balanceada com porções e horários ideais para seus objetivos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="mobile-card bg-slate-900/90 border-slate-700 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300 shadow-lg">
              <CardHeader className="text-center pb-3">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-3 shadow-lg">
                  <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <CardTitle className="text-lg sm:text-2xl text-white font-bold">IA Avançada</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-gray-300 text-center text-sm sm:text-lg leading-relaxed">
                  Powered by Gemini AI, a mais avançada tecnologia para sugestões fitness personalizadas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Enhanced Mobile CTA Section */}
      <section className="py-12 sm:py-20 px-3 sm:px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500">
        <div className="mobile-container max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-8 leading-tight px-2">
            Pronto para Transformar seu Corpo?
          </h2>
          <p className="text-sm sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto px-3 leading-relaxed">
            Junte-se a milhares de pessoas que já transformaram suas vidas com o FitLife AI
          </p>
          <Button 
            size="lg" 
            className="mobile-button bg-white text-slate-900 hover:bg-gray-100 font-semibold shadow-xl touch-manipulation"
            onClick={() => navigate('/register')}
          >
            <Trophy className="mr-2 h-5 w-5" />
            <span className="text-base font-semibold">Comece sua Transformação</span>
          </Button>
        </div>
      </section>

      {/* Enhanced Mobile Feedback Section */}
      <section className="py-12 sm:py-16 px-3 sm:px-6 bg-slate-800/50">
        <div className="mobile-container max-w-4xl mx-auto text-center">
          <h2 className="text-xl sm:text-3xl font-bold text-white mb-3 sm:mb-4 px-2">
            Sua opinião é importante!
          </h2>
          <p className="text-sm sm:text-base text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto px-3 leading-relaxed">
            Tem sugestões, dúvidas ou quer compartilhar sua experiência? 
            Envie seu feedback e nos ajude a melhorar o FitLife AI.
          </p>
          
          <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
            <DialogTrigger asChild>
              <Button 
                className="mobile-button bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold shadow-lg touch-manipulation"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Enviar Feedback
              </Button>
            </DialogTrigger>
            <DialogContent className="mobile-modal bg-slate-800 border-slate-700 max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-white flex items-center text-base sm:text-lg">
                  <MessageSquare className="mr-2 h-5 w-5 text-orange-500" />
                  Envie seu Feedback
                </DialogTitle>
                <DialogDescription className="text-gray-400 text-sm">
                  Conte-nos sua experiência, sugestões ou dúvidas sobre o FitLife AI.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleFeedbackSubmit} className="space-y-3 sm:space-y-4 mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="feedback-name" className="text-white text-sm font-medium">Nome</Label>
                    <Input
                      id="feedback-name"
                      required
                      value={feedbackData.name}
                      onChange={(e) => setFeedbackData({...feedbackData, name: e.target.value})}
                      className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="Seu nome"
                    />
                  </div>
                  <div>
                    <Label htmlFor="feedback-email" className="text-white text-sm font-medium">Email</Label>
                    <Input
                      id="feedback-email"
                      type="email"
                      required
                      value={feedbackData.email}
                      onChange={(e) => setFeedbackData({...feedbackData, email: e.target.value})}
                      className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="feedback-message" className="text-white text-sm font-medium">Sua Mensagem</Label>
                  <Textarea
                    id="feedback-message"
                    required
                    value={feedbackData.message}
                    onChange={(e) => setFeedbackData({...feedbackData, message: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1 min-h-[100px] resize-none"
                    placeholder="Compartilhe sua experiência, sugestões ou dúvidas..."
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-3">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setFeedbackOpen(false)}
                    className="text-gray-400 hover:text-white order-2 sm:order-1 mobile-button sm:w-auto"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={feedbackLoading}
                    className="mobile-button bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white order-1 sm:order-2 sm:w-auto touch-manipulation"
                  >
                    {feedbackLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="loading-spinner mr-2"></div>
                        Enviando...
                      </div>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Enviar Feedback
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto text-center">
          <p className="text-gray-400">© 2025 - Powered by CodeJungle</p>
        </div>
      </footer>
    </div>
  );
};

// Auth Forms Component
const AuthForms = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== '/register');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Estados para controlar visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: '',
    dietary_restrictions: '',
    workout_type: 'academia',
    current_activities: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação de confirmação de senha apenas no cadastro
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem. Verifique e tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'register';
      // Remover confirmPassword do objeto enviado para o backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(`${API}/auth/${endpoint}`, dataToSend);
      
      login(response.data.user, response.data.token);
      toast({
        title: "Sucesso!",
        description: isLogin ? "Login realizado com sucesso!" : "Cadastro realizado com sucesso!"
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-2 sm:p-6">
      <Card className="mobile-card w-full max-w-lg bg-slate-800 border-slate-700 shadow-2xl m-2 sm:m-0">
        <CardHeader className="text-center pb-4">
          <div className="fitlife-logo mx-auto mb-2">
            <div className="fitlife-logo-text text-lg sm:text-xl">FitLife AI</div>
          </div>
          <CardTitle className="text-white text-lg sm:text-2xl">
            {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            {isLogin ? 'Acesse suas sugestões personalizadas' : '7 dias grátis, depois R$ 14,90/mês'}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {!isLogin && (
              <div className="space-y-3 sm:space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white text-sm font-medium">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label htmlFor="age" className="text-white text-sm font-medium">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="28"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-white text-sm font-medium">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      min="30"
                      max="300"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                      placeholder="70.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="height" className="text-white text-sm font-medium">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min="120"
                    max="250"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="175"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Use ponto para decimais no peso (ex: 70.5)
                  </p>
                </div>
                <div>
                  <Label htmlFor="goals" className="text-white text-sm font-medium">Seus objetivos</Label>
                  <Textarea
                    id="goals"
                    required
                    placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condicionamento..."
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1 min-h-[70px] resize-none"
                  />
                </div>
                <div>
                  <Label htmlFor="dietary_restrictions" className="text-white text-sm font-medium">
                    Restrições Alimentares
                    <span className="text-gray-400 text-xs ml-1">(opcional)</span>
                  </Label>
                  <Textarea
                    id="dietary_restrictions"
                    placeholder="Ex: Vegano, vegetariano, lactose, glúten..."
                    value={formData.dietary_restrictions}
                    onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1 min-h-[50px] resize-none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="workout_type" className="text-white text-sm font-medium">Onde você prefere treinar?</Label>
                  <select
                    id="workout_type"
                    required
                    value={formData.workout_type}
                    onChange={(e) => setFormData({...formData, workout_type: e.target.value})}
                    className="mobile-input w-full bg-slate-700 border border-slate-600 text-white mt-1 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="academia">🏋️ Academia</option>
                    <option value="casa">🏠 Em Casa</option>
                    <option value="ar_livre">🌳 Ao Ar Livre</option>
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="current_activities" className="text-white text-sm font-medium">
                    Atividades Físicas Atuais
                    <span className="text-gray-400 text-xs ml-1">(opcional)</span>
                  </Label>
                  <Textarea
                    id="current_activities"
                    placeholder="Ex: Futebol 2x/semana, Corrida, Academia..."
                    value={formData.current_activities}
                    onChange={(e) => setFormData({...formData, current_activities: e.target.value})}
                    className="mobile-input bg-slate-700 border-slate-600 text-white mt-1 min-h-[50px] resize-none"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-white text-sm font-medium">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="mobile-input bg-slate-700 border-slate-600 text-white mt-1"
                placeholder="seu@email.com"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white text-sm font-medium">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="mobile-input bg-slate-700 border-slate-600 text-white mt-1 pr-12"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-slate-600 p-2 rounded-md z-10 touch-manipulation"
                  tabIndex={-1}
                  title={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white text-sm font-medium">Confirmar Senha</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className={`mobile-input bg-slate-700 border-slate-600 text-white mt-1 pr-12 ${
                      formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                        ? 'border-red-500 focus:border-red-500' 
                        : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                        ? 'border-green-500 focus:border-green-500'
                        : ''
                    }`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-slate-600 p-2 rounded-md z-10 touch-manipulation"
                    tabIndex={-1}
                    title={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-xs mt-1">❌ As senhas não coincidem</p>
                )}
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-400 text-xs mt-1">✓ Senhas coincidem</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="mobile-button bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold shadow-lg mt-4 touch-manipulation"
              disabled={loading || (!isLogin && formData.password !== formData.confirmPassword)}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Processando...
                </div>
              ) : (
                isLogin ? 'Entrar' : 'Criar Conta Grátis'
              )}
            </Button>
          </form>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  name: '',
                  age: '',
                  weight: '',
                  height: '',
                  goals: '',
                  dietary_restrictions: '',
                  workout_type: 'academia',
                  current_activities: ''
                });
              }}
              className="text-orange-400 hover:text-orange-300 transition-colors text-sm font-medium touch-manipulation py-2 px-4 rounded-lg"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [suggestionType, setSuggestionType] = useState('workout');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [deleteAccountData, setDeleteAccountData] = useState({
    password: '',
    confirmationText: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    age: '',
    weight: '',
    height: '',
    goals: '',
    dietary_restrictions: '',
    workout_type: 'academia',
    current_activities: ''
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const generateSuggestion = async (type) => {
    setLoading(true);
    setSuggestionType(type); // Define o tipo ANTES da requisição
    try {
      const response = await axios.post(`${API}/suggestions/${type}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setCurrentSuggestion(response.data);
      
      toast({
        title: "Sugestão gerada!",
        description: `Nova sugestão de ${type === 'workout' ? 'treino' : 'nutrição'} criada com sucesso.`
      });
      
      // Refresh history
      if (type === 'workout') {
        fetchWorkoutHistory();
      } else {
        fetchNutritionHistory();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast({
          title: "Trial expirado",
          description: "Faça upgrade para premium para continuar usando.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a sugestão. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutHistory = async () => {
    try {
      const response = await axios.get(`${API}/history/workouts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWorkoutHistory(response.data);
    } catch (error) {
      console.error('Error fetching workout history:', error);
    }
  };

  const fetchNutritionHistory = async () => {
    try {
      const response = await axios.get(`${API}/history/nutrition`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNutritionHistory(response.data);
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
    }
  };

  const deleteSuggestion = async (id, type) => {
    try {
      await axios.delete(`${API}/history/${type}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast({
        title: "Sugestão excluída!",
        description: `${type === 'workouts' ? 'Treino' : 'Dieta'} removida do histórico.`
      });
      
      // Refresh history
      if (type === 'workouts') {
        fetchWorkoutHistory();
      } else {
        fetchNutritionHistory();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a sugestão.",
        variant: "destructive"
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await axios.post(`${API}/payments/checkout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountData.password || !deleteAccountData.confirmationText) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos para confirmar a exclusão.",
        variant: "destructive"
      });
      return;
    }

    if (deleteAccountData.confirmationText.toLowerCase() !== "excluir minha conta") {
      toast({
        title: "Erro",
        description: "Digite exatamente 'excluir minha conta' para confirmar.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.post(`${API}/user/delete-account`, {
        password: deleteAccountData.password,
        confirmation_text: deleteAccountData.confirmationText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast({
        title: "Conta excluída",
        description: "Sua conta e todos os dados foram removidos permanentemente."
      });

      // Logout após exclusão bem-sucedida
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      toast({
        title: "Erro na exclusão",
        description: error.response?.data?.detail || "Não foi possível excluir a conta. Verifique sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditProfile = () => {
    // Pre-populate form with current user data
    setEditProfileData({
      age: user?.age || '',
      weight: user?.weight || '',
      height: user?.height || '',
      goals: user?.goals || '',
      dietary_restrictions: user?.dietary_restrictions || '',
      workout_type: user?.workout_type || 'academia',
      current_activities: user?.current_activities || ''
    });
    setEditProfileOpen(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      // Validate required fields
      if (!editProfileData.age || !editProfileData.weight || !editProfileData.height || !editProfileData.goals) {
        toast({
          title: "Campos obrigatórios",
          description: "Preencha idade, peso, altura e objetivos.",
          variant: "destructive"
        });
        return;
      }

      const response = await axios.put(`${API}/user/profile`, {
        age: parseInt(editProfileData.age),
        weight: parseFloat(editProfileData.weight),
        height: parseFloat(editProfileData.height),
        goals: editProfileData.goals,
        dietary_restrictions: editProfileData.dietary_restrictions,
        workout_type: editProfileData.workout_type,
        current_activities: editProfileData.current_activities
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      // Update user context with new data
      const updatedUser = response.data;
      
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram atualizadas com sucesso. As próximas sugestões da IA serão baseadas nos novos dados.",
      });

      setEditProfileOpen(false);
      
      // Force refresh of user data
      window.location.reload();

    } catch (error) {
      toast({
        title: "Erro na atualização",
        description: error.response?.data?.detail || "Não foi possível atualizar o perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  useEffect(() => {
    fetchWorkoutHistory();
    fetchNutritionHistory();
  }, []);

  const isTrialActive = user && new Date() <= new Date(user.trial_end_date);
  const trialDaysLeft = user ? Math.max(0, Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  // Função para calcular IMC
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  // Função para classificar IMC
  const getBMICategory = (bmi) => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    
    if (bmiValue < 18.5) {
      return { category: 'Abaixo do peso', color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
    } else if (bmiValue < 25) {
      return { category: 'Peso normal', color: 'text-green-400', bgColor: 'bg-green-500/10' };
    } else if (bmiValue < 30) {
      return { category: 'Sobrepeso', color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
    } else if (bmiValue < 35) {
      return { category: 'Obesidade grau I', color: 'text-orange-400', bgColor: 'bg-orange-500/10' };
    } else if (bmiValue < 40) {
      return { category: 'Obesidade grau II', color: 'text-red-400', bgColor: 'bg-red-500/10' };
    } else {
      return { category: 'Obesidade grau III', color: 'text-red-600', bgColor: 'bg-red-600/10' };
    }
  };

  const userBMI = user ? calculateBMI(user.weight, user.height) : null;
  const bmiInfo = userBMI ? getBMICategory(userBMI) : null;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Enhanced Gradient Header */}
      <header className="relative mobile-header sticky top-0 z-50 backdrop-blur-xl border-b border-white/10">
        {/* Background with gradient and glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 via-orange-500/10 to-red-500/10"></div>
        
        <div className="relative mobile-container max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            {/* Enhanced Logo with gradient */}
            <div className="fitlife-logo flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r from-pink-500 via-orange-500 to-red-500 flex items-center justify-center mr-3 shadow-lg shadow-pink-500/25">
                <Dumbbell className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <div className="fitlife-logo-text bg-gradient-to-r from-pink-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-bold text-lg sm:text-xl">
                FitLife AI
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="hidden sm:block text-white text-sm">
                <span className="text-gray-300">Olá,</span> 
                <span className="font-medium text-white ml-1">{user?.name}</span>
              </div>
              
              {!user?.is_premium && (
                <div className={`px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${
                  isTrialActive 
                    ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black shadow-lg shadow-yellow-500/25' 
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/25'
                }`}>
                  {isTrialActive ? `${trialDaysLeft}d restantes` : 'Expirado'}
                </div>
              )}
              
              {user?.is_premium && (
                <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg shadow-pink-500/25">
                  <Crown className="inline h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Premium</span>
                  <span className="sm:hidden">Pro</span>
                </div>
              )}
              
              <Button 
                variant="ghost" 
                onClick={logout} 
                className="text-white hover:bg-white/10 p-2 h-10 w-10 rounded-lg backdrop-blur-sm hover:shadow-lg hover:shadow-white/5 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Mobile User Info */}
          <div className="sm:hidden mt-2 pb-2">
            <div className="text-white text-sm">
              <span className="text-gray-300">Olá,</span> 
              <span className="font-medium ml-1">{user?.name?.split(' ')[0] || user?.name}</span>
            </div>
          </div>
        </div>
        
        {/* Subtle glow line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
      </header>

      <div className="mobile-container max-w-7xl mx-auto p-3 sm:p-6">
        <Tabs defaultValue="suggestions" className="space-y-3 sm:space-y-6">
          {/* Enhanced Mobile-First Tab Navigation */}
          <TabsList className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 border border-slate-600/50 w-full grid grid-cols-3 h-auto gap-0.5 p-1 rounded-2xl shadow-lg backdrop-blur-sm">
            <TabsTrigger 
              value="suggestions" 
              className="flex flex-col items-center justify-center py-3 px-2 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 rounded-xl transition-all duration-300 hover:bg-slate-600/50 min-h-[60px] touch-manipulation"
            >
              <Zap className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Sugestões</span>
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex flex-col items-center justify-center py-3 px-2 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 rounded-xl transition-all duration-300 hover:bg-slate-600/50 min-h-[60px] touch-manipulation"
            >
              <History className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Histórico</span>
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="flex flex-col items-center justify-center py-3 px-2 text-gray-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:via-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/25 rounded-xl transition-all duration-300 hover:bg-slate-600/50 min-h-[60px] touch-manipulation"
            >
              <User className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">Perfil</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-3 sm:space-y-6">
            {!user?.is_premium && !isTrialActive && (
              <Card className="mobile-card bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 border-0 shadow-xl">
                <CardContent className="p-4 sm:p-6 text-center">
                  <Crown className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-white mb-2 sm:mb-4" />
                  <h3 className="text-lg sm:text-2xl font-bold text-white mb-2">Trial Expirado</h3>
                  <p className="text-white/90 mb-4 text-sm sm:text-base leading-relaxed">
                    Faça upgrade para premium e continue aproveitando sugestões ilimitadas.
                  </p>
                  <Button 
                    onClick={handleUpgrade}
                    className="mobile-button bg-white text-slate-900 hover:bg-gray-100 font-semibold shadow-lg"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span className="text-sm">Upgrade Premium - R$ 14,90/mês</span>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Aviso Importante sobre as Sugestões */}
            <Card className="mobile-card bg-blue-950/60 border-blue-700/60 backdrop-blur-sm">
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-blue-400 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-blue-200 font-semibold text-xs sm:text-base mb-1 sm:mb-2">
                      ⚠️ Importante - Leia antes de usar
                    </h4>
                    <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                      <strong>As sugestões são orientações educacionais</strong> por IA. 
                      <strong>NÃO substituem</strong> profissionais de saúde. 
                      Sempre consulte especialistas antes de iniciar programas de exercícios ou mudança na alimentação.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mobile-grid md:grid md:grid-cols-2 gap-3 sm:gap-6">
              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-xl">
                    <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    Sugestão de Treino
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    IA personalizada baseada no seu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => generateSuggestion('workout')}
                    disabled={loading || (!user?.is_premium && !isTrialActive)}
                    className="mobile-button bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white font-semibold shadow-lg disabled:opacity-50 transition-all duration-300"
                  >
                    {loading && suggestionType === 'workout' ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2"></div>
                        <span>Gerando...</span>
                      </div>
                    ) : (
                      <>
                        <Dumbbell className="mr-2 h-4 w-4" />
                        <span>Gerar Treino</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-xl">
                    <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    Sugestão de Nutrição
                  </CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    Dieta balanceada para seus objetivos
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    onClick={() => generateSuggestion('nutrition')}
                    disabled={loading || (!user?.is_premium && !isTrialActive)}
                    className="mobile-button bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-semibold shadow-lg disabled:opacity-50 transition-all duration-300"
                  >
                    {loading && suggestionType === 'nutrition' ? (
                      <div className="flex items-center">
                        <div className="loading-spinner mr-2"></div>
                        <span>Gerando...</span>
                      </div>
                    ) : (
                      <>
                        <Apple className="mr-2 h-4 w-4" />
                        <span>Gerar Dieta</span>
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {currentSuggestion && (
              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-xl">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    {suggestionType === 'workout' ? (
                      <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    ) : (
                      <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    )}
                    <span className="hidden sm:inline">
                      {suggestionType === 'workout' ? 'Sua Sugestão de Treino' : 'Sua Sugestão de Nutrição'}
                    </span>
                    <span className="sm:hidden">
                      {suggestionType === 'workout' ? 'Seu Treino' : 'Sua Dieta'}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="suggestion-content mobile-optimized">
                    <div className="ai-response whitespace-pre-wrap text-sm sm:text-base leading-relaxed">
                      {currentSuggestion.suggestion}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-3 sm:space-y-6">
            <div className="mobile-grid md:grid md:grid-cols-2 gap-3 sm:gap-6">
              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    Histórico de Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {workoutHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Dumbbell className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-gray-400 text-sm">Nenhum treino gerado ainda.</p>
                    </div>
                  ) : (
                    workoutHistory.map((workout) => (
                      <div key={workout.id} className="p-3 bg-slate-700 rounded-xl border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10 h-8 w-8 p-0">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="mobile-modal bg-slate-800 border-slate-700 max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white flex items-center text-base sm:text-lg">
                                    <Dumbbell className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                                    Sugestão de Treino
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400 text-xs sm:text-sm">
                                    Gerado em {new Date(workout.created_at).toLocaleString('pt-BR')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-3 sm:mt-4">
                                  <div className="suggestion-content mobile-optimized">
                                    <div className="ai-response whitespace-pre-wrap text-sm leading-relaxed">
                                      {workout.suggestion}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"
                              onClick={() => deleteSuggestion(workout.id, 'workouts')}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-white text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {workout.suggestion.substring(0, 100)}...
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white flex items-center text-base sm:text-lg">
                    <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    Histórico de Nutrição
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-0">
                  {nutritionHistory.length === 0 ? (
                    <div className="text-center py-8">
                      <Apple className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-gray-400 text-sm">Nenhuma dieta gerada ainda.</p>
                    </div>
                  ) : (
                    nutritionHistory.map((nutrition) => (
                      <div key={nutrition.id} className="p-3 bg-slate-700 rounded-xl border border-slate-600">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs sm:text-sm text-gray-400 flex items-center">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            {new Date(nutrition.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-pink-400 hover:text-pink-300 hover:bg-pink-400/10 h-8 w-8 p-0">
                                  <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="mobile-modal bg-slate-800 border-slate-700 max-w-4xl">
                                <DialogHeader>
                                  <DialogTitle className="text-white flex items-center text-base sm:text-lg">
                                    <Apple className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-pink-500" />
                                    Sugestão de Nutrição
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400 text-xs sm:text-sm">
                                    Gerado em {new Date(nutrition.created_at).toLocaleString('pt-BR')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-3 sm:mt-4">
                                  <div className="suggestion-content mobile-optimized">
                                    <div className="ai-response whitespace-pre-wrap text-sm leading-relaxed">
                                      {nutrition.suggestion}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10 h-8 w-8 p-0"
                              onClick={() => deleteSuggestion(nutrition.id, 'nutrition')}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-white text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {nutrition.suggestion.substring(0, 100)}...
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-3 sm:space-y-6">
            <div className="mobile-grid lg:grid lg:grid-cols-2 gap-3 sm:gap-6">
              <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
                    <CardTitle className="text-white text-base sm:text-xl">Informações Pessoais</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mobile-button sm:w-auto border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-medium"
                      onClick={() => handleEditProfile()}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Editar Perfil
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 pt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Nome</Label>
                      <div className="text-white text-sm sm:text-base mt-1">{user?.name}</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Email</Label>
                      <div className="text-white text-sm sm:text-base mt-1 break-all">{user?.email}</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Idade</Label>
                      <div className="text-white text-sm sm:text-base mt-1">{user?.age} anos</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Peso</Label>
                      <div className="text-white text-sm sm:text-base mt-1">{user?.weight} kg</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg sm:col-span-1">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Altura</Label>
                      <div className="text-white text-sm sm:text-base mt-1">{user?.height} cm</div>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <Label className="text-gray-400 text-xs sm:text-sm font-medium">Tipo de Treino</Label>
                      <div className="text-white text-sm sm:text-base mt-1">
                        {user?.workout_type === 'academia' && '🏋️ Academia'}
                        {user?.workout_type === 'casa' && '🏠 Em Casa'}
                        {user?.workout_type === 'ar_livre' && '🌳 Ao Ar Livre'}
                        {!user?.workout_type && '🏋️ Academia (padrão)'}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <Label className="text-gray-400 text-xs sm:text-sm font-medium">Objetivos</Label>
                    <div className="text-white text-sm sm:text-base mt-1 leading-relaxed">{user?.goals}</div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <Label className="text-gray-400 text-xs sm:text-sm font-medium">Restrições Alimentares</Label>
                    <div className="text-white text-sm sm:text-base mt-1 leading-relaxed">
                      {user?.dietary_restrictions || 'Nenhuma restrição informada'}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-700/50 rounded-lg">
                    <Label className="text-gray-400 text-xs sm:text-sm font-medium">Atividades Físicas Atuais</Label>
                    <div className="text-white text-sm sm:text-base mt-1 leading-relaxed">
                      {user?.current_activities || 'Nenhuma atividade informada'}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3 sm:space-y-6">
                {/* Card do IMC */}
                <Card className="mobile-card bg-slate-800 border-slate-700 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center text-base sm:text-xl">
                      <Activity className="mr-2 h-5 w-5 text-orange-500" />
                      <span className="hidden sm:inline">Índice de Massa Corporal (IMC)</span>
                      <span className="sm:hidden">IMC</span>
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-xs sm:text-sm">
                      Indicador de saúde baseado em peso e altura
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {userBMI && bmiInfo ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="text-center p-4 bg-slate-700/50 rounded-xl">
                          <div className="text-2xl sm:text-4xl font-bold text-white mb-2">
                            {userBMI}
                          </div>
                          <div className={`inline-flex px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold ${bmiInfo.color} ${bmiInfo.bgColor}`}>
                            {bmiInfo.category}
                          </div>
                        </div>
                        
                        <div className="p-3 bg-slate-700/30 rounded-lg">
                          <div className="text-xs sm:text-sm text-gray-300 text-center">
                            <strong>Cálculo:</strong> {user?.weight}kg ÷ ({user?.height/100}m)² = {userBMI}
                          </div>
                        </div>
                        
                        {/* Escala visual do IMC - Compacta para mobile */}
                        <div className="space-y-2">
                          <div className="text-xs text-gray-400 font-medium">Referência IMC:</div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-blue-400">Abaixo</span>
                              <span className="text-gray-400">&lt; 18.5</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-green-400">Normal</span>
                              <span className="text-gray-400">18.5-24.9</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-yellow-400">Sobrepeso</span>
                              <span className="text-gray-400">25.0-29.9</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-orange-400">Obesidade I</span>
                              <span className="text-gray-400">30.0-34.9</span>
                            </div>
                            <div className="flex justify-between items-center col-span-2">
                              <span className="text-red-400">Obesidade II/III</span>
                              <span className="text-gray-400">≥ 35.0</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-400 bg-slate-700/50 p-3 rounded-lg border-l-2 border-orange-500">
                          <span className="font-medium">💡 Importante:</span> O IMC é uma referência geral. Consulte sempre um profissional de saúde para orientação personalizada.
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 text-center py-8">
                        <Activity className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                        <p className="text-sm">Dados insuficientes para calcular o IMC</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Card do Status da Conta */}
                <Card className="bg-slate-800 border-slate-700">
                  <CardHeader>
                    <CardTitle className="text-white text-lg sm:text-xl">Status da Conta</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm sm:text-base">Plano</span>
                      <div className="flex items-center">
                        {user?.is_premium ? (
                          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                            <Crown className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                            Premium
                          </div>
                        ) : (
                          <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                            isTrialActive 
                              ? 'bg-yellow-600 text-black' 
                              : 'bg-red-600 text-white'
                          }`}>
                            {isTrialActive ? 'Trial Ativo' : 'Trial Expirado'}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!user?.is_premium && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-sm sm:text-base">Trial termina em</span>
                          <span className="text-white text-sm sm:text-base">{trialDaysLeft} dias</span>
                        </div>
                        <Button 
                          onClick={handleUpgrade}
                          className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white py-3"
                        >
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span className="text-sm sm:text-base">Upgrade Premium - R$ 14,90/mês</span>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Zona de Perigo - Exclusão de Conta */}
            <Card className="bg-red-900/20 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ações irreversíveis que afetam sua conta permanentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Excluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Confirmar Exclusão da Conta
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        ⚠️ Esta ação é <strong>IRREVERSÍVEL</strong> e irá remover permanentemente:
                        <ul className="mt-2 ml-4 list-disc text-sm">
                          <li>Sua conta e dados pessoais</li>
                          <li>Todo histórico de treinos</li>
                          <li>Todo histórico de nutrição</li>
                          <li>Histórico de pagamentos</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4 my-4">
                      <div>
                        <Label className="text-white">Confirme sua senha</Label>
                        <div className="relative">
                          <Input
                            type={showDeletePassword ? "text" : "password"}
                            placeholder="Digite sua senha atual"
                            value={deleteAccountData.password}
                            onChange={(e) => setDeleteAccountData({...deleteAccountData, password: e.target.value})}
                            className="bg-slate-700 border-slate-600 text-white mt-1 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowDeletePassword(!showDeletePassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors bg-slate-600 p-1 rounded z-10"
                            tabIndex={-1}
                            title={showDeletePassword ? "Ocultar senha" : "Mostrar senha"}
                          >
                            {showDeletePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-white">
                          Digite "<strong>excluir minha conta</strong>" para confirmar
                        </Label>
                        <Input
                          placeholder="excluir minha conta"
                          value={deleteAccountData.confirmationText}
                          onChange={(e) => setDeleteAccountData({...deleteAccountData, confirmationText: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="bg-slate-700 text-white hover:bg-slate-600"
                        onClick={() => setDeleteAccountData({password: '', confirmationText: ''})}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Modal de Edição de Perfil */}
        <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
          <DialogContent className="bg-slate-800 border-slate-700 max-w-md mx-auto">
            <DialogHeader>
              <DialogTitle className="text-white flex items-center">
                <User className="mr-2 h-5 w-5 text-orange-500" />
                Editar Perfil
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Atualize suas informações para receber sugestões mais precisas da IA
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleUpdateProfile} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-age" className="text-white">Idade *</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    required
                    min="12"
                    max="100"
                    value={editProfileData.age}
                    onChange={(e) => setEditProfileData({...editProfileData, age: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="Idade"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-weight" className="text-white">Peso (kg) *</Label>
                  <Input
                    id="edit-weight"
                    type="number"
                    required
                    min="30"
                    max="300"
                    step="0.1"
                    value={editProfileData.weight}
                    onChange={(e) => setEditProfileData({...editProfileData, weight: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                    placeholder="70.5"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    💡 Peso em quilogramas. Ex: <strong>70.5</strong>
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-height" className="text-white">Altura (cm) *</Label>
                <Input
                  id="edit-height"
                  type="number"
                  required
                  min="120"
                  max="250"
                  value={editProfileData.height}
                  onChange={(e) => setEditProfileData({...editProfileData, height: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-1"
                  placeholder="175"
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Altura em centímetros. Ex: <strong>175</strong>
                </p>
              </div>
              
              <div>
                <Label htmlFor="edit-goals" className="text-white">Objetivos *</Label>
                <Textarea
                  id="edit-goals"
                  required
                  value={editProfileData.goals}
                  onChange={(e) => setEditProfileData({...editProfileData, goals: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[80px]"
                  placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condicionamento..."
                />
              </div>
              
              <div>
                <Label htmlFor="edit-restrictions" className="text-white">Restrições Alimentares</Label>
                <Textarea
                  id="edit-restrictions"
                  value={editProfileData.dietary_restrictions}
                  onChange={(e) => setEditProfileData({...editProfileData, dietary_restrictions: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[60px]"
                  placeholder="Ex: Vegano, alergia a glúten, intolerância à lactose..."
                />
              </div>
              
              <div>
                <Label htmlFor="edit-workout-type" className="text-white">Tipo de Treino *</Label>
                <select
                  id="edit-workout-type"
                  required
                  value={editProfileData.workout_type}
                  onChange={(e) => setEditProfileData({...editProfileData, workout_type: e.target.value})}
                  className="w-full bg-slate-700 border border-slate-600 text-white mt-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="academia">🏋️ Academia (equipamentos completos)</option>
                  <option value="casa">🏠 Em Casa (peso corporal/básico)</option>
                  <option value="ar_livre">🌳 Ao Ar Livre (parques/ruas)</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  💡 A IA adaptará os treinos para o ambiente escolhido
                </p>
              </div>
              
              <div>
                <Label htmlFor="edit-current-activities" className="text-white">
                  Atividades Físicas Atuais
                  <span className="text-gray-400 text-sm ml-1">(opcional)</span>
                </Label>
                <Textarea
                  id="edit-current-activities"
                  placeholder="Ex: Futebol 2x/semana, Beach tennis, Academia, Corrida, Natação, Pilates..."
                  value={editProfileData.current_activities}
                  onChange={(e) => setEditProfileData({...editProfileData, current_activities: e.target.value})}
                  className="bg-slate-700 border-slate-600 text-white mt-1 min-h-[60px]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  💡 Informe atividades que você já pratica para treinos mais inteligentes e complementares
                </p>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setEditProfileOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white"
                >
                  {isUpdatingProfile ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Atualizando...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/auth" />;
};

// Auth Page Component
const AuthPage = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <AuthForms />;
};

// Payment Success Component
const PaymentSuccess = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, []);
  
  const checkPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      toast({
        title: "Verificação de pagamento",
        description: "Não foi possível verificar o status do pagamento. Entre em contato conosco.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.payment_status === 'paid') {
        toast({
          title: "Pagamento confirmado!",
          description: "Sua conta Premium foi ativada com sucesso."
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">Pagamento Realizado!</h2>
          <p className="text-gray-400 mb-6">
            Estamos verificando seu pagamento. Você será redirecionado em instantes.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
};

// Payment Cancel Component
const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-white mb-4">Pagamento Cancelado</h2>
          <p className="text-gray-400 mb-6">
            Não se preocupe! Você ainda pode fazer upgrade para Premium a qualquer momento.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white"
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;